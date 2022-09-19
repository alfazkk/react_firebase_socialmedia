import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import Profile, { SearchedProfile } from "./Profile";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useStateProvider } from "./StateProvider";

export default function App() {
  const [{ user }] = useStateProvider();

  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/"
            element={user ? <Home user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/profile"
            exact
            element={user ? <Profile user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/:id"
            element={user ? <SearchedProfile /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </div>
  );
}
