import React from "react";
import styles from './UIInFormationPage.module.css';
import UIButton from "../UI/UIButton/UIButton";

const UIInFormationPage = ({ header, content, buttonText, buttonIcon, labelPosition, onClickHandler, ...props }) => {
  return (
    <div className={styles.UIInFormationPage}>
      <h1 className={styles.header}>{header}</h1>
      <p className={styles.content}>{content}</p>
      <UIButton
        content={buttonText}
        icon={buttonIcon || ""}
        labelPosition={labelPosition}
        onClickHandler={onClickHandler} />
    </div>
  );
}

export default UIInFormationPage