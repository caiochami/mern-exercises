import { Container, Row, Col } from "react-bootstrap";
import Navbar from "./components/Navbar";

import Home from "./views/Home";
import Exercises from "./views/exercises/Exercises";
import Users from "./views/users/Users";

import { Switch, Route, BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <Container>
        <Row>
          <Col sm="12">
            <Navbar />
          </Col>

          <Col sm="12">
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/exercises">
                <Exercises />
              </Route>
              <Route path="/users">
                <Users />
              </Route>
             
              <Route path="*">
                <h5 className="text-danger">Route not found</h5>
              </Route>
            </Switch>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

export default App;
