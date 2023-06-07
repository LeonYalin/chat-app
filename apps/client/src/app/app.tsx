import styled from 'styled-components';

import { Navigate, Route, Routes } from 'react-router-dom';
import { ChatMain } from './features/chat/ChatMain';
import { CssBaseline } from '@mui/material';
import { ChatDetailsMain } from './features/chat/ChatDetailsMain';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  return (
    <StyledApp>
      <CssBaseline />
      <Routes>
        <Route path="/chats" element={<ChatMain />}>
          <Route path=":chatId" element={<ChatDetailsMain />} />
          <Route path="all" element={<ChatDetailsMain />} />
        </Route>
        <Route path="/" element={<Navigate to="/chats/all" />} />
      </Routes>
    </StyledApp>
  );
}

export default App;
