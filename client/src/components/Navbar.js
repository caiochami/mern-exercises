import { } from "react-router-dom";
import { Navbar as N} from "react-bootstrap";

function Navbar(props) {
  console.log("auth" , props.auth)
  return (
    <N>
      <N.Brand href="#home">Navbar with text</N.Brand>
      <N.Toggle />
      <N.Collapse className="justify-content-end">
        <N.Text>
          Signed in as: <a href="#login">Mark Otto</a>
        </N.Text>
      </N.Collapse>
    </N>
  );
}

export default Navbar;
