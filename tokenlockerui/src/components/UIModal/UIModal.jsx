import React, { useEffect } from "react";
import styles from './UIModal.module.css';
import { Button, Header, Modal, ModalActions, ModalContent, ModalDescription, ModalHeader } from "semantic-ui-react";
import UIButton from "../UI/UIButton/UIButton";

const UIModal = ({ open = false, header, content, buttonText, buttonIcon, headerIcon, headerColor, openDialogHandler, buttonClickHandler }) => {
  // const [open, setOpen] = React.useState(openModal);

  return (
    <Modal
      centered={false}
      open={open}
      onClose={() => openDialogHandler(false)}
      onOpen={() => openDialogHandler(true)}
    // trigger={<Button>Show Modal</Button>}
    >
      <Header icon={headerIcon} color={headerColor || "black"} content={header} />
      <ModalContent>
        <ModalDescription style={{color: "black", fontSize: "1.2rem"}}>
          {content}
        </ModalDescription>
      </ModalContent>
      <ModalActions>
        <Button 
          onClick={buttonClickHandler}
          content={buttonText}
          icon={buttonIcon} />
      </ModalActions>
    </Modal>
  );
}

export default UIModal;