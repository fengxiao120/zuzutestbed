import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import './i18n';

import WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: ['Helvetica:200,300,400,700', 'sans-serif']
  }
});

ReactDOM.render(<App />, document.getElementById('react-promotions'));
