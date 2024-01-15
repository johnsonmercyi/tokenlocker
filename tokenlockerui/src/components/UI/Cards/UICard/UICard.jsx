import React, { useEffect, useState } from "react";
import styles from './UICard.module.css';
import Link from "next/link";
import tokenInstance from "@/ethereum/config/ERC20";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { getRemainingAndElapseDays } from "@/util/utils";


const UICard = ({ title, amount, token, beneficiary, lockdownDate, lockdownPeriod, isReleased, ...props }) => {
  const { walletProvider } = useWeb3ModalProvider();
  const [tokenSymbol, setTokenSymbol] = useState("");

  useEffect(()=> {
    const getTokenSymbol = async () => {
      const tokenObj = await tokenInstance(token, walletProvider);
      const symbol = await tokenObj.instance.symbol();
      setTokenSymbol(symbol);
    }

    getTokenSymbol();
  }, [tokenSymbol]);

  const days = getRemainingAndElapseDays(lockdownDate, lockdownPeriod);

  // Calculate remaining and elapsed days
  const remainingDays = days.remainingDays;
  const elapsedDays = days.elapsedDays;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <span className={styles.indicator}
          style={{
            backgroundColor: `${
              remainingDays === 0 ? 'green' : 
              elapsedDays < remainingDays  ? 'red' : 
              elapsedDays >= remainingDays ? 'orange' : ""}`,
            boxShadow: `${
              remainingDays === 0 ? '0px 0px 20px green' : 
              elapsedDays < remainingDays ? '0px 0px 20px red' : 
              elapsedDays >= remainingDays ? '0px 0px 20px orange' : 
              "0px 0px 20px transparent"}`,
          }}></span>
      </div>
      <div className={styles.amount}>{`${amount} ${tokenSymbol}`}</div>
      <div className={styles.body}>{beneficiary}</div>
      <Link href={`/`} style={{ color: "#FFAE21" }}>
        <span>View Details</span>
      </Link>
    </div>
  );
}

export default UICard;