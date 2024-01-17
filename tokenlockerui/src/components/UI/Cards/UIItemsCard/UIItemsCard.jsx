import React, { useEffect, useState } from "react";
import styles from './UIItemsCard.module.css';

const UIItemsCard = ({ label, hAlign, items = [{
  content,
  color,
  size,
  weight,
  textDecoration,
}] }) => {

  return (
    <div className={styles.UIItemsCard}
    style={{
      alignItems: `${hAlign === "left" ? "flex-start" : hAlign === "right" ? "flex-end" : "center"}`
    }}>
      {
        label && (<label style={{
          marginBottom: "0.3rem"
        }}>{label}</label>)
      }

      <div className={styles.itemsWrapper}>
        {
          items.length && items.map((item, i) => (
            <span
              key={`item_${i}`}
              style={{
                wordBreak: "break-all",
                color: item.color,
                fontSize: item.size,
                fontWeight: item.weight,
                marginRight: "0.5rem",
                textDecoration: item.textDecoration
              }}>{item.content}</span>
          ))
        }
      </div>

    </div>
  );
}

export default UIItemsCard;