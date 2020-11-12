import React, { useEffect, useState } from "react";

import { Switch, Link, useRouteMatch, Route } from "react-router-dom";

import { Table, Row, Col } from "react-bootstrap";

import Exercise from "../../api/Exercise";
import Form from "./Form";

function Rows(props) {
  return props.items.map((item) => (
    <tr key={item._id}>
      <td>{item._id}</td>
      <td>{item.description}</td>
      <td>{item.username}</td>
      <td>{item.duration}</td>
      <td>{item.date}</td>
      <td>{item.createdAt}</td>
      <td>{item.updatedAt}</td>
    </tr>
  ));
}

function Content(props) {
  return (
    <Table striped bordered hover responsive size="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Description </th>
          <th>Username</th>
          <th>Duration</th>
          <th>Date</th>
          <th>Created At</th>
          <th>Updated At</th>
        </tr>
      </thead>

      <tbody>
        <Rows items={props.exercises} />
      </tbody>
    </Table>
  );
}

export default function Exercises() {
  let match = useRouteMatch();
  const [exercises, setExercises] = useState([]);

  const [form, setForm] = useState({
    description: ""
  });

  function handleChange(params){
    let newValue = { ...form, ...params}
    setForm(newValue)
    console.log(form)
  }

  useEffect(() => {
    Exercise.get().then(({ data }) => {
      setExercises(data);
    });
  }, []);

  return (
    <>
      <Row>
        <Col>
          <Link to={`${match.url}/create`}>Adicionar</Link>
        </Col>
      </Row>

      <Switch>
        <Route path={`${match.path}/create`}>
          <Form 
          form={form}
          handleChange={handleChange}  />
        </Route>
        <Route path={`${match.path}/`}>
          <Content exercises={exercises} />
        </Route>
      </Switch>
    </>
  );
}
