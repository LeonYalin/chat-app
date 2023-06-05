import { Box } from '@mui/material';
import { ChatsPanel } from './ChatsPanel';
import { ChatRoom } from './ChatRoom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  selectChats,
  selectSelectedChat,
  addChatAsync,
  loadChatsAsync,
  deleteChatAsync,
  changeChatNameAsync,
  addChatMessageAsync,
  loadChatAsync,
} from './chat.slice';
import { useEffect } from 'react';

const panelWidth = 240;

export function ChatMain() {
  const dispatch = useAppDispatch();
  const chats = useAppSelector(selectChats);
  const selectedChat = useAppSelector(selectSelectedChat);

  useEffect(() => {
    dispatch(loadChatsAsync());
  }, [dispatch]);

  return (
    <Box sx={{ display: 'flex' }}>
      <ChatsPanel
        panelWidth={panelWidth}
        chats={chats}
        selectedChat={selectedChat}
        onAddChatClick={() => dispatch(addChatAsync())}
        onChatClick={chatId => dispatch(loadChatAsync({ chatId }))}
      ></ChatsPanel>
      <ChatRoom
        panelWidth={panelWidth}
        chat={selectedChat}
        onChatMessage={content => dispatch(addChatMessageAsync({ chatId: selectedChat?.id || '', content }))}
        onChatDelete={chatId => dispatch(deleteChatAsync({ chatId }))}
        onChatNameChange={(chatId, newName) => dispatch(changeChatNameAsync({ chatId, newName }))}
      ></ChatRoom>
    </Box>
  );
}
