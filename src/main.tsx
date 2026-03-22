import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { AdminProvider } from './components/providers/AdminProvider';
import { AIImageModal } from './components/ai/AIImageModal';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AdminProvider>
        <App />
        <AIImageModal />
      </AdminProvider>
    </BrowserRouter>
  </StrictMode>,
);
