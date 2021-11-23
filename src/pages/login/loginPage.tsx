// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { useIsMetaMask } from '../../hooks/web3Hook';
import LoginView from './loginView';
import MetaMaskView from './metamaskView';
import RegisterPage from './register/registerPage';
import { Container } from './styles';

const LoginPage = () => {
  const [isConnectService, setIsConenct] = useState(false);
  const isMetaMask = useIsMetaMask();
  // TODO: is MetaMask connectted - just to page
  /**
   * status for the login page
   *
   * 1. `unconnect with service endpoint`
   * 2. `connect with service endpoint`
   *  2.1 metamask uninstall
   *  2.2 metamask installed, need to connect to specific network
   * 3. connect with correct network
   *  3.1 Register view -> register flow
   *
   */

  // TODO: 1. if metamask connect with correct network, and the conenct account is an indexer -> display account management page

  return (
    <Container>
      {!isConnectService && <LoginView onConnected={() => setIsConenct(true)} />}
      {isConnectService && !isMetaMask && <MetaMaskView />}
      {isConnectService && isMetaMask && <RegisterPage />}
    </Container>
  );
};

export default LoginPage;
