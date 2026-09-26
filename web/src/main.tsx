import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

async function prepareApp(): Promise<void> {
  // P22: Only import and enable MSW mock layer when explicitly in mock mode
  if (import.meta.env.VITE_API_MOCKS === '1' || import.meta.env.MODE === 'mock') {
    const { enableMocking } = await import('./mocks/browser');
    await enableMocking();
  }
}

prepareApp().then(() => {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Root element #root not found in document');

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
