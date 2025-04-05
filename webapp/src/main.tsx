import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GlobalStateProvider } from "./GlobalStateContext";

import './index.css';
import App from './App';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
        <GlobalStateProvider>
            <App />
        </GlobalStateProvider>
    </QueryClientProvider>
  </StrictMode>,
);
