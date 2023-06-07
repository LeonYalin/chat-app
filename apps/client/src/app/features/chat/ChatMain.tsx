import { Box, Fade, LinearProgress } from '@mui/material';
import { ChatsPanel } from './ChatsPanel';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  selectChats,
  selectSelectedChat,
  addChatAsync,
  loadChatsAsync,
  setSelectedChatId,
  selectUIState,
} from './chat.slice';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { UIState } from '@client/utils/enums';

const panelWidth = 240;

const ChatDetailsWrapper = styled.div<{ width: number | null }>`
  overflow-y: auto;
  height: calc(100vh);
  width: ${props => (props.width ? 'calc(100vw - ' + props.width + 'px)' : '100%')};
`;

export function ChatMain() {
  const dispatch = useAppDispatch();
  const chats = useAppSelector(selectChats);
  const selectedChat = useAppSelector(selectSelectedChat);
  const uiState = useAppSelector(selectUIState);
  const navigate = useNavigate();

  useEffect(() => {
    // async function loadChats() {
    // const action = await dispatch(loadChatsAsync());
    // if (loadChatsAsync.fulfilled.match(action)) {
    //   const chats = action.payload.data.chats;
    //   const chatIdFromParamsValid = chats.some(chat => chat.id === chatId);
    //   const selectedChatId = (chatIdFromParamsValid ? chatId : chats[0]?.id) || null;
    //   dispatch(setInitialData({ chats, selectedChatId }));
    // }
    // }
    // loadChats();
    dispatch(loadChatsAsync());
  }, [dispatch]);

  return (
    <Box sx={{ display: 'flex' }}>
      {uiState === UIState.LOADING ? (
        <Fade in={uiState === UIState.LOADING}>
          <Box sx={{ position: 'absolute', zIndex: 10000, width: '100%' }}>
            <LinearProgress />
          </Box>
        </Fade>
      ) : null}

      <ChatsPanel
        panelWidth={panelWidth}
        chats={chats}
        selectedChat={selectedChat}
        onAddChatClick={() => dispatch(addChatAsync())}
        onChatClick={chatId => {
          navigate(`/chats/${chatId}`);
        }}
        onLogoClick={() => {
          dispatch(setSelectedChatId({ selectedChatId: null }));
          navigate('/');
        }}
      ></ChatsPanel>
      <ChatDetailsWrapper data-testid="chat-room" width={panelWidth}>
        <Outlet />
      </ChatDetailsWrapper>
    </Box>
  );
}
