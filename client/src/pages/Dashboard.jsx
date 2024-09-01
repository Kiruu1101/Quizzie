import React, { useState, useEffect } from "react";
import moment from "moment";
import useAuth from "../hooks/useAuth";
import { fetchQuizApi } from "../apis/Quiz";
import Sidebar from "../components/Sidebar";
import styles from "../assets/Dashboard.module.css";

function Dashboard() {
  const token = useAuth();

  const [quizData, setQuizData] = useState([]);
  const formatCount = (count) =>
    count >= 1000 ? (count / 1000).toFixed(1) + "K" : count;

  const userDashboard = async () => {
    const data = await fetchQuizApi(token);
    if (data) setQuizData(data);
  };

  useEffect(() => {
    if (token) {
      userDashboard();
    }
  }, [token]);

  return (
    <div className={styles.dashboard}>
      <Sidebar refreshData={userDashboard} />
      <div className={styles.info}>
        <div className={styles.infoCard}>
          <div>
            <p>
              <span>{quizData.length}</span> Quiz
            </p>
            Created
          </div>
        </div>
        <div className={styles.infoCard}>
          <div>
            <p>
              <span>
                {quizData.reduce((acc, item) => acc + item.quizData.length, 0)}
              </span>
              Questions
            </p>
            Created
          </div>
        </div>
        <div className={styles.infoCard}>
          <div>
            <p>
              <span>
                {formatCount(
                  quizData.reduce((acc, item) => acc + item.quizHits, 0)
                )}
              </span>
              Total
            </p>
            Impressions
          </div>
        </div>
      </div>
      <div className={styles.quizzes}>
        <h1>Trending Quizzes</h1>
        <div>
          {quizData.length > 0 ? (
            quizData
              .sort((a, b) => b.quizHits - a.quizHits)
              .map((data, index) => (
                <div className={styles.quizCard} key={index}>
                  <p>
                    <span>{data.quizName}</span>
                    <span>
                      {data.quizHits}
                      <img src="/icons/eye.svg" alt="eye-icon" />
                    </span>
                  </p>
                  <p>
                    Created on : {moment(data.createdAt).format("DD MMM, YYYY")}
                  </p>
                </div>
              ))
          ) : (
            <p>No quizzes available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
