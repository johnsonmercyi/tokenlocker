import tokenAbi from '@/ethereum/build/contracts/ERC20.json';
import { BrowserProvider, Contract } from 'ethers';

const tokenInstance = async (tokenAddress, walletProvider) => {
  const ethersProvider = new BrowserProvider(walletProvider);
  const signer = await ethersProvider.getSigner();

  const instance = new Contract(tokenAddress, tokenAbi.abi, signer);

  return {instance, signer};
}

export default tokenInstance;