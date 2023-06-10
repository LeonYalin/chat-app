import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { ChatMessage } from '@shared/models/chat.model';

type Props = {
  messages: ChatMessage[];
};

export function ChatMessages(props: Props) {
  return (
    <List sx={{ width: '100%', height: 'calc(100% - 65px)', maxWidth: 360, bgcolor: 'background.paper' }}>
      {props.messages.map(cm => (
        <ListItem data-testid="chat-message" alignItems="flex-start" key={cm.id}>
          <ListItemAvatar>
            <Avatar alt={cm.userId} src="/static/images/avatar/1.jpg" />
          </ListItemAvatar>
          <ListItemText primary={cm.userId} secondary={cm.content} />
        </ListItem>
      ))}
    </List>
  );
}
