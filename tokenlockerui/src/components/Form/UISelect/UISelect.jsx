import React from "react";
import { FormField, Select } from "semantic-ui-react";
import styles from "./style.module.css";

const UISelect = ({ options, label, placeholder }) => {
  return (
    <FormField
      className={styles.select}
      control={Select}
      label={label}
      options={options}
      placeholder={placeholder}
    />
  );
}

export default UISelect;