import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "semantic-ui-css/semantic.min.css";
import "./dist/verysmalltoast.css";
import "./App.css";
import "very-small-toast";

import registerServiceWorker from "./registerServiceWorker";

const rootEl = document.getElementById("root");
ReactDOM.render(<App />, rootEl);

if (module.hot) {
  module.hot.accept("./App", () => {
    const NextApp = require("./App").default;
    ReactDOM.render(<NextApp />, rootEl);
  });
}
registerServiceWorker();
