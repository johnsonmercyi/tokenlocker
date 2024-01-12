import React from "react";
import styles from "./NoTokens.module.css";
import UIButton from "../UI/UIButton/UIButton";

const NoTokens = ({ text, buttonText, onClickHandler }) => {
  return (
    <div className={styles.noTokens}>
      <span>{text}</span>
      <UIButton
        size="large"
        icon={"lock"}
        labelPosition={"left"}
        content={buttonText}
        onClickHandler={onClickHandler} />
    </div>
  );
}

export default NoTokens;