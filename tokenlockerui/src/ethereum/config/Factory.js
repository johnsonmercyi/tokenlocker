import factoryAbi from '@/ethereum/build/contracts/TokenLockerFactory.json';
import { BrowserProvider, Contract } from 'ethers';

const factoryAddress = process.env.NEXT_PUBLIC_FACTORY_ADDRESS;

console.log("ADDRESS: ", factoryAddress);

const factoryInstance = async (walletProvider) => {
  const ethersProvider = new BrowserProvider(walletProvider);
  const signer = await ethersProvider.getSigner();

  const instance = new Contract(factoryAddress, factoryAbi.abi, signer);

  

  return instance;
}

export default factoryInstance;