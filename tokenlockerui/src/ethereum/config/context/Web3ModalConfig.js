import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';

// Web3Modal developer project id
const projectId = 'a8b05f96035d83f51b664ade0542d49e';

const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com',
};

const sepolia = {
  chainId: 11155111,
  name: 'Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.etherscan.io/',
  rpcUrl: `${process.env.NEXT_PUBLIC_INFURA_URL}`,
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

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [sepolia],
  projectId,
});

export function Web3ModalProvider({ children }) {
  return children;
}
