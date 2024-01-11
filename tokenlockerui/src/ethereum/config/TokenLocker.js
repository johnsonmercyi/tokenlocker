import tokenLockerAbi from '@/ethereum/build/contracts/TokenLocker.json';
import { BrowserProvider, Contract } from 'ethers';

const tokenLockerInstance = async (address, walletProvider) => {
  const ethersProvider = new BrowserProvider(walletProvider);
  const signer = await ethersProvider.getSigner();

  const instance = new Contract(address, tokenLockerAbi.abi, signer);

  return instance;
}

export default tokenLockerInstance;