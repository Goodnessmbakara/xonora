// Polyfills for Internet Computer libraries
import { Buffer } from 'buffer';
(window as any).global = window;
(window as any).Buffer = Buffer;

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
