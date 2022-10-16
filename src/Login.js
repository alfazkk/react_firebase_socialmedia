import React, { useState } from "react";
import { useRef } from "react";
import "./styles/login.css";
import { useNavigate } from "react-router-dom";
import db from "./firebase";
import { useStateProvider } from "./StateProvider";
import bcrypt from "bcryptjs";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useStateProvider();

  const handleClick = async (e) => {
    e.preventDefault();
    if (email && password) {
      try {
        setLoading(true);
        db.collection("users")
          .get()
          .then(async (data) => {
            const user = data.docs.find(
              (doc) => doc.data().email === email.current.value
            );
            if (!user) {
              setLoading(false);
              alert("user not found");
            } else {
              const validPassword = await bcrypt.compare(
                password.current.value,
                user.data().password
              );
              if (validPassword) {
                dispatch({
                  type: "SET_USER",
                  user: {
                    userId: user.id,
                    ...user.data(),
                    password: "",
                  },
                });
                const userData = {
                  userId: user.id,
                  ...user.data(),
                  password: "",
                };
                sessionStorage.setItem("user", JSON.stringify(userData));
                setLoading(false);
                alert("login successfull");
                navigate("/");
              } else {
                setLoading(false);
                alert("wrong password");
              }
            }
          });
      } catch (error) {
        setLoading(false);
        console.log(error);
        alert("error occured");
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
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Email"
              required
              type="email"
              className="loginInput"
              ref={email}
            />
            <input
              placeholder="Password"
              required
              minLength="6"
              type="password"
              className="loginInput"
              ref={password}
            />
            <button type="submit" className="loginButton">
              {loading ? <div className="loadingSkeleton"></div> : "Login"}
            </button>
            <button
              onClick={() => navigate("/register")}
              className="loginRegisterButton"
            >
              Create a New Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
