import {
  Drawer,
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { EmptyState } from '../../shared/EmptyState';
import styled from 'styled-components';
import { useRef } from 'react';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Chat } from '@shared/models/chat.model';

const ListWrapper = styled.div`
  overflow-y: auto;
  height: calc(100vh - 4px);
`;

const LogoWrapper = styled.div`
  font-size: 18px;
  display: flex;
  flex-grow: 1;
`;

const FaviconWrapper = styled.img`
  width: 25px;
  height: 25px;
  margin-right: 5px;
`;

type Props = {
  chats: Chat[];
  selectedChat: Chat | null;
  panelWidth: number;
  onAddChatClick: () => void;
  onChatClick: (chatId: string) => void;
};

const emptyStateMessages = ['There are no active chats.', 'Create a new chat to start messaging.'];

export function ChatsPanel(props: Props) {
  const listWrapperRef = useRef(null);

  return (
    <Drawer
      data-testid="chats-panel"
      sx={{
        width: props.panelWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: props.panelWidth,
          boxSizing: 'border-box',
        },
        height: '100vh',
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <LogoWrapper>
            <FaviconWrapper src="favicon.ico" />
            <span>LY__Chat</span>
          </LogoWrapper>
          <IconButton data-testid="add-chat-btn-header" color="primary" aria-label="Create Chat" onClick={props.onAddChatClick}>
            <AddIcon />
          </IconButton>
        </Box>
      </Toolbar>
      <Divider />
      <ListWrapper ref={listWrapperRef}>
        {props.chats.length ? (
          <List data-testid="chats-list">
            {props.chats.map(chat => (
              <ListItem
                data-testid="chats-list-item"
                selected={props.selectedChat?.id === chat.id}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: '#dedcdc',
                  },
                }}
                key={chat.id}
                disablePadding
                onClick={() => props.onChatClick(chat.id)}
              >
                <ListItemButton>
                  <ListItemIcon>{<AccountCircleIcon />}</ListItemIcon>
                  <ListItemText primary={chat.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <EmptyState icon={<ChatIcon />} messages={emptyStateMessages}>
            <Button data-testid="add-chat-btn-body" variant="outlined" startIcon={<AddIcon />} onClick={props.onAddChatClick}>
              Add Chat
            </Button>
          </EmptyState>
        )}
      </ListWrapper>
    </Drawer>
  );
}
