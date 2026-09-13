import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/source-serif-4/latin-400.css';
import '@fontsource/source-serif-4/latin-500.css';
import '@fontsource/source-serif-4/latin-400-italic.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import 'katex/dist/katex.min.css';
import './styles.css';
import './lesson-layouts.css';
import App from './App';
import { ExperimentProvider } from './state/ExperimentContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExperimentProvider>
      <App />
    </ExperimentProvider>
  </StrictMode>,
);
