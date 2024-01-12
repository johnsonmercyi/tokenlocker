import React from "react";
import { Form, Input } from "semantic-ui-react";
import styles from "./style.module.css";

const UIField = ({ label, inputLabel, inputLabelPosition, placeholder, value, onChangeHandler, extraStyles=[], ...props }) => {

  return <Form.Field>
    <label className={styles.label}>{label}</label>
    <Input
      className={`${styles.input} ${extraStyles.length ? extraStyles.join("") : null}`}
      label={inputLabel}
      labelPosition={inputLabelPosition}
      value={value}
      placeholder={placeholder}
      onChange={onChangeHandler}
      {...props} />
  </Form.Field>
}

export default UIField;