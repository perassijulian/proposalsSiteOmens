import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
//import './index.css';
import App from './App';

// Import ThirdWeb
import { ThirdwebWeb3Provider } from '@3rdweb/hooks';

// Include what chains you wanna support.
// 4 = Rinkeby.
const supportedChainIds = [4];

// Include what type of wallet you want to support.
// In this case, we support Metamask which is an "injected wallet".
const connectors = {
  injected: {},
};

// Finally, wrap App with ThirdwebWeb3Provider.
ReactDOM.render(
    <BrowserRouter>
      <ThirdwebWeb3Provider
        connectors={connectors}
        supportedChainIds={supportedChainIds}
      >
        <App />
      </ThirdwebWeb3Provider>
    </BrowserRouter>,
  document.getElementById('root')
);