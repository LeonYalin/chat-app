import styled from 'styled-components';
import { ChatHeader } from './ChatHeader';
import { ChatBody } from './ChatBody';
import { Chat } from './chat.model';

type Props = {
  chat: Chat | null;
  onChatMessage: (message: string) => void;
  onChatDelete: (chatId: string) => void;
  onChatNameChange: (chatId: string, newName: string) => void;
  panelWidth: number;
};

const Wrapper = styled.div<{ width: number | null }>`
  overflow-y: auto;
  height: calc(100vh);
  width: ${props => (props.width ? 'calc(100vw - ' + props.width + 'px)' : '100%')};
`;

export function ChatRoom(props: Props) {
  return (
    <Wrapper width={props.panelWidth}>
      <ChatHeader chat={props.chat} onChatDelete={props.onChatDelete} onChatNameChange={props.onChatNameChange}></ChatHeader>
      <ChatBody chat={props.chat} onChatMessage={props.onChatMessage}></ChatBody>
    </Wrapper>
  );
}
