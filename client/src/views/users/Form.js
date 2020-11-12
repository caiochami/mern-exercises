import React from "react";

import { Form as BForm, Row, Col } from "react-bootstrap";

function Errors(props) {
  if (props.show) {
    let html = [];

    const { errors } = props;

    for (var prop in errors) {
      html.push(errors[prop]["message"]);
    }

    return html.map((error, index) => {
      return <p className="text-danger font-weight-bold" key={index}>{error}</p>;
    });
  }

  return null;
}

export default function Form(props) {
  
  return (
    <BForm>
      <Row>
        <Col sm="12">
          <Errors
            show={props.showErrors}
            errors={props.errors}
          />
        </Col>
        <Col sm="12">
          <BForm.Group>
            <BForm.Label>Name</BForm.Label>
            <BForm.Control
              value={props.form.name}
              name="name"
              id="name"
              onChange={props.handleChange}
              type="text"
              placeholder="Run, plank"
            />
          </BForm.Group>
        </Col>
        <Col sm="12">
          <BForm.Group>
            <BForm.Label>Email</BForm.Label>
            <BForm.Control
              value={props.form.email}
              name="email"
              id="email"
              onChange={props.handleChange}
              type="email"
              placeholder="E-mail"
            />
          </BForm.Group>
        </Col>
        <Col sm="6">
          <BForm.Group>
            <BForm.Label>Password</BForm.Label>
            <BForm.Control
              value={props.form.password}
              name="password"
              id="password"
              onChange={props.handleChange}
              type="password"
              placeholder="E-mail"
            />
          </BForm.Group>
        </Col>
        <Col sm="6">
          <BForm.Group>
            <BForm.Label>Password Confirmation</BForm.Label>
            <BForm.Control
              value={props.form.password_confirmation}
              name="password_confirmation"
              id="password_confirmation"
              onChange={props.handleChange}
              type="password_confirmation"
              placeholder="E-mail"
            />
          </BForm.Group>
        </Col>
      </Row>
    </BForm>
  );
}
