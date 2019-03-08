import React from 'react';
import ReactDOM from 'react-dom';
import './style/style.css';
import './style/lumino.css';

import { HashRouter } from 'react-router-dom'
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { AppInsights } from 'applicationinsights-js'; 
AppInsights.downloadAndSetup({ instrumentationKey: "f2c5adfd-8bce-4dd7-89d2-07acedd6f7bf" });

ReactDOM.render((
<HashRouter>
    <App />
</HashRouter>), document.getElementById('root'));
registerServiceWorker();
