import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import { App } from './components';
import { Routes } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AuthProvider, PostsContext, PostsProvider } from './providers';
const cors = require("cors");
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <PostsProvider>
        <App />
      </PostsProvider>
      <Toaster />
    </AuthProvider>
  </React.StrictMode>
);
