import React from 'react';
import ReactDOM from 'react-dom';  // Zmieniono z 'react-dom/client'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Używamy ReactDOM.render dla React 17
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Pomiar wydajności aplikacji (opcjonalnie)
reportWebVitals();
