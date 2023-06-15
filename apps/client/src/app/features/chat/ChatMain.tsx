import { Box, Fade, LinearProgress } from '@mui/material';
import { ChatsPanel } from './ChatsPanel';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  selectChats,
  selectSelectedChat,
  addChatAsync,
  loadAllChatsAsync,
  setSelectedChatId,
  selectUIState,
  addChatMessage,
} from './chat.slice';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { UIState } from '@client/utils/enums';
import { loadAllUsersAsync, selectUser } from '../auth/auth.slice';
import { omit } from 'lodash';
import { messageAddedSubscriptionApi } from './chat.api';
import { useDialog } from '@client/hooks/useDialog';

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
  const user = useAppSelector(selectUser);
  const uiState = useAppSelector(selectUIState);
  const navigate = useNavigate();
  const { toast } = useDialog();

  useEffect(() => {
    dispatch(loadAllChatsAsync());
    dispatch(loadAllUsersAsync());
  }, [dispatch]);

  useEffect(() => {
    const subscription = messageAddedSubscriptionApi().subscribe(res => {
      const chatId = res.data?.messageAdded.chatId;
      const message = res.data?.messageAdded.message;
      if (chatId && message) {
        const messageIsFromCurrentUser = user?.name === message?.userName;
        if (!messageIsFromCurrentUser) {
          toast.show({
            title: `Message from ${message?.userName}`,
            message: message?.content,
            onClick: () => navigate(`/chats/${chatId}`),
          });
          dispatch(addChatMessage({ chatId, message: omit(message, '__typename') }));
        }
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
        onAddChatClick={() => {
          const participants = user ? [omit(user, '__typename')] : [];
          dispatch(addChatAsync({ chat: { participants }, navigate }));
        }}
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
