import React from "react";
import styles from "./UIFieldCard.module.css";

const UIFieldCard = ({ label, labelSize, content, indicatorColor, ...props }) => {
  return (
    <div className={styles.UIFieldCard}>
      <div className={styles.headerWrapper}>
        <label className={styles.label}
          style={{
            fontSize: labelSize || "1rem",
            fontWeight: "700",
            color: "white",
            margin: "0 1rem 0 0"
          }}>{label}</label>

        <span className={styles.indicator}
          style={{
            backgroundColor: `${indicatorColor || 'transparent'}`,
            boxShadow: `0px 0px 20px ${indicatorColor || 'transparent'}`,
          }}></span>
      </div>

      <p className={styles.content}>{content}</p>
    </div>
  );
}

export default UIFieldCard;