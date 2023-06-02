import { Drawer, Toolbar, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button, IconButton } from '@mui/material';
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

type Props = {
  chats: Chat[];
  panelWidth: number;
  onAddChatClick: () => void;
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
      <Toolbar style={{ justifyContent: 'center' }}></Toolbar>
      <Divider />
      <ListWrapper ref={listWrapperRef}>
        {props.chats.length ? (
          <List data-testid="chats-list">
            {props.chats.map(chat => (
              <ListItem data-testid="chats-list-item" key={chat.id} disablePadding>
                <ListItemButton>
                  <ListItemIcon>{<AccountCircleIcon />}</ListItemIcon>
                  <ListItemText primary={chat.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <EmptyState icon={<ChatIcon />} messages={emptyStateMessages}>
            <Button data-testid="add-chat" variant="outlined" startIcon={<AddIcon />} onClick={props.onAddChatClick}>
              Add Chat
            </Button>
          </EmptyState>
        )}
      </ListWrapper>
    </Drawer>
  );
}
