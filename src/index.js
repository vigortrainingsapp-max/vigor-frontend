import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n';
// 1. Google Import
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));

// 2. Deine Google Client-ID
const GOOGLE_CLIENT_ID = "207809738638-h53i5h6n1v9absrfu3gfnkddvo0cco7b.apps.googleusercontent.com";

root.render(
  <React.StrictMode>
    {/* 3. Die App in den Provider einpacken */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();