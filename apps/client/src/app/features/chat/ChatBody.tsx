import styled from 'styled-components';
import { EmptyState } from '../../shared/EmptyState';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { ChatMessages } from './ChatMessages';
import { ChatMessageBox } from './ChatMessageBox';
import { Chat } from '@shared/models/chat.model';

type Props = {
  chat: Chat | null;
  onChatMessage: (message: string) => void;
};

const Wrapper = styled.div`
  overflow-y: auto;
  height: calc(100% - 65px);
  padding: 16px;
`;

const noChatMessages = ['Select a chat to start messaging'];
const emptyConversationMessages = ["You're starting a new conversation.", 'Type your first message below.'];

export function ChatBody(props: Props) {
  return (
    <Wrapper>
      {props.chat ? (
        <>
          {props.chat.messages.length > 0 ? (
            <ChatMessages messages={props.chat.messages}></ChatMessages>
          ) : (
            <EmptyState
              style={{ height: 'calc(100% - 56px)' }}
              icon={<ChatBubbleOutlineIcon />}
              messages={emptyConversationMessages}
            ></EmptyState>
          )}
          <ChatMessageBox onChatMessage={props.onChatMessage}></ChatMessageBox>
        </>
      ) : (
        <EmptyState icon={<QuestionAnswerIcon />} messages={noChatMessages}></EmptyState>
      )}
    </Wrapper>
  );
}
