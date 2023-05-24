// add types

import { Box } from '@mui/material';
import { ChatsPanel } from './ChatsPanel';
import { ChatRoom } from './ChatRoom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { addChat, selectChats, selectSelectedChat, addChatMessage } from './chat.slice';

const panelWidth = 240;

export function ChatMain() {
  const dispatch = useAppDispatch();
  const chats = useAppSelector(selectChats);
  const selectedChat = useAppSelector(selectSelectedChat);
  return (
    <Box sx={{ display: 'flex' }}>
      <ChatsPanel panelWidth={panelWidth} chats={chats} onAddChatClick={() => dispatch(addChat())}></ChatsPanel>
      <ChatRoom panelWidth={panelWidth} chat={selectedChat} onChatMessage={content => dispatch(addChatMessage({ content }))}></ChatRoom>
    </Box>
  );
}
