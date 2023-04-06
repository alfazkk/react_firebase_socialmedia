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
  loading: false,
  posts: [],
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
    case "FETCH_POSTS_START":
      return {
        ...state,
        loading: true,
      };
    case "FETCH_POSTS_SUCCESS":
      return {
        ...state,
        loading: false,
        posts: action.data,
      };
    case "FETCH_POSTS_FAIL":
      return {
        ...state,
        loading: false,
      };
    case "ADD_POST":
      return {
        ...state,
        posts: [action.data, ...state.posts],
      };

    default:
      return state;
  }
};
