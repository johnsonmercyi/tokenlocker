import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';

const projectId = 'a8b05f96035d83f51b664ade0542d49e';

const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com',
};

const testnet = {
  chainId: 1337, // Ganache chain ID
  name: 'Ganache',
  currency: 'ETH',
  explorerUrl: '',
  rpcUrl: 'http://localhost:8545',
};

const metadata = {
  name: 'The Locker Space',
  description: 'The lockers space is Token Locking platform',
  url: 'http://localhost:3000',
  icons: [''],
};

// export const web3Modal = createWeb3Modal({
//   ethersConfig: defaultConfig({ metadata }),
//   chains: [testnet],
//   projectId,
// });

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [testnet],
  projectId,
});

export function Web3ModalProvider({ children }) {
  return children;
}
