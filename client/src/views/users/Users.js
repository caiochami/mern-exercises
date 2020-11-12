import React from "react";

import { Table, Button, Badge, Spinner } from "react-bootstrap";

import UserComponent from "./User";

import Modal from "../../components/Modal";

import User from "../../api/User";

import Form from "./Form";


const defaultForm = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  _id: null,
};

export default class Users extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      errors: {},
      user: null,
      busy: false,
      selected: [],
      activeModal: false,
      form: defaultForm,
      mode: "create",
    };

    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.setBusyState = this.setBusyState.bind(this);
    this.toggleSelected = this.toggleSelected.bind(this);
    this.setErrors = this.setErrors.bind(this);
    this.clearErrors = this.clearErrors.bind(this);

    this.show = this.show.bind(this);
    this.users = this.users.bind(this);
    this.store = this.store.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);

    this.clear = this.clear.bind(this);
    this.fill = this.fill.bind(this);
    this.add = this.add.bind(this);
    this.edit = this.edit.bind(this);

    this.changeMode = this.changeMode.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async users() {
    this.setBusyState(true);
    await User.get()
      .then(({ data }) => {
        this.setState({
          users: data,
        });
        this.setBusyState(false);
      })
      .catch((err) => {
        console.log(err.response);
        this.setBusyState(false);
      });
  }

  async store() {
    await User.store(this.state.form)
      .then(({ data }) => {
        this.setState({
          users: [...this.state.users, data],
        });
        this.closeModal();
      })
      .catch((err) => {
        if(err.response.status === 400){
          this.setErrors(err.response.data.errors || [])
        }
      });
  }

  async update() {
    this.setBusyState(true);
    await User.update(this.state.form)
      .then(() => {
        this.users();
        this.closeModal();
        this.setBusyState(false);
      })
      .catch((err) => {
        this.setBusyState(false);
        console.log(err.response);
      });
  }

  async delete(ids) {
    this.setBusyState(true);
    await User.destroy(ids)
      .then(() => {
        this.setBusyState(false);
        this.users();

        this.setState({
          selected: [],
        });
      })
      .catch((err) => {
        this.setBusyState(false);
        console.log(err.response);
      });
  }

  setBusyState(value) {
    this.setState({
      busy: value,
    });
  }

  setErrors(errors){
    this.setState({
      errors
    })
  }

  clearErrors(){
    this.setState({
      errors: {}
    })
  }

  hasErrors(){
    return !(Object.keys(this.state.errors).length === 0 && this.state.errors.constructor === Object)
  }

  isSelected(_id) {
    let exists = this.state.selected.find((id) => {
      return id === _id;
    });

    return exists ? true : false;
  }

  hasSelected() {
    return this.state.selected.length ? true : false;
  }

  toggleSelected({ _id }) {
    let selected = [];
    if (this.isSelected(_id)) {
      selected = this.state.selected.filter((id) => {
        return id !== _id;
      });
    } else {
      selected = [...this.state.selected, _id];
    }

    this.setState({
      selected,
    });
  }

  show(user) {
    this.changeMode("view");
    this.setState({ user: user });
    this.openModal();
  }

  changeMode(mode) {
    this.setState({
      mode: mode,
    });
  }

  add() {
    this.changeMode("create");
    this.openModal();
  }

  edit(model) {
    this.changeMode("edit");

    this.fill(model);
    this.openModal();
  }

  closeModal() {
    this.setState({
      activeModal: false,
    });

    this.clear();
  }

  openModal() {
    this.setState({
      activeModal: true,
    });
  }

  fill(model) {
    this.setState({ form: model });
  }

  clear() {
    this.setState({ form: defaultForm });
  }

  handleChange(event) {
    const { name, value } = event.target;
    let params = {};
    params[name] = value;

    this.setState({ form: { ...this.state.form, ...params } });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.mode === "create") {
      this.store();
    } else if (this.state.mode === "edit") {
      this.update();
    } else {
      return null;
    }
  }

  componentDidMount() {
    this.users();
  }

  content() {
    const { users } = this.state;

    if (!users.length) {
      return (
        <tr>
          <td colSpan="2">No user found</td>
        </tr>
      );
    }

    return users.map((user) => (
      <tr key={user._id}>
        <td>
          <span onClick={() => this.toggleSelected(user)}>{user._id}</span>{" "}
          <Badge onClick={() => this.edit(user)} variant="success">
            edit
          </Badge>
          <Badge
            className="ml-1"
            onClick={() => {
              this.show(user);
            }}
            variant="primary"
          >
            view
          </Badge>
          <Badge
            className="ml-1"
            onClick={() => this.delete([user._id])}
            variant="danger"
          >
            destroy
          </Badge>
          {this.isSelected(user._id) && (
            <Badge className="ml-1" variant="info">
              selected
            </Badge>
          )}
        </td>
        <td>{user.name}</td>
      </tr>
    ));
  }

  render() {
    return (
      <>
        <div className="d-flex justify-content-between mb-1">
          <div>
            <span>Users</span>
          </div>
          <div className="d-flex center">
            {this.state.busy && (
              <Spinner className="mr-2" animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            )}

            <Button onClick={this.add} size="md" variant="primary">
              Add
            </Button>
            {this.hasSelected() && (
              <Button
                onClick={() => this.delete(this.state.selected)}
                size="sm"
                className="ml-1"
                variant="danger"
              >
                Remove selected {this.state.selected.length}
              </Button>
            )}
          </div>
        </div>
        <Table striped bordered hover responsive size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
            </tr>
          </thead>

          <tbody>{this.content()}</tbody>
        </Table>
        <Modal
          activeModal={this.state.activeModal}
          closeModal={this.closeModal}
          showSubmit={this.mode !== "view"}
          submitButton={
            <Button variant="primary" onClick={this.handleSubmit}>
              Save Changes
            </Button>
          }
        >
          {this.state.mode === "view" ? (
            <UserComponent user={this.state.user} />
          ) : (
            <Form 
            showErrors={this.hasErrors()}
            errors={this.state.errors}
            form={this.state.form} handleChange={this.handleChange} />
          )}
        </Modal>
      </>
    );
  }
}
