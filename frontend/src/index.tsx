import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./styles/global.scss";

// eslint-disable-next-line no-undef
console.log(process.env.KEYCLOAK_SECRET);

ReactDOM.render(<App />, document.getElementById("root"));
