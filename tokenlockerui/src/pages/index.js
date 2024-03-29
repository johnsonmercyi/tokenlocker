import AppLogo from "@/util/Logo";
import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/styles/app/home/index.module.css';
import UIForm from '@/components/Form/UIForm';
import UIField from '@/components/Form/UIInput/UIInput';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider
} from '@web3modal/ethers/react';
import UIButton from '@/components/UI/UIButton/UIButton';
import UIMessage from '@/components/UI/UIMessage/UIMessage';
import factoryInstance from '@/ethereum/config/Factory';
import tokenLockerInstance from '@/ethereum/config/TokenLocker';
import { useGlobalState } from '@/ethereum/config/context/GlobalStateContext';
import parse from 'html-react-parser';


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { open } = useWeb3Modal();
  const [managerAddress, setManagerAddress] = useState("");
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const router = useRouter();
  const {
    isHeaderVisible, setIsHeaderVisible,
    setTokenLockerAddress, setValidWalletForThisPage
  } = useGlobalState();

  const [loginLoading, setLoginLoading] = useState(false);
  const [messageType, setMessageType] = useState('');
  const [message, setMessage] = useState('');
  const [messageHeader, setMessageHeader] = useState('');
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    setIsHeaderVisible(false);
    if (walletProvider && isConnected) {
      setManagerAddress(address);
      setClientReady(true);
    } else {
      setClientReady(false);
    }

  }, [walletProvider, isConnected]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (isConnected) {
        setLoginLoading(true);

        // Fetch factory instance
        const factory = await factoryInstance(walletProvider);

        // Check if the connected address is a manager
        const isManager = await factory.hasCreatorATokenLocker(managerAddress);

        if (isManager) {
          // If manager, fetch the TokenLocker address
          const tokenLockerAddress = await factory.getDeployedTokenLocker(managerAddress);

          const tokenLocker = await tokenLockerInstance(
            tokenLockerAddress,
            walletProvider
          );

          // Fetch locked tokens details
          const lockedTokens = await tokenLocker.getLockedTokens();

          console.log(lockedTokens);
        } else {
          // If not a manager, create a new TokenLocker
          const createTokenLockerTx = await factory.createTokenLocker(managerAddress, '');
          const transactionHash = createTokenLockerTx.hash;

          // Fetch the TokenLocker address
          const tokenLockerAddress = await factory.getDeployedTokenLocker(managerAddress);
          
          setMessageHeader("Token Locker Space Created!");
          setMessage(`Awaiting confirmation...<br><span style="font-weight: 600">Transaction Hash:</span> ${transactionHash}`);
          setMessageType("success");
          // Wait for the transaction receipt
          const receipt = await createTokenLockerTx.wait();
        }

        router.push(`/${managerAddress}/tokens`);
      } else {
        throw Error("Your wallet hasn't been connected yet!");
      }
    } catch (error) {
      if (String(error.message).includes("code=ACTION_REJECTED")) {
        setMessage("Sorry! The signer has rejected the approval of this transaction.");
        setMessageType("error");
      } else if (String(error.message).includes("code=BAD_DATA") || String(error.message).includes("could not decode result data")) {
        setMessage("Sorry! Please check your wallet to ensure you have the <strong>Sepolia</strong> testnet selected.");
        setMessageType("error");
      } else {
        setMessage(error.message);
        setMessageType("error");
      }
      setLoginLoading(false)
    }
  }

  const onConnectWalletHandler = (event) => {
    try {
      open();
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    }
  }

  const onChangeHandler = (event) => {
    setManagerAddress(event.target.value);
  }

  // Render component children
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>

      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.logo}>
          <AppLogo
            title={"TheLockerSpace"}
            titleSize={"1.5rem"}
            titleWeight={"600"}
            color={"orange"}
            width={"4rem"}
            height={"5rem"} />
        </div>
        <div className={styles.formWrapper}>
          {/* <h1>The Locker Space</h1> */}
          <UIForm
            style={{ width: "100%" }}
            onSubmit={onSubmitHandler}
            error={!!message}>

            <UIField
              // disabled={!isConnected}
              label={"Manager Address"}
              placeholder={"E.g 0x00..."}
              value={managerAddress}
              onChangeHandler={onChangeHandler} />

            {
              clientReady ?
                (<UIButton
                  key={"login_submit_button"}
                  disabled={!managerAddress || managerAddress.length < 42 || managerAddress.length > 42}
                  loading={loginLoading}
                  icon={"arrow right"}
                  labelPosition={"left"}
                  content={"Sign in"}
                  type={"submit"} />) :

                (<UIButton
                  key={"login_connect_button"}
                  icon={"google wallet"}
                  labelPosition={"left"}
                  content={"Connect you wallet!"}
                  onClickHandler={onConnectWalletHandler} />)
            }

            <UIMessage
              header={messageHeader}
              type={messageType}
              content={parse(message)} />

          </UIForm>
        </div>
      </main>
    </>
  )
}
