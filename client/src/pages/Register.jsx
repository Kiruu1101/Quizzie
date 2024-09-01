import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userRegisterApi } from "../apis/User";
import styles from "../assets/Auth.module.css";

function Register() {
  const navigate = useNavigate();

  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const userRegister = async () => {
    const data = await userRegisterApi(input);
    if (data) navigate("/login");
  };

  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s.]+$/;
    return nameRegex.test(name);
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
    setError(() => ({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    }));

    Object.keys(input).forEach((key) => {
      const element = input[key];
      if (typeof element === "string" && element.trim().length === 0) {
        isError = true;
        setError((error) => ({ ...error, [key]: "This field is required" }));
      } else if (key === "name" && !validateName(element)) {
        isError = true;
        setError((error) => ({ ...error, [key]: "Enter a valid name" }));
      } else if (key === "email" && !validateEmail(element)) {
        isError = true;
        setError((error) => ({ ...error, [key]: "Enter a valid email" }));
      } else if (key === "password" && !validatePassword(element)) {
        isError = true;
        setError((error) => ({
          ...error,
          [key]:
            "Password must be at least 6 characters long, with one number, one letter and one special character",
        }));
      } else if (key === "confirmPassword" && element !== input.password) {
        isError = true;
        setError((error) => ({
          ...error,
          [key]: "Passwords do not match with above password",
        }));
      }
    });

    if (!isError) userRegister();
  };

  return (
    <main className={styles.auth}>
      <form className={styles.form} onSubmit={validateForm}>
        <h1 className="brand">QUIZZIE</h1>
        <div className={styles.tab}>
          <button type="button" className={styles.active}>
            Sign Up
          </button>
          <button type="button">
            <Link to="/login">Log In</Link>
          </button>
        </div>
        <div className={styles.input}>
          <div className={styles.inputs}>
            <label htmlFor="name">Name</label>
            <div className={styles.group}>
              <input
                type="text"
                className={error.name && "error"}
                id="name"
                value={input.name}
                onChange={(e) => setInput({ ...input, name: e.target.value })}
              />
              <span htmlFor="name" className="error">
                {error.name}
              </span>
            </div>
          </div>
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
          <div className={styles.inputs}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className={styles.group}>
              <input
                type="password"
                className={error.confirmPassword && "error"}
                id="confirmPassword"
                value={input.confirmPassword}
                onChange={(e) =>
                  setInput({ ...input, confirmPassword: e.target.value })
                }
              />
              <span htmlFor="confirmPassword" className="error">
                {error.confirmPassword}
              </span>
            </div>
          </div>
        </div>
        <button className={styles.submitBtn}>Sign Up</button>
      </form>
    </main>
  );
}

export default Register;
