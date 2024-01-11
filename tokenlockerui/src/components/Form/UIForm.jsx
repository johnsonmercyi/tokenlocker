import React from "react";
import { Form } from "semantic-ui-react";

const UIForm = ({ onSubmit, children, ...props}) => {
  return <Form onSubmit={onSubmit} {...props}>
    { children }
  </Form>
};

export default UIForm;