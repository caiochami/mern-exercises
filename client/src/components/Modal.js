import React from "react";
import { Modal as BModal, Button } from "react-bootstrap";
export default function Modal(props) {
  return (
    <BModal
      animation={false}
      show={props.activeModal}
      onHide={props.closeModal}
    >
      <BModal.Header closeButton>
        <BModal.Title>{props.title || "Form Title"} </BModal.Title>
      </BModal.Header>
      <BModal.Body>{props.children}</BModal.Body>
      <BModal.Footer>
        <Button variant="secondary" onClick={props.closeModal}>
          {props.closeButtonText || "Close"}
        </Button>

        { props.showSubmit === true ? props.submitButton : ""}
      </BModal.Footer>
    </BModal>
  );
}
