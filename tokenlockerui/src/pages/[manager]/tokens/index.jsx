import CardList from "@/components/CardList/CardList";
import { useGlobalState } from "@/ethereum/config/context/GlobalStateContext";
import React, { useEffect, useState } from "react";
import factoryInstance from "@/ethereum/config/Factory";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { useRouter } from "next/router";
import tokenLockerInstance from "@/ethereum/config/TokenLocker";
import { lock } from "ethers";
import NoTokens from "@/components/NoTokens/NoTokens";
import UILoaderPage from "@/components/UILoaderPage/UILoaderPage";


const textTokens = [
  {
    token: "0x5cBEF4Ea9526F199206123485121ACcE0AA93091",
    tokenName: "USDC",
    beneficiary: "0x5cBEF4Ea9526F199206123485121ACcE0AA93091",
    amount: 2000,
    lockdownDate: (Math.floor(Date.now() / 1000) - (5 * 24 * 60 * 60)),
    lockdownPeriod: (3 * 24 * 60 * 60),
    title: "Escrow",
    isReleased: false
  },
  {
    token: "0x5cBEF4Ea9526F199206123485121ACcE0AA93091",
    tokenName: "SFTC",
    beneficiary: "0x88b789Aab3d08360ea484fa6607a0B93f957A1e9",
    amount: 300,
    lockdownDate: (Math.floor(Date.now() / 1000) - (5 * 24 * 60 * 60)),
    lockdownPeriod: (10 * 24 * 60 * 60),
    title: "Bet Stake",
    isReleased: false
  },
  {
    token: "0x5cBEF4Ea9526F199206123485121ACcE0AA93091",
    tokenName: "USDC",
    beneficiary: "0x5cBEF4Ea9526F199206123485121ACcE0AA93091",
    amount: 2000,
    lockdownDate: (Math.floor(Date.now() / 1000) - (2 * 24 * 60 * 60)),
    lockdownPeriod: (3 * 24 * 60 * 60),
    title: "Escrow",
    isReleased: false
  },
  {
    token: "0x88b789Aab3d08360ea484fa6607a0B93f957A1e9",
    tokenName: "SFTC",
    beneficiary: "0x88b789Aab3d08360ea484fa6607a0B93f957A1e9",
    amount: 300,
    lockdownDate: (Math.floor(Date.now() / 1000) - (5 * 24 * 60 * 60)),
    lockdownPeriod: (10 * 24 * 60 * 60),
    title: "Bet Stake",
    isReleased: false
  }
];

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
  const { walletProvider } = useWeb3ModalProvider();
  const router = useRouter();
  const { manager } = props;

  const [lockedTokens, setLockedTokens] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);


  useEffect(() => {
    const init = async () => {

      setDataLoading(true);

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

      // console.log("LOCKED TOKENS: ", formattedTokens); 

      setLockedTokens(formattedTokens);
      setDataLoading(false);

    };

    init();
    
  }, [walletProvider]);

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

  const renderComponent = () => {
    if (dataLoading) {
      // Placeholders loading...
      setIsHeaderVisible(false);
      return (
        <UILoaderPage content={"Preparing your space..."}/>
      );
    } else {
      if (lockedTokens.length) {
        setIsHeaderVisible(true);
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
    <div style={{
      width: '100%',
      height: `${lockedTokens.length ? 'auto' : '50vh'}`,
      ...moreStyles()
    }}>
      {
        lockedTokens.length > 0 || !dataLoading ? <h1>Locked Tokens</h1> : null
      }

      {/* CardList container Cards */}
      {renderComponent()}
    </div>
  );
}

export default ShowTokenLockerSpace;