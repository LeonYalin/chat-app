import { Avatar, Paper, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { ChatMessage } from '@shared/models/chat.model';
import { User } from '@shared/models/user.model';
import styled from 'styled-components';

type Props = {
  user: User | null;
  messages: ChatMessage[];
};

type BubbleProps = {
  children: React.ReactNode;
};

const BubbleContainer = styled(Paper)`
  display: inline-block;
  max-width: 80%;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 8px;
`;

const LeftBubbleContainer = styled(BubbleContainer)`
  background-color: white !important;
  text-align: left;
`;

const RightBubbleContainer = styled(BubbleContainer)`
  background-color: rgb(229, 246, 253) !important;
  text-align: right;
  color: #fff;
`;

const ChatBubble = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChatBubbleLeft = ({ children }: BubbleProps) => {
  return (
    <LeftBubbleContainer>
      <ChatBubble>{children}</ChatBubble>
    </LeftBubbleContainer>
  );
};

const ChatBubbleRight = ({ children }: BubbleProps) => {
  return (
    <RightBubbleContainer>
      <ChatBubble>{children}</ChatBubble>
    </RightBubbleContainer>
  );
};

function isCurrentUser(currentUser: User | null, userName: string) {
  return currentUser?.name === userName;
}

export function ChatMessages(props: Props) {
  return (
    <List sx={{ width: '100%', height: 'calc(100% - 65px)' }}>
      {props.messages.map(cm => (
        <ListItem
          data-testid="chat-message"
          alignItems="flex-start"
          key={cm.id}
          sx={{ justifyContent: isCurrentUser(props.user, cm.userName) ? 'right' : 'left' }}
        >
          {isCurrentUser(props.user, cm.userName) ? (
            <ChatBubbleRight>
              <ListItemAvatar>
                <Avatar alt={cm.userName} src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText primary={cm.userName} secondary={cm.content} />
            </ChatBubbleRight>
          ) : (
            <ChatBubbleLeft>
              <ListItemAvatar>
                <Avatar alt={cm.userName} src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText primary={cm.userName} secondary={cm.content} />
            </ChatBubbleLeft>
          )}
        </ListItem>
      ))}
    </List>
  );
}
