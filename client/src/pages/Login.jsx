import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userLoginApi } from "../apis/User";
import styles from "../assets/Auth.module.css";

function Login() {
  const navigate = useNavigate();

  const [input, setInput] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "" });

  const userLogin = async () => {
    const token = await userLoginApi(input);
    if (token) {
      localStorage.setItem("authToken", token);
      navigate("/dashboard");
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    return passRegex.test(password);
  };

  const validateForm = (e) => {
    e.preventDefault();

    let isError = false;
    setError(() => ({ email: "", password: "" }));

    Object.keys(input).forEach((key) => {
      const element = input[key];
      if (typeof element === "string" && element.trim().length === 0) {
        isError = true;
        setError((error) => ({ ...error, [key]: "This field is required" }));
      } else if (key === "email" && !validateEmail(element)) {
        isError = true;
        setError((error) => ({ ...error, [key]: "Enter a valid email Id" }));
      } else if (key === "password" && !validatePassword(element)) {
        isError = true;
        setError((error) => ({
          ...error,
          [key]:
            "Password must be at least 6 characters long, with one number, one letter and one special character",
        }));
      }
    });

    if (!isError) userLogin();
  };

  return (
    <main className={styles.auth}>
      <form className={styles.form} onSubmit={validateForm}>
        <h1 className="brand">QUIZZIE</h1>
        <div className={styles.tab}>
          <button type="button">
            <Link to="/register">Sign Up</Link>
          </button>
          <button type="button" className={styles.active}>
            Log In
          </button>
        </div>
        <div className={styles.input}>
          <div className={styles.inputs}>
            <label htmlFor="email">Email</label>
            <div className={styles.group}>
              <input
                type="email"
                className={error.email && "error"}
                id="email"
                value={input.email}
                onChange={(e) => setInput({ ...input, email: e.target.value })}
              />
              <span htmlFor="email" className="error">
                {error.email}
              </span>
            </div>
          </div>
          <div className={styles.inputs}>
            <label htmlFor="password">Password</label>
            <div className={styles.group}>
              <input
                type="password"
                className={error.password && "error"}
                id="password"
                value={input.password}
                onChange={(e) =>
                  setInput({ ...input, password: e.target.value })
                }
              />
              <span htmlFor="password" className="error">
                {error.password}
              </span>
            </div>
          </div>
        </div>
        <button className={styles.submitBtn}>Log In</button>
      </form>
    </main>
  );
}

export default Login;
