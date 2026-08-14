import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './styles/animations.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Keyro Extension Uncaught Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '24px 16px',
          color: '#EF4444',
          backgroundColor: '#101014',
          fontFamily: 'sans-serif',
          fontSize: '13px',
          lineHeight: '1.5',
          minHeight: '500px',
          width: '360px',
          boxSizing: 'border-box'
        }}>
          <h3 style={{ color: '#F0F0F2', margin: '0 0 12px 0' }}>Keyro Initialization Error</h3>
          <p style={{ margin: '0 0 12px 0', color: '#8B8B96' }}>An error occurred while launching the extension popup:</p>
          <pre style={{
            backgroundColor: '#18191F',
            padding: '12px',
            borderRadius: '8px',
            overflowX: 'auto',
            fontSize: '11px',
            color: '#EF4444',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
          }}>
            {this.state.error?.message || 'Unknown error'}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

function initApp() {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    try {
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        <React.StrictMode>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </React.StrictMode>
      );
    } catch (err: any) {
      console.error('Failed to create/render React root:', err);
    }
  } else {
    console.error('Keyro: Root element #root not found in popup DOM.');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
