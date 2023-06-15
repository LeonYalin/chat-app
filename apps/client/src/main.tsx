import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './app/app';
import { Provider } from 'react-redux';
import { AppDialogsProvider } from './app/hooks/useDialog';
import store from './app/store';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <AppDialogsProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppDialogsProvider>
    </Provider>
  </StrictMode>,
);
