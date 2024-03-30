/// <reference path="../../index.d.ts" />
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const rootTag = document.getElementById('root');
if (!rootTag) throw new Error('No #root element found');
const root = createRoot(rootTag);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
