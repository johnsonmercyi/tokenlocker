import { useGlobalState } from "@/ethereum/config/context/GlobalStateContext";
import React, { useEffect, useState } from "react";
import {
  isExistsInLocalStorage,
  addToLocalStorage,
  getFromLocalStorage,
  isSameObject,
  updateLocalStorage,
  getRemainingAndElapseDays,
  intlDateFormat,
  usNumberFormat
} from '@/util/utils';
import { Divider, Grid } from "semantic-ui-react";
import UIFieldCard from "@/components/UI/Cards/UIFieldCard/UIFieldCard";
import UIItemsCard from "@/components/UI/Cards/UIItemsCard/UIItemsCard";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import tokenInstance from "@/ethereum/config/ERC20";
import styles from '@/styles/app/token/index.module.css';
import UIButton from "@/components/UI/UIButton/UIButton";
import ValidateWalletConnection from "@/components/WalletConnectionValidator/ValidateWalletConnection";
import { useRouter } from "next/router";
import tokenLockerInstance from "@/ethereum/config/TokenLocker";
import UIMessage from "@/components/UI/UIMessage/UIMessage";
import UIInFormationPage from "@/components/UIInFormationPage/UIInFormationPage";
import factoryInstance from "@/ethereum/config/Factory";
import parse from 'html-react-parser';

const ViewLockedToken = ({ ...props }) => {
  const { selectedLockedToken, setIsHeaderVisible } = useGlobalState();
  const { walletProvider } = useWeb3ModalProvider();
  const router = useRouter();
  const { manager } = router.query;

  const [lockedToken, setLockedToken] = useState(null);
  const [lockdownDate, setLockdownDate] = useState(null);
  const [remainingDays, setRemainingDays] = useState("");
  const [elapsedDays, setElapsedDays] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [amount, setAmount] = useState(0);
  const [lockdownPeriod, setLockdownPeriod] = useState(0);
  const [navigate, setNavigate] = useState(true);
  const [messageType, setMessageType] = useState("");
  const [message, setMessage] = useState("");
  const [messageHeader, setMessageHeader] = useState("");
  const [loadButton, setLoadButton] = useState(false);
  const { Row, Column } = Grid;


  useEffect(() => {
    if (!isExistsInLocalStorage("selectedLockedToken")) {
      addToLocalStorage("selectedLockedToken", selectedLockedToken)
    } else {
      const isSame = isSameObject(
        getFromLocalStorage("selectedLockedToken"), selectedLockedToken
      );

      if (!isSame) {
        updateLocalStorage("selectedLockedToken", selectedLockedToken);
      }
    }

    // console.log("Token: ", getFromLocalStorage("selectedLockedToken"));
    const token = getFromLocalStorage("selectedLockedToken");
    const days = getRemainingAndElapseDays(
      token.lockdownDate,
      token.lockdownPeriod
    );

    const getTokenSymbol = async () => {
      const tokenObj = await tokenInstance(token.token, walletProvider);
      const symbol = await tokenObj.instance.symbol();
      setTokenSymbol(symbol);
    }

    getTokenSymbol();


    setLockedToken(token);
    setLockdownDate(intlDateFormat(token.lockdownDate));
    setAmount(usNumberFormat(token.amount));
    setRemainingDays(days.remainingDays);
    setElapsedDays(days.elapsedDays);
    setLockdownPeriod(token.lockdownPeriod / (24 * 60 * 60));
  }, []);

  const releaseFundHandler = async (event) => {
    try {

      setLoadButton(true);
      setMessage("");
      // console.log("LOCKED TOKEN: ", lockedToken);
      const factory = await factoryInstance(walletProvider);
      const tokenLockerAddress = await factory.getDeployedTokenLocker(manager);
      const tokenLocker = await tokenLockerInstance(tokenLockerAddress, walletProvider);

      const lockedT = await tokenLocker.lockedTokens(lockedToken.index);

      // console.log("TOKEN LOCKER ADDRESS: ", tokenLockerAddress);
      // console.log("TOKEN LOCKER: ", tokenLocker);
      // console.log("TOKEN INDEX: ", lockedToken.index);
      // console.log("LOCKED TOKEN: ", lockedT);

      const releaseTokenTransX = await tokenLocker.release(lockedToken.index);

      const releaseTransactionHash = releaseTokenTransX.hash;

      setMessageHeader("Token Release!");
      setMessage(`Awaiting confirmation...<br><span style="font-weight: 600">Transaction Hash:</span> ${releaseTransactionHash}`);
      setMessageType("success");

      // Wait for the transaction to be mined
      const releaseTokenReceipt = await releaseTokenTransX.wait();
      console.log("RELEASE TRNX: ", releaseTokenReceipt);

      if (releaseTokenReceipt.status === 1) {
        // Successfully released
        // navigate to locked tokens page here...
        setNavigate(true);
        setIsHeaderVisible(false);
      } else {
        // Error releasing token
        setMessage("Token release transaction has failed!");
        setMessageType("error");
        setLoadButton(false);
      }
    } catch (error) {
      // Handle error here...
      setLoadButton(false);
      setMessage(error.message);
      setMessageType("error");
    }
  }

  const naviageToSpaceHandler = () => {
    router.push(`/${manager}/tokens`);
  }

  return (
    <ValidateWalletConnection>
      {
        navigate ? (
          <UIInFormationPage
            header={"Transaction Successful!"}
            buttonText={"Return to Space"}
            buttonIcon={"arrow right"}
            labelPosition={"right"}
            content={parse(`You have successfully released <span style="font-weight: 600">${amount}</span> <span style="color: orange; font-weight: 600;">${tokenSymbol}</span> to the beneficiary <span style="color: orange; text-decoration: underline">${lockedToken && lockedToken.beneficiary}</span>.`)}
            onClickHandler={naviageToSpaceHandler} />
        ) : (
          <Grid>
            <Row>
              <Column mobile={16} tablet={8} computer={8}>
                <UIFieldCard
                  label={lockedToken && lockedToken.title}
                  labelSize={"1.8rem"}
                  content={lockedToken && lockedToken.token}
                  indicatorColor={
                    lockedToken && `${remainingDays === 0 ? 'green' :
                      elapsedDays < remainingDays ? 'red' :
                        elapsedDays >= remainingDays ? 'orange' :
                          "transparent"}`} />
              </Column>
              <Column mobile={16} tablet={8} computer={8}>
                <UIItemsCard
                  hAlign={"right"}
                  items={[
                    {
                      content: amount,
                      color: "#FFAE21",
                      size: "2rem",
                      weight: "700"
                    },

                    {
                      content: tokenSymbol,
                      color: "#FFF",
                      size: "2rem",
                      weight: "700"
                    },
                  ]} />
              </Column>
            </Row>

            <Row className={styles.customRow}>
              <Column mobile={16} tablet={16} computer={16}>
                <Divider className={styles.customDivider} />
              </Column>
            </Row>

            <Row>
              <Column mobile={16} tablet={8} computer={8}>
                <UIItemsCard
                  label={"Beneficiary"}
                  hAlign={"left"}
                  items={[
                    {
                      content: lockedToken && lockedToken.beneficiary,
                      color: "#FFAE21",
                      size: "1.2rem",
                      weight: "400",
                      textDecoration: "underline",
                    }
                  ]} />
              </Column>

              <Column mobile={16} tablet={8} computer={8}>
                <UIItemsCard
                  label={"Lockdown Date"}
                  hAlign={"right"}
                  items={[
                    {
                      content: lockedToken && lockdownDate.day,
                      color: "#FFF",
                      size: "1.4rem",
                      weight: "700",
                    },
                    {
                      content: lockedToken && lockdownDate.month,
                      color: "#FFF",
                      size: "1.4rem",
                      weight: "700",
                    },
                    {
                      content: lockedToken && lockdownDate.year,
                      color: "#FFAE21",
                      size: "1.4rem",
                      weight: "700",
                    },
                  ]} />
              </Column>
            </Row>

            <Row className={styles.customRow}>
              <Column mobile={16} tablet={16} computer={16}>
                <Divider className={styles.customDivider} />
              </Column>
            </Row>

            <Row>
              <Column mobile={16} tablet={8} computer={8}>
                <UIItemsCard
                  label={"Lockdown Period"}
                  hAlign={"left"}
                  items={[
                    {
                      content: lockdownPeriod,
                      color: "#FFAE21",
                      size: "1.4rem",
                      weight: "700",
                    },
                    {
                      content: "Days",
                      color: "#FFF",
                      size: "1.4rem",
                      weight: "700",
                    }
                  ]} />
              </Column>

              <Column mobile={16} tablet={8} computer={8}>
                <UIItemsCard
                  label={"Remaining Days"}
                  hAlign={"right"}
                  items={[
                    {
                      content: remainingDays,
                      color: "#FFAE21",
                      size: "1.4rem",
                      weight: "700",
                    },
                    {
                      content: "Days",
                      color: "#FFF",
                      size: "1.4rem",
                      weight: "700",
                    }
                  ]} />
              </Column>
            </Row>

            <Row className={styles.customRow}>
              <Column mobile={16} tablet={16} computer={16}>
                <Divider className={styles.customDivider} />
              </Column>
            </Row>

            <Row>
              <Column mobile={16} tablet={8} computer={8}>
                <UIButton
                  disabled={remainingDays > 0 || loadButton}
                  loading={loadButton}
                  icon={"unlock"}
                  labelPosition={"left"}
                  content={"Release Token"}
                  onClickHandler={releaseFundHandler} />
              </Column>
            </Row>
            {
              message && (<Row>
                <Column mobile={16} tablet={16} computer={16}>
                  <UIMessage
                    header={messageHeader}
                    type={messageType}
                    content={parse(message)} />
                </Column>
              </Row>)
            }
          </Grid>
        )
      }
    </ValidateWalletConnection>
  );
}

export default ViewLockedToken;