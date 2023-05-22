// add types

import { Box} from '@mui/material';
import { ChatsPanel } from './ChatsPanel';
import { ChatRoom } from './ChatRoom';

const panelWidth = 240;

export function ChatMain() {
  return (
    <Box sx={{ display: 'flex' }}>
      <ChatsPanel panelWidth={panelWidth}></ChatsPanel>
      <ChatRoom panelWidth={panelWidth}></ChatRoom>
    </Box>
  );
}
