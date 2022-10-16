import React, { useState } from "react";
import { useRef } from "react";
import "./styles/login.css";
import { useNavigate } from "react-router-dom";
import db from "./firebase";
import bcrypt from "bcryptjs";

export default function Register() {
  const email = useRef();
  const password = useRef();
  const username = useRef();
  const passwordAgain = useRef();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    if (email && password && username && passwordAgain) {
      setLoading(true);
      if (password.current.value !== passwordAgain.current.value) {
        setLoading(false);
        alert("Passwords don't match");
      } else {
        try {
          const users = db.collection("users");
          const sameName = await users
            .where("username", "==", username.current.value)
            .get();
          const sameEmail = await users
            .where("email", "==", email.current.value)
            .get();
          if (!sameName.empty) {
            setLoading(false);
            alert("given username is already registered");
          } else if (!sameEmail.empty) {
            setLoading(false);
            alert("given email is already registered");
          } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(
              password.current.value,
              salt
            );
            const user = {
              username: username.current.value,
              password: hashedPassword,
              email: email.current.value,
            };
            await users.add(user);
            setLoading(true);
            alert("User registered");
            navigate("/login");
          }
        } catch (error) {
          setLoading(true);
          console.log(error);
          alert("error occured");
        }
      }
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">SOCIAL</h3>
          <span className="loginDesc">
            Connect with friends and the world around you.
          </span>
        </div>
        <form className="loginRight" onSubmit={handleClick}>
          <div className="loginBox">
            <input
              placeholder="Username"
              required
              ref={username}
              className="loginInput"
            />
            <input
              placeholder="Email"
              required
              type="email"
              ref={email}
              className="loginInput"
            />
            <input
              placeholder="Password"
              minLength="6"
              required
              type="password"
              ref={password}
              className="loginInput"
            />
            <input
              placeholder="Password Again"
              minLength="6"
              required
              type="password"
              ref={passwordAgain}
              className="loginInput"
            />
            <button type="submit" className="loginButton">
              {loading ? <div className="loadingSkeleton"></div> : "Sign Up"}
            </button>
            <button
              onClick={() => navigate("/login")}
              className="loginRegisterButton"
            >
              Login to Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
