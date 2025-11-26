// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import AppRouter from './AppRouter';
import { BlurProvider } from './contexts/BlurContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <BlurProvider>
        <AppRouter />
      </BlurProvider>
    </BrowserRouter>
  </StrictMode>,
);