import styled from 'styled-components';

import { Route, Routes } from 'react-router-dom';
import { ChatMain } from './components/chat/ChatMain';
import { CssBaseline } from '@mui/material';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  return (
    <StyledApp>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<ChatMain />} />
        <Route path="*" element={<ChatMain />} />
      </Routes>
    </StyledApp>
  );
}

export default App;
