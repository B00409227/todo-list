//main.jsx
import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const DATA = [
  
];

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <App tasks={DATA} />
</StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered! Scope: ', registration.scope);
      })
      .catch((err) => {
        console.log('Service Worker registration failed: ', err);
      });
  });
}