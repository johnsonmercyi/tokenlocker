import React from "react";
import { Select } from "semantic-ui-react";
import styles from "./style.module.css";

const UISelect = ({ options, label, value, onChangeHandler, placeholder }) => {

  return (
    <div className={styles.UISelect}>
      <label>{label}</label>
      <Select
        value={value}
        className={styles.select}
        placeholder={placeholder}
        options={options}
        onChange={onChangeHandler} />
    </div>
  );
}

export default UISelect;