import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);