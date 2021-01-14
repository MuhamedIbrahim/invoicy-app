import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import App from './App';
import Loader from './components/UI/Loader/Loader';
import {LoadingProvider} from './context/loading';
import {AuthProvider} from './context/auth';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Suspense fallback={<Loader />}>
        <LoadingProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LoadingProvider>
      </Suspense>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);