import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState, AppThunk } from '../../store';
import { UIState } from '@client/utils/enums';
import { createChat, Chat, ChatMessage } from '@shared/models/chat.model';
import {
  addChatApi,
  addChatMessageApi,
  changeChatNameApi,
  changeChatParticipantsApi,
  deleteChatApi,
  loadAllChatsApi,
  loadChatApi,
} from './chat.api';
import { User } from '@shared/models/user.model';
import { useNavigate } from 'react-router-dom';

export interface ChatState {
  chats: Chat[];
  selectedChatId: string | null;
  users: User[];
  uiState: UIState;
}

const initialState: ChatState = {
  chats: [],
  selectedChatId: null,
  users: [],
  uiState: UIState.IDLE,
};

export const loadChatAsync = createAsyncThunk('chat/loadChatAsync', ({ chatId }: { chatId: string }) => {
  return loadChatApi({ chatId });
});

export const changeChatNameAsync = createAsyncThunk(
  'chat/changeChatNameAsync',
  ({ chatId, newName }: { chatId: string; newName: string }) => {
    return changeChatNameApi({ chatId, newName });
  },
);

export const addChatMessageAsync = createAsyncThunk(
  'chat/addChatMessageAsync',
  ({ chatId, content, userName }: { chatId: string; content: string; userName: string }) => {
    return addChatMessageApi({ chatId, content, userName });
  },
);

export const deleteChatAsync =
  ({ chatId, navigate }: { chatId: string; navigate: ReturnType<typeof useNavigate> }): AppThunk =>
  (dispatch, getState) => {
    deleteChatApi({ chatId })
      .then(res => {
        const deletedChatId = res.data?.deleteChat;
        if (deletedChatId) {
          dispatch(deleteChat({ chatId: deletedChatId }));
          const newSelectedChatId = getState().chat.chats.at(-1)?.id || null;
          dispatch(setSelectedChatId({ selectedChatId: newSelectedChatId }));
          navigate(`/chats/${newSelectedChatId}`);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

export const addChatAsync =
  ({ chat, navigate }: { chat: Partial<Chat>; navigate: ReturnType<typeof useNavigate> }): AppThunk =>
  (dispatch, getState) => {
    addChatApi({ chat: createChat({ ...chat }) })
      .then(res => {
        const addedChat = res.data?.addChat;
        if (addedChat) {
          dispatch(addChat({ chat: addedChat }));
          dispatch(setSelectedChatId({ selectedChatId: addedChat.id }));
          navigate(`/chats/${addedChat.id}`);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

export const loadAllChatsAsync = (): AppThunk => (dispatch, getState) => {
  loadAllChatsApi()
    .then(res => {
      const chats = res.data.loadAllChats;
      if (chats?.length > 0) {
        dispatch(setChats({ chats }));
      }
    })
    .catch(err => {
      console.log(err);
    });
};

export const changeChatParticipantsAsync =
  ({ chatId, participants, newName }: { chatId: string; participants: User[]; newName?: string }): AppThunk =>
  (dispatch, getState) => {
    changeChatParticipantsApi({ chatId, participants, newName })
      .then(res => {
        const chat = res.data?.changeChatParticipants;
        if (chat) {
          dispatch(updateChat({ chat }));
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addChat: (state, action: PayloadAction<{ chat: Chat }>) => {
      const { chat } = action.payload;
      state.chats.push(chat);
    },
    setChats: (state, action: PayloadAction<{ chats: Chat[] }>) => {
      const { chats } = action.payload;
      state.chats = chats;
    },
    updateChat: (state, action: PayloadAction<{ chat: Chat }>) => {
      const { chat } = action.payload;
      const index = state.chats.findIndex(c => c.id === chat.id);
      if (index > -1) {
        state.chats[index] = chat;
      }
    },
    deleteChat: (state, action: PayloadAction<{ chatId: string }>) => {
      const { chatId } = action.payload;
      state.chats = state.chats.filter(chat => chat.id !== chatId);
    },
    addChatMessage: (state, action: PayloadAction<{ chatId: string; message: ChatMessage }>) => {
      const { chatId, message } = action.payload;
      const chat = state.chats.find(chat => chat.id === chatId);
      if (chat) {
        const messageExists = chat.messages.find(m => m.id === message.id);
        if (!messageExists) {
          chat.messages.push(message);
        }
      }
    },
    setSelectedChatId: (state, action: PayloadAction<{ selectedChatId: string | null }>) => {
      const { selectedChatId } = action.payload;
      state.selectedChatId = selectedChatId;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadChatAsync.fulfilled, (state, action) => {
        const loadedChat = action.payload.data.loadChat;
        const index = state.chats.findIndex(chat => chat.id === loadedChat.id);
        state.chats[index] = loadedChat;
        state.selectedChatId = loadedChat.id;
      })
      .addCase(changeChatNameAsync.fulfilled, (state, action) => {
        const changedChat = action.payload.data?.changeChatName;
        if (changedChat) {
          const chat = state.chats.find(chat => chat.id === changedChat.id);
          if (chat) {
            chat.name = changedChat.name;
          }
        }
      })
      .addCase(addChatMessageAsync.fulfilled, (state, action) => {
        const response = action.payload.data?.addChatMessage;
        if (response) {
          const { chatId, message } = response;
          const chat = state.chats.find(chat => chat.id === chatId);
          if (chat) {
            chat.messages.push(message);
          }
        }
      })
      .addMatcher(
        action => action.type.endsWith('/pending'),
        state => {
          state.uiState = UIState.LOADING;
        },
      )
      .addMatcher(
        action => action.type.endsWith('/rejected'),
        state => {
          state.uiState = UIState.FAILED;
        },
      )
      .addMatcher(
        action => action.type.endsWith('/fulfilled'),
        state => {
          state.uiState = UIState.IDLE;
        },
      );
  },
});

export const { setChats, updateChat, addChat, deleteChat, addChatMessage, setSelectedChatId } = chatSlice.actions;

export const selectChatState = (state: RootState) => state.chat;
export const selectChats = (state: RootState) => state.chat.chats;
export const selectSelectedChat = (state: RootState) => state.chat.chats.find(chat => chat.id === state.chat.selectedChatId) || null;
export const selectUIState = (state: RootState) => state.chat.uiState;

export default chatSlice.reducer;
