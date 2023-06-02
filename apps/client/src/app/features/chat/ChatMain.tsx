// add types

import { Box } from '@mui/material';
import { ChatsPanel } from './ChatsPanel';
import { ChatRoom } from './ChatRoom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectChats, selectSelectedChat, addChatMessage, deleteChat, changeChatName, addChatAsync, loadChatsAsync } from './chat.slice';
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
      <ChatsPanel panelWidth={panelWidth} chats={chats} onAddChatClick={() => dispatch(addChatAsync())}></ChatsPanel>
      <ChatRoom
        panelWidth={panelWidth}
        chat={selectedChat}
        onChatMessage={content => dispatch(addChatMessage({ content }))}
        onChatDelete={chatId => dispatch(deleteChat({ chatId }))}
        onChatNameChange={(chatId, newName) => dispatch(changeChatName({ chatId, newName }))}
      ></ChatRoom>
    </Box>
  );
}
