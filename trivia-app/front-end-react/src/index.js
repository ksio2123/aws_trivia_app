import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'dotenv/config';

console.log(process.env.WEBSOCKET_ENDPOINT)
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
