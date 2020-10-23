import { createBrowserHistory } from 'history';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, Router, Switch } from 'react-router';
import IndexPage from './pages/Index';
import Logo from './static/icons/webShopLogo.png';
import './index.scss';

const rootElement = document.getElementById('root');
const history = createBrowserHistory();
ReactDOM.render(
  <Router history={history}>
    <div>
      <img src={Logo} />
      <h1 className="title">Playground</h1>
    </div>
    <Switch>
      <Route path="/">
        <IndexPage />
      </Route>
    </Switch>
  </Router>,

  rootElement
);

if ('serviceWorker' in navigator && PRODUCTION) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
