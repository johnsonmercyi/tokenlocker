import React from "react";
import { Message } from "semantic-ui-react";
import styles from './UIMessage.module.css';

const UIMessage = ({ header, content, type = "success", ...props }) => {
  if (type === "success") {
    console.log("TYPE: " + type);
    return <Message
      className={styles.message}
      info
      header={header || "Oops!"}
      content={content || ""}
      {...props} />
  } else {
    return <Message
      className={styles.message}
      error
      header={header || "Oops!"}
      content={content || ""}
      {...props} />
  }

}

export default UIMessage;