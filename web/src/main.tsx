import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

async function prepareApp(): Promise<void> {
  // P22: Only import and enable MSW mock layer when explicitly in mock mode
  if (import.meta.env.VITE_API_MOCKS === '1' || import.meta.env.MODE === 'mock') {
    try {
      const { enableMocking } = await import('./mocks/browser');
      await enableMocking();
    } catch (err) {
      // Render anyway: a failed mock start should show API errors in the UI, not a blank page.
      console.error('Mock mode failed to start; API requests are not mocked.', err);
    }
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
