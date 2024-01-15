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

const ViewLockedToken = ({ ...props }) => {
  const { selectedLockedToken } = useGlobalState();
  const { walletProvider } = useWeb3ModalProvider();
  const [lockedToken, setLockedToken] = useState(null);
  const [lockdownDate, setLockdownDate] = useState(null);
  const [remainingDays, setRemainingDays] = useState("");
  const [elapsedDays, setElapsedDays] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [amount, setAmount] = useState(0);
  const [lockdownPeriod, setLockdownPeriod] = useState(0);
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

  return (
    <ValidateWalletConnection>
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
              disabled={remainingDays > 0}
              icon={"unlock"}
              labelPosition={"left"}
              content={"Release Token"} />
          </Column>
        </Row>
      </Grid>
    </ValidateWalletConnection> 
  );
}

export default ViewLockedToken;