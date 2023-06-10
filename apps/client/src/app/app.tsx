import styled from 'styled-components';

import { Navigate, Route, Routes } from 'react-router-dom';
import { ChatMain } from './features/chat/ChatMain';
import { CssBaseline } from '@mui/material';
import { ChatDetailsMain } from './features/chat/ChatDetailsMain';
import { AuthGuard } from './shared/AuthGuard';
import { SignIn } from './features/auth/SignIn';
import { useAppDispatch, useAppSelector } from './hooks';
import { User } from '@shared/models/chat.model';
import { setUser } from './features/auth/auth.slice';
import { SignUp } from './features/auth/SignUp1';

const StyledApp = styled.div`
  // Your style here
`;

function getSavedUser() {
  const user: User = JSON.parse(localStorage.getItem('user') || '{}');
  return user;
}

export function App() {
  const dispatch = useAppDispatch();
  const user = getSavedUser();
  if (user) {
    dispatch(setUser({ user }));
  }

  return (
    <StyledApp>
      <CssBaseline />
      <Routes>
        <Route
          path="/chats"
          element={
            <AuthGuard>
              <ChatMain />
            </AuthGuard>
          }
        >
          <Route path=":chatId" element={<ChatDetailsMain />} />
          <Route path="all" element={<ChatDetailsMain />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Navigate to="/chats/all" />} />
      </Routes>
    </StyledApp>
  );
}

export default App;
