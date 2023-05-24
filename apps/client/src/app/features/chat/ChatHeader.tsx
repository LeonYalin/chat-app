import { AppBar, Toolbar, Typography, Box, Divider } from '@mui/material';
import { Chat } from './chat.model';

type Props = {
  chat: Chat | null;
};

export function ChatHeader(props: Props) {
  return (
    <>
      <Toolbar>{props.chat?.name}</Toolbar>
      <Divider />
    </>
  );
}
