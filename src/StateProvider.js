import React, { createContext, useReducer, useContext } from "react";

export const StateContext = createContext();
export const StateProvider = ({ initialState, reducer, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);
export const useStateProvider = () => useContext(StateContext);

export const initialState = {
  user: sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null,
  sidebar: false,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    case "SIDEBAR-ON":
      return {
        ...state,
        sidebar: true,
      };
    case "SIDEBAR-OFF":
      return {
        ...state,
        sidebar: false,
      };
    default:
      return state;
  }
};
