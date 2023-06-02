import styled from 'styled-components';
import { ChatHeader } from './ChatHeader';
import { ChatBody } from './ChatBody';
import { Chat } from '@shared/models/chat.model';

type Props = {
  chat: Chat | null;
  panelWidth: number;
  onChatMessage: (message: string) => void;
  onChatDelete: (chatId: string) => void;
  onChatNameChange: (chatId: string, newName: string) => void;
};

const Wrapper = styled.div<{ width: number | null }>`
  overflow-y: auto;
  height: calc(100vh);
  width: ${props => (props.width ? 'calc(100vw - ' + props.width + 'px)' : '100%')};
`;

export function ChatRoom(props: Props) {
  return (
    <Wrapper data-testid="chat-room" width={props.panelWidth}>
      <ChatHeader chat={props.chat} onChatDelete={props.onChatDelete} onChatNameChange={props.onChatNameChange}></ChatHeader>
      <ChatBody chat={props.chat} onChatMessage={props.onChatMessage}></ChatBody>
    </Wrapper>
  );
}
