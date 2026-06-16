import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import App from './App.js';
import { initAuth } from './auth/init-auth.js';
import './index.css';

initAuth();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <ToastContainer />
  </>,
);
