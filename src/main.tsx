import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { installSupabaseApiBridge } from './lib/api.ts';

installSupabaseApiBridge();
createRoot(document.getElementById('root')!).render(<App />);
