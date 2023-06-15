import { IconButton, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import styled from 'styled-components';
import { useState } from 'react';

type Props = {
  disabled?: boolean;
  onChatMessage: (message: string) => void;
};

const Wrapper = styled.div`
  background-color: #ececec;
  display: flex;
  padding: 16px 24px;
}`;

export function ChatMessageBox(props: Props) {
  const [text, setText] = useState('');
  return (
    <Wrapper>
      <TextField
        disabled={props.disabled}
        inputProps={{ 'data-testid': 'chat-message-box-input', sx: { backgroundColor: 'white' } }}
        id="msgbox"
        value={text}
        onChange={e => setText(e.target.value)}
        label="Type a new message"
        variant="outlined"
        fullWidth
      />
      <IconButton
        data-testid="chat-message-box-send-btn"
        color="primary"
        aria-label="Send"
        disabled={props.disabled || text.length === 0}
        onClick={() => {
          setText('');
          props.onChatMessage(text);
        }}
      >
        <SendIcon fontSize="large" />
      </IconButton>
    </Wrapper>
  );
}
