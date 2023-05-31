import { IconButton, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import styled from 'styled-components';
import { useState } from 'react';

type Props = {
  onChatMessage: (message: string) => void;
};

const Wrapper = styled.div`
  display: flex;
}`;

export function ChatMessageBox(props: Props) {
  const [text, setText] = useState('');
  return (
    <Wrapper>
      <TextField
        inputProps={{ 'data-testid': 'chat-message-box-input' }}
        id="msgbox"
        value={text}
        onChange={e => setText(e.target.value)}
        label="Type a new message"
        variant="outlined"
        fullWidth
      />
      <IconButton data-testid="chat-message-box-send-btn" color="primary" aria-label="Send" onClick={() => props.onChatMessage(text)}>
        <SendIcon fontSize="large" />
      </IconButton>
    </Wrapper>
  );
}
