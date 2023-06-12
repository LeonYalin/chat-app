import { Toolbar, Box, Divider } from '@mui/material';
import { Chat } from '@shared/models/chat.model';
import { User } from '@shared/models/user.model';
import { ChatHeaderActions } from './ChatHeaderActions';
import { ChatHeaderUserMenu } from './ChatHeaderUserMenu';

type Props = {
  chat: Chat | null;
  user: User | null;
  onChatDelete: (chatId: string) => void;
  onChatNameChange: (chatId: string, newName: string) => void;
  onSignOut: () => void;
  onUserDelete: () => void;
};

export function ChatHeader(props: Props) {
  return (
    <>
      <Toolbar sx={{ marginLeft: '7px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          {props.chat ? (
            <ChatHeaderActions
              chat={props.chat}
              onChatDelete={props.onChatDelete}
              onChatNameChange={props.onChatNameChange}
            ></ChatHeaderActions>
          ) : null}
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          {props.user && <ChatHeaderUserMenu onSignOut={props.onSignOut} onUserDelete={props.onUserDelete}></ChatHeaderUserMenu>}
        </Box>
      </Toolbar>
      <Divider />
    </>
  );
}
