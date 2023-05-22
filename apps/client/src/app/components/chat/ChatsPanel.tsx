import {
  Drawer,
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { EmptyState } from '../shared/EmptyState';
import styled from 'styled-components';
import { useRef } from 'react';

// const chats = ['Inbox', 'Starred', 'Send email', 'Drafts'];
const chats: string[] = [];

const ListWrapper = styled.div`
  overflow-y: auto;
  height: calc(100vh - 65px);
`;

type Props = {
  panelWidth: number;
};

const emptyStateMessages = [
  'There are no active chats',
  "To add a chat, use the '+' button at the top",
];

export function ChatsPanel(props: Props) {
  const listWrapperRef = useRef(null);

  return (
    <Drawer
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
      <Toolbar />
      <Divider />
      <ListWrapper ref={listWrapperRef}>
        {chats.length ? (
          <List>
            {chats.map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <EmptyState
            icon={<ChatIcon />}
            messages={emptyStateMessages}
          ></EmptyState>
        )}
      </ListWrapper>
    </Drawer>
  );
}
