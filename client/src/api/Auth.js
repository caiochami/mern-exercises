import Axios from "axios";

const USER = localStorage.getItem("user");
const TOKEN = localStorage.getItem("token");

class Auth {
  isAuthenticated = false;
  user = null;
  token = null;
  busy = false;
  constructor({ user, token }) {
    if (token && user) {
      try {
        this.token = JSON.parse(token);
        this.user = JSON.parse(user);
        this.isAuthenticated = true;
      } catch (error) {
        console.log("user", error);
        throw new Error("auth error");
      }
    }
  }
  setUser(value) {
    localStorage.setItem("user", JSON.stringify(value));
  }
  setToken(value) {
    localStorage.setItem("token", JSON.stringify(value));
  }
  id() {
    try {
      return this.user().id;
    } catch (error) {
      return null;
    }
  }

  user() {
    const { user = null } = this.data || {};

    return user;
  }

  clear() {
    localStorage.setItem("user", null);
    localStorage.setItem("token", null);
    this.user = null;
    this.token = null;
    this.isAuthenticated = false;
  }

  async me() {
    const me = await Axios.post("/me");
    this.set(me);
  }

  async signin(form, callback) {

    this.busy = true;
    console.log("attempting to sign in", form.state)
    const token = await Axios.post("/login", form.state);
    console.log("token", token)
    if (!token) {
      this.clear();
      form.clear();
    } else {
      this.setToken(token);
      await this.me().then(({ data }) => {
        console.log("user", data)
        this.setUser(data);
        this.isAuthenticated = true;
        setTimeout(callback(data), 100);
      });
    }
  }

  logout(callback) {
    this.clear();
    setTimeout(callback, 100);
  }
}

export default new Auth({ TOKEN, USER });
