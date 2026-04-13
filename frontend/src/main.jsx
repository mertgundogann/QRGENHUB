import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 👇 BU SATIR EKSİK OLABİLİR, MUTLAKA EKLE:
import './i18n'; 

// Yeni eklediğimiz HelmetProvider
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)