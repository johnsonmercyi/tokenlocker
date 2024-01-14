import React from "react";
import { Form, Input } from "semantic-ui-react";
import styles from "./style.module.css";

const UIField = ({ label, inputLabel, inputLabelPosition, placeholder, value, onChangeHandler, rounded, rounded_left, rounded_right, ...props }) => {

  return <Form.Field>
    <label className={styles.label}>{label}</label>
    <Input
      className={`
        ${styles.input} 
        ${rounded && styles.rounded} 
        ${rounded_left && styles.rounded_left} 
        ${rounded_right && styles.rounded_right} 
      `}
      label={inputLabel}
      labelPosition={inputLabelPosition}
      value={value}
      placeholder={placeholder}
      onChange={onChangeHandler}
      {...props} />
  </Form.Field>
}

export default UIField;