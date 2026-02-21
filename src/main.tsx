import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppContent } from './App';
import './styles/global.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </React.StrictMode>
);

// Use hydrateRoot when content was pre-rendered by SSG
if (rootElement.innerHTML.trim()) {
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  ReactDOM.createRoot(rootElement).render(app);
}
