import { ChakraProvider } from '@chakra-ui/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { appSystem } from './chakra-system';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={appSystem}>
      <App />
    </ChakraProvider>
  </StrictMode>,
);
