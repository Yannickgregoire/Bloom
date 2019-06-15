import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App.js';

ReactDOM.render(
    <App />,
    document.getElementsByClassName('app')[0]
);

module.hot.accept();
