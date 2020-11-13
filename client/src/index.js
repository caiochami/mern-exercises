import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css";

import Axios from "axios";
Axios.defaults.baseURL = "http://localhost:5000";

Axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

Axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

window.axios = Axios;

window._ = require("lodash");

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
