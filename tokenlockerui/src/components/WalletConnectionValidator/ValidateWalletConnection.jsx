import { useGlobalState } from "@/ethereum/config/context/GlobalStateContext";
import { useWeb3ModalProvider, useWeb3ModalAccount, useWeb3Modal } from "@web3modal/ethers/react";
import React, { useEffect, useState } from "react";
import UIModal from "../UIModal/UIModal";
import UILoaderPage from "../UILoaderPage/UILoaderPage";
import { Container } from "semantic-ui-react";

const ValidateWalletConnection = ({ children, ...props }) => {
  const { setIsHeaderVisible } = useGlobalState();
  const { isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const { open } = useWeb3Modal();

  const [loaderMessage, setLoaderMessage] = useState("");
  const [indeterminateLoader, setIndeterminateLoader] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogHeader, setDialogHeader] = useState("");
  const [dialogContent, setDialogContent] = useState("");
  const [dialogButtonText, setDialogButtonText] = useState("");
  const [dialogButtonIcon, setDialogButtonIcon] = useState("");
  const [dialogHeaderIcon, setDialogHeaderIcon] = useState("");
  const [dialogHeaderColor, setDialogHeaderColor] = useState("");
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    try {
      console.log("WALLECT CONNECTED: ", walletProvider, isConnected);
      
      if (!walletProvider && !isConnected) {

        setTimeout(()=> {
          if (!walletProvider) {
            console.log("Client not yet ready!");
            setIsHeaderVisible(false);
            setIndeterminateLoader(true);
            setLoaderMessage("Waiting for wallet reconnection...");
      
            setOpenDialog(true);
            setDialogHeader("Wallet Disconnected!");
            setDialogContent("Your wallet is disconnected. Please click the button below to try reconnecting your wallet.");
            setDialogButtonText("Connect Wallet");
            setDialogButtonIcon("google wallet");
            setDialogHeaderIcon("unlink");
            setDialogHeaderColor("red");
      
            setClientReady(false);
          }
        }, 3000);
      } else {
        console.log("Client is ready");
        setIsHeaderVisible(true);
        setClientReady(true);
      }
    } catch (error) {
      alert(error.message);
    }
  }, [walletProvider, isConnected]);

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
    if (clientReady) {
      console.log("Client ready!");
      return (children);
    } else {
      console.log("Server ready!");
      return <UILoaderPage
        indeterminate={indeterminateLoader}
        content={loaderMessage} />;
    }
  }

  return (
    <div style={{
      width: '100%',
      height: `${clientReady ? 'auto' : "30vh"}`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {/* <div>
        {renderComponent()}
      </div> */}

      {renderComponent()}

      <UIModal
        open={openDialog}
        header={dialogHeader}
        content={dialogContent}
        buttonText={dialogButtonText}
        buttonIcon={dialogButtonIcon}
        headerIcon={dialogHeaderIcon}
        headerColor={dialogHeaderColor}
        openDialogHandler={openDialogHandler}
        buttonClickHandler={onConnectWalletHandler}
      />
    </div>
  );
}

export default ValidateWalletConnection;