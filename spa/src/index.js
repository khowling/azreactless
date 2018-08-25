import React from 'react';
import ReactDOM from 'react-dom';
import './style/style.css';
import './style/lumino.css';

import { HashRouter } from 'react-router-dom'
import App from './App';
import registerServiceWorker from './registerServiceWorker';


ReactDOM.render((
<HashRouter>
    <App />
</HashRouter>), document.getElementById('root'));
registerServiceWorker();
