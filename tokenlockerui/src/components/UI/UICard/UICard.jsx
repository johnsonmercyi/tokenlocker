import React from "react";
import styles from './UICard.module.css';
import Link from "next/link";

const UICard = ({ title, amount, token, tokenName, beneficiary, lockdownDate, lockdownPeriod, isReleased, ...props }) => {

  // Convert Solidity timestamp to JavaScript Date object
  const ldDate = new Date(lockdownDate * 1000);

  // Calculate remaining and elapsed days based on lockdownPeriod
  const currentDate = new Date();
  const lockedUntilDate = new Date(ldDate.getTime() + lockdownPeriod * 1000);

  // Calculate remaining and elapsed days
  const remainingDays = Math.max(0, Math.ceil((lockedUntilDate - currentDate) / (24 * 60 * 60 * 1000)));
  const elapsedDays = Math.max(0, Math.floor((currentDate - ldDate) / (24 * 60 * 60 * 1000)));

  // console.log("LOCKED DOWN: ", ldDate);
  // console.log("LOCKED PERIOD: ", lockedUntilDate);
  // console.log("REMAINING DAYS: ", remainingDays);
  // console.log("ELAPSE DAYS: ", elapsedDays);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <span className={styles.indicator}
          style={{
            backgroundColor: `${remainingDays === 0 ? 'green' : remainingDays > elapsedDays ? 'red' : 'orange'}`,
            boxShadow: `${remainingDays === 0 ? '0px 0px 20px green' : remainingDays > elapsedDays ? '0px 0px 20px red' : '0px 0px 20px orange'}`,
          }}></span>
      </div>
      <div className={styles.amount}>{`${amount} ${tokenName}`}</div>
      <div className={styles.body}>{beneficiary}</div>
      <Link href={`/`} style={{ color: "#FFAE21" }}>
        <span>View Details</span>
      </Link>
    </div>
  );
}

export default UICard;