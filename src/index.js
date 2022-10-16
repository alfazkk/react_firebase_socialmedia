import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { StateProvider, initialState, reducer } from "./StateProvider";

ReactDOM.render(
  <React.StrictMode>
    <StateProvider initialState={initialState} reducer={reducer}>
      <App />
    </StateProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
