import React from "react";
import { Message } from "semantic-ui-react";

const UIMessage = ({ header, content, ...props }) => {
  return <Message
    header={header || "Oops! Something went wrong."}
    content={content || ""}
    {...props} />
}

export default UIMessage;