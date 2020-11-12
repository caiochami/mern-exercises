import React from "react";
import { Row, Col, Form as BForm } from "react-bootstrap";
export default function Form(props) {
  console.log(props);
  return (
    <BForm>
      <Row>
        <Col sm="3">
          <BForm.Group>
            <BForm.Label>Description</BForm.Label>
            <BForm.Control
              value={props.form.description}
              onChange={props.handleChange}
              type="text"
              placeholder="Run, plank"
            />
          </BForm.Group>
        </Col>
      </Row>
    </BForm>
  );
}
