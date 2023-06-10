import { BrowserRouter } from 'react-router-dom';
import App from './app';
import { renderWithProviders } from './utils/test-utils';

it('should render successfully', () => {
  const { baseElement } = renderWithProviders(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
  expect(baseElement).toBeTruthy();
});
