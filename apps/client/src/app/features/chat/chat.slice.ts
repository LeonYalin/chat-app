import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState, AppThunk } from '../../store';
import { UIState } from '@client/utils/enums';
import { User, createChat, Chat } from '@shared/models/chat.model';
import { addChatApi, addChatMessageApi, changeChatNameApi, deleteChatApi, loadAllChatsApi, loadChatApi } from './chat.api';

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

export const addChatAsync = createAsyncThunk('chat/addChatAsync', () => {
  return addChatApi({ chat: createChat() });
});

export const loadChatAsync = createAsyncThunk('chat/loadChatAsync', ({ chatId }: { chatId: string }) => {
  return loadChatApi({ chatId });
});

export const deleteChatAsync = createAsyncThunk('chat/deleteChatAsync', ({ chatId }: { chatId: string }) => {
  return deleteChatApi({ chatId });
});

export const changeChatNameAsync = createAsyncThunk(
  'chat/changeChatNameAsync',
  ({ chatId, newName }: { chatId: string; newName: string }) => {
    return changeChatNameApi({ chatId, newName });
  },
);

export const addChatMessageAsync = createAsyncThunk(
  'chat/addChatMessageAsync',
  ({ chatId, content }: { chatId: string; content: string }) => {
    return addChatMessageApi({ chatId, content });
  },
);

export const loadAllChatsAsync = (): AppThunk => (dispatch, getState) => {
  loadAllChatsApi()
    .then(res => {
      const chats = res.data.loadAllChats;
      if (chats?.length > 0) {
        dispatch(setChats({ chats }));
      }
    })
    .catch(err => {
      // setError(err.message);
    });
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<{ chats: Chat[] }>) => {
      const { chats } = action.payload;
      state.chats = chats;
    },
    setSelectedChatId: (state, action: PayloadAction<{ selectedChatId: string | null }>) => {
      const { selectedChatId } = action.payload;
      state.selectedChatId = selectedChatId;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(addChatAsync.fulfilled, (state, action) => {
        const addedChat = action.payload.data?.addChat;
        if (addedChat) {
          state.chats.push(addedChat);
          state.selectedChatId = addedChat.id;
        }
      })
      .addCase(loadChatAsync.fulfilled, (state, action) => {
        const loadedChat = action.payload.data.loadChat;
        const index = state.chats.findIndex(chat => chat.id === loadedChat.id);
        state.chats[index] = loadedChat;
        state.selectedChatId = loadedChat.id;
      })
      .addCase(deleteChatAsync.fulfilled, (state, action) => {
        const deletedChatId = action.payload.data?.deleteChat;
        if (deletedChatId) {
          state.chats = state.chats.filter(chat => chat.id !== deletedChatId);
          state.selectedChatId = state.chats.length ? state.chats[0].id : null;
        }
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

export const { setChats, setSelectedChatId } = chatSlice.actions;

export const selectChatState = (state: RootState) => state.chat;
export const selectChats = (state: RootState) => state.chat.chats;
export const selectSelectedChat = (state: RootState) => state.chat.chats.find(chat => chat.id === state.chat.selectedChatId) || null;
export const selectUIState = (state: RootState) => state.chat.uiState;

export default chatSlice.reducer;
