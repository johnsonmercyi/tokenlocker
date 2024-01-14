import React from "react";
import { Message } from "semantic-ui-react";

const UIMessage = ({ header, content, ...props }) => {
  return <Message
    header={header || "Oops!"}
    content={content || ""}
    {...props} />
}

export default UIMessage;