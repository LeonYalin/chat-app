import styled from 'styled-components';
import { EmptyState } from '../../shared/EmptyState';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { ChatMessages } from './ChatMessages';
import { Chat } from '@shared/models/chat.model';
import { User } from '@shared/models/user.model';

type Props = {
  chat: Chat | null;
  user: User | null;
};

const Wrapper = styled.div<{ withChat: boolean | false }>`
  overflow-y: auto;
  height: ${props => 'calc(100% - ' + (props.withChat ? '153px)' : '65px)')};
  padding: 16px;
  background-color: #ececec;
`;

const noChatMessages = ['Select a chat to start messaging'];
const emptyConversationMessages = ["You're starting a new conversation.", 'Type your first message below.'];

export function ChatBody(props: Props) {
  return (
    <Wrapper withChat={!!props.chat}>
      {props.chat ? (
        <>
          {props.chat.messages.length > 0 ? (
            <ChatMessages user={props.user} messages={props.chat.messages}></ChatMessages>
          ) : (
            <EmptyState icon={<ChatBubbleOutlineIcon />} messages={emptyConversationMessages}></EmptyState>
          )}
        </>
      ) : (
        <EmptyState icon={<QuestionAnswerIcon />} messages={noChatMessages}></EmptyState>
      )}
    </Wrapper>
  );
}
