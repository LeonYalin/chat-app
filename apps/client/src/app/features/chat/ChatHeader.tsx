import { Toolbar, Box, Divider, Typography } from '@mui/material';
import { Chat } from '@shared/models/chat.model';
import { User } from '@shared/models/user.model';
import { ChatHeaderActions } from './ChatHeaderActions';
import { ChatHeaderUserMenu } from './ChatHeaderUserMenu';
import { ChatHeaderParticipants } from './ChatHeaderParticipants';

type Props = {
  chat: Chat | null;
  user: User | null;
  allUsers: User[];
  participantsEmpty: boolean;
  onChatDelete: (chatId: string) => void;
  onChatNameChange: (chatId: string, newName: string) => void;
  onSignOut: () => void;
  onUserDelete: () => void;
  onParticipantsChange: (participants: User[]) => void;
};

export function ChatHeader(props: Props) {
  return (
    <>
      <Toolbar sx={{ marginLeft: '7px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          {props.chat && props.participantsEmpty ? (
            <Typography component={'div'} sx={{ width: '100%', pr: 3 }}>
              <ChatHeaderParticipants
                user={props.user}
                participants={props.chat?.participants}
                availableParticipants={props.allUsers}
                onParticipantsChange={props.onParticipantsChange}
              ></ChatHeaderParticipants>
            </Typography>
          ) : (
            <ChatHeaderActions
              chat={props.chat}
              onChatDelete={props.onChatDelete}
              onChatNameChange={props.onChatNameChange}
            ></ChatHeaderActions>
          )}
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          {props.user && <ChatHeaderUserMenu onSignOut={props.onSignOut} onUserDelete={props.onUserDelete}></ChatHeaderUserMenu>}
        </Box>
      </Toolbar>
      <Divider />
    </>
  );
}
