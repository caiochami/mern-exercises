import { Link } from "react-router-dom";
import { ListGroup } from "react-bootstrap"

function Navbar() {

  return (
    <ListGroup className="mb-2" horizontal>
      <ListGroup.Item>
        <Link className="none" to="/">Home</Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link className="none" to="/exercises">Exercises List</Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link className="none" to="/users">Users List</Link>
      </ListGroup.Item>
    </ListGroup>
  );
}

export default Navbar;
