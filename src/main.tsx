import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'jotai';
import './i18n';  // Import i18n configuration before App
import App from './App';
import './index.css';

// Wait for i18next to be initialized before rendering
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>
);