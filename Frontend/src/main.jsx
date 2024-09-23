import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; 
import { store } from './redux/store'; 
import App from './App.jsx';
import './index.css';
import Footer from './components/Footer';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}> 
      <App />
      <Footer />
    </Provider>
  </React.StrictMode>
);
