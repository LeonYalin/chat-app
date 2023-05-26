import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './app/app';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './app/features/chat/chat.slice';
import { ConfirmDialogProvider } from './app/hooks/useConfirm';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
});

root.render(
  <StrictMode>
    <Provider store={store}>
      <ConfirmDialogProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfirmDialogProvider>
    </Provider>
  </StrictMode>,
);
