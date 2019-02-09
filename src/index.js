import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter, Route } from 'react-router-dom';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import reducers from './reducers';
import ReduxPromise from 'redux-promise';

const store = createStore(
    reducers,
    applyMiddleware(logger, ReduxPromise)
);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <div>
                <div class="relative"><img src="/StromaLogoTransparent.png" height="96px" width="175px"></img> </div>
                <Route path='/' component={App} />
            </div>
        </BrowserRouter>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();