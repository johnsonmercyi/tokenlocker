import React from 'react';
import { Button } from 'semantic-ui-react';
import styles from './style.module.css';
const UIButton = ({ type, content, icon, labelPosition, onClickHandler, ...props }) => {

  return <Button
    className={styles.button}
    type={type || "button"}
    content={content}
    icon={icon && icon}
    labelPosition={labelPosition && labelPosition}
    onClick={onClickHandler}
    {...props} />
}

export default UIButton;