import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import useAuth from "../hooks/useAuth";
import { fetchQuizApi } from "../apis/Quiz";
import Sidebar from "../components/Sidebar";
import styles from "../assets/ViewAnalytics.module.css";

function ViewAnalytics() {
  const token = useAuth();
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);

  const fetchQuizData = async () => {
    const data = await fetchQuizApi(token, quizId);
    setQuizData(data);
  };

  useEffect(() => {
    fetchQuizData();
  }, [token, quizId]);

  if (!quizData) return;

  const {
    quizName,
    createdAt,
    quizHits,
    quizData: questions,
    quizType,
  } = quizData;

  const renderQuestions = () => {
    if (!questions || questions.length === 0) {
      return <p>No questions found</p>;
    }

    if (quizType === 1) {
      return questions.map((data, index) => (
        <div className={styles.questions} key={index}>
          <h2>
            Q.{index + 1} {data.question}
          </h2>
          <div className={styles.info}>
            <div className={styles.card}>
              <h1>{data.isAttempted}</h1>
              <p>People Attempted the Question</p>
            </div>
            <div className={styles.card}>
              <h1>{data.isCorrect}</h1>
              <p>People Answered Correctly</p>
            </div>
            <div className={styles.card}>
              <h1>{data.isAttempted - data.isCorrect}</h1>
              <p>People Answered Incorrectly</p>
            </div>
          </div>
        </div>
      ));
    } else {
      return questions.map((data, index) => (
        <div className={styles.questions} key={index}>
          <h2>
            Q.{index + 1} {data.question}
          </h2>
          <div className={styles.info}>
            {data.options &&
              data.options.length > 0 &&
              data.options.map((option, key) => (
                <div className={`${styles.card} ${styles.pollCard}`} key={key}>
                  <h1>{option.value.response}</h1>
                  <p>Option {key + 1}</p>
                </div>
              ))}
          </div>
        </div>
      ));
    }
  };

  return (
    <div className={styles.viewAnalytics}>
      <Sidebar />
      <div className={styles.header}>
        <h2>{quizName} Question Analysis</h2>
        <p>
          <small>Created on : {moment(createdAt).format("DD MMM, YYYY")}</small>
          <br />
          <small>Impressions : {quizHits}</small>
        </p>
      </div>
      {renderQuestions()}
    </div>
  );
}

export default ViewAnalytics;
