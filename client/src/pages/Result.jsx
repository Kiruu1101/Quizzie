import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../assets/Share.module.css";

function Result() {
  const { quizType } = useParams();

  return (
    <div className={styles.share}>
      <div className={styles.container}>
        <div className={styles.result}>
          {quizType == 1 ? (
            <>
              <h1>Congrats Quiz is completed</h1>
              <img src="/images/trophy.png" alt="trophy" />
              <h1>
                Your Score is
                <span className={styles.score}>
                  {localStorage.getItem("quizScore")}
                </span>
              </h1>
            </>
          ) : (
            <h1 style={{ fontSize: "50px" }}>
              Thank you for participating in the Poll
            </h1>
          )}
        </div>
      </div>
    </div>
  );
}

export default Result;
