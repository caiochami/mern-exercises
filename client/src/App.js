import { useState, useContext, createContext } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Navbar from "./components/Navbar";

/* import Home from "./views/Home";
import Exercises from "./views/exercises/Exercises";
import Users from "./views/users/Users"; */

import {
  Switch,
  Route,
  BrowserRouter as Router,
  useHistory,
  useLocation,
  Redirect,
} from "react-router-dom";

import Auth from "./api/Auth";

window.auth = Auth;

const authContext = createContext();

function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

function useAuth() {
  return useContext(authContext);
}

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signin = (form, cb) => {
    return Auth.signin(form, (data) => {
      console.log("setting user", data)
      setUser(data);
      cb();
    });
  };

  const logout = (cb) => {
    return Auth.logout(() => {
      setUser(null);
      cb();
    });
  };

  return {
    user,
    signin,
    logout,
  };
}

function AuthButton() {
  let history = useHistory();
  let auth = useAuth();

  return auth.user ? (
    <p>
      Welcome!{" "}
      <button
        onClick={() => {
          auth.logout(() => history.push("/login"));
        }}
      >
        Sign out
      </button>
    </p>
  ) : (
    ""
  );
}

function PublicPage() {
  return <h3>Public</h3>;
}

function ProtectedPage() {
  return <h3>Protected</h3>;
}

function LoginPage() {
  const defaultForm = {
    email: "",
    password: "",
  };

  const [form, setForm] = useState(defaultForm);

  function handleChange(el) {
    const { name, value } = el.target;

    let newValue = {};
    newValue[name] = value;

    setForm({ ...form, ...newValue });
  }

  let history = useHistory();
  let location = useLocation();
  let auth = useAuth();

  let { from } = location.state || { from: { pathname: "/" } };
  let login = () => {
    auth.signin(
      {
        state: form,
        clear() {
          setForm(defaultForm);
        },
      },
      () => {
        history.replace(from);
      }
    );
  };

  return (
    <Row>
      <Col sm="12">
        <Form.Group>
          <Form.Label>E-mail address</Form.Label>
          <Form.Control
            value={form.email}
            name="email"
            id="email"
            onChange={handleChange}
            type="text"
            placeholder="E-mail address"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={form.password}
            name="password"
            id="password"
            onChange={handleChange}
            type="password"
            placeholder="Password"
          />
        </Form.Group>
        <Button variant="primary" onClick={login}>
          Login
        </Button>
      </Col>
    </Row>
  );
}

function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

function App() {
  return (
    <ProvideAuth>
      <Router>
        <Container>
          <Row>
            <Col sm="12">
              <Navbar />
            </Col>
            <Col>
              <AuthButton />
              <Switch>
                <Route exact path="/">
                  <div>Landing page</div>
                </Route>
                <Route path="/public">
                  <PublicPage />
                </Route>
                <Route path="/login">
                  <LoginPage />
                </Route>
                <PrivateRoute path="/protected">
                  <ProtectedPage />
                </PrivateRoute>
                <Route path="*">
                  <h5 className="text-danger">Route not found</h5>
                </Route>
              </Switch>
            </Col>
          </Row>
        </Container>
      </Router>
    </ProvideAuth>
  );
}

export default App;
