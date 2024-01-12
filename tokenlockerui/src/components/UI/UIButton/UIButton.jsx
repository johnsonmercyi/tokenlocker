import React from 'react';
import { Button } from 'semantic-ui-react';
import styles from './style.module.css';
const UIButton = ({ type, content, icon, labelPosition, onClickHandler, rounded, rounded_left, rounded_right, ...props }) => {

  return <Button
    className={`
      ${styles.button} 
      ${rounded && styles.rounded} 
      ${rounded_left && styles.rounded_left} 
      ${rounded_right && styles.rounded_right} 
    `}
    type={type || "button"}
    content={content}
    icon={icon && icon}
    labelPosition={labelPosition && labelPosition}
    onClick={onClickHandler}
    {...props} />
}

export default UIButton;