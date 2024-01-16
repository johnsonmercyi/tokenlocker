import CardList from "@/components/CardList/CardList";
import { useGlobalState } from "@/ethereum/config/context/GlobalStateContext";
import React, { useEffect, useState } from "react";
import factoryInstance from "@/ethereum/config/Factory";
import { useWeb3Modal, useWeb3ModalProvider, useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useRouter } from "next/router";
import tokenLockerInstance from "@/ethereum/config/TokenLocker";
import { lock } from "ethers";
import NoTokens from "@/components/NoTokens/NoTokens";
import UILoaderPage from "@/components/UILoaderPage/UILoaderPage";
import UIModal from "@/components/UIModal/UIModal";
import ValidateWalletConnection from "@/components/WalletConnectionValidator/ValidateWalletConnection";

export async function getServerSideProps(props) {
  const { manager } = props.query;
  return {
    props: {
      manager
    },
  };
}

const ShowTokenLockerSpace = (props) => {

  const { isHeaderVisible, setIsHeaderVisible } = useGlobalState();
  const { isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const { open } = useWeb3Modal();
  const router = useRouter();
  const { manager } = props;

  const [lockedTokens, setLockedTokens] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [loaderMessage, setLoaderMessage] = useState("");
  const [indeterminateLoader, setIndeterminateLoader] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogHeader, setDialogHeader] = useState("");
  const [dialogContent, setDialogContent] = useState("");
  const [dialogButtonText, setDialogButtonText] = useState("");
  const [dialogButtonIcon, setDialogButtonIcon] = useState("");
  const [dialogHeaderIcon, setDialogHeaderIcon] = useState("");
  const [dialogHeaderColor, setDialogHeaderColor] = useState("");


  useEffect(() => {
    const init = async () => {

      setDataLoading(true);
      setIsHeaderVisible(false);

      if (walletProvider && isConnected) {

        const factory = await factoryInstance(walletProvider);
        const tokenLockerAddress = await factory.getDeployedTokenLocker(manager);

        const tokenLocker = await tokenLockerInstance(tokenLockerAddress, walletProvider);
        const tokensLocked = await tokenLocker.getLockedTokens();

        // Map the solidity struct to an array of objects
        const formattedTokens = tokensLocked.map(token => ({
          token: token[0],
          beneficiary: token[1],
          amount: (token[2] / (10n ** 18n)).toString(), // Convert BigNumber to string
          lockdownDate: new Date(Number(token[3]) * 1000),
          lockdownPeriod: Number(token[4]),
          title: token[5],
          isReleased: token[6],
        }));

        console.log("LOCKED TOKENS: ", formattedTokens); 

        setLockedTokens(formattedTokens);
        setDataLoading(false);

      }
    };

    init();

  }, [walletProvider]);

  useEffect(() => {
    // Show header when data is loaded
    if (!dataLoading && lockedTokens.length || !dataLoading && !lockedTokens.length) {
      setIsHeaderVisible(true);
    } else {
      setLoaderMessage("Preparing your space...");
    }
  }, [dataLoading, lockedTokens]);

  const onClickHadler = () => {
    router.push(`/${manager}/tokens/new`);
  }


  const moreStyles = () => {
    if (!lockedTokens.length) {
      return {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }
    }
    return {};
  };

  const onConnectWalletHandler = (event) => {
    try {
      open();
      setOpenDialog(false);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  const openDialogHandler = (shouldOpen) => {
    setOpenDialog(shouldOpen);
  }

  const renderComponent = () => {
    if (dataLoading && lockedTokens.length === 0) {

      return (
        <UILoaderPage
          indeterminate={indeterminateLoader}
          content={loaderMessage} />
      );
    } else {
      if (lockedTokens.length && !dataLoading) {
        return (
          <CardList data={lockedTokens} />
        );
      } else {
        return (
          <NoTokens
            text={"You have not locked any tokens yet."}
            buttonText={"Lock a token here!"}
            onClickHandler={onClickHadler} />
        );
      }
    }
  }

  return (
    <ValidateWalletConnection>
      <div style={{
        width: '100%',
        height: `${lockedTokens.length ? 'auto' : '30vh'}`,
        ...moreStyles()
      }}>
        {
          (lockedTokens.length > 0 
          && !dataLoading 
          && walletProvider) ? (<h1>Locked Tokens</h1>) : null
        }

        {/* CardList container Cards */}
        {renderComponent()}

        <UIModal
          header={dialogHeader}
          content={dialogContent}
          buttonText={dialogButtonText}
          buttonIcon={dialogButtonIcon}
          headerIcon={dialogHeaderIcon}
          headerColor={dialogHeaderColor}
          open={openDialog}
          openDialogHandler={openDialogHandler}
          buttonClickHandler={onConnectWalletHandler}
        />
      </div>
    </ValidateWalletConnection>
  );
}

export default ShowTokenLockerSpace;