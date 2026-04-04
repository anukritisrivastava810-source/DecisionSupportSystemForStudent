import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Replace with your actual Google Client ID from Google Cloud Console
// Also set REACT_APP_GOOGLE_CLIENT_ID in your .env for security
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.warn('[Warning] ❌ REACT_APP_GOOGLE_CLIENT_ID is not defined in .env. Google Sign-In will fail.');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();
