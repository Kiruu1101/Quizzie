import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import {
  fetchSharableQuizApi,
  updateQuizResponseApi,
  countQuizHitsApi,
} from "../apis/Quiz";
import styles from "../assets/Share.module.css";

function Share() {
  const navigate = useNavigate();

  const { quizId } = useParams();
  const [quizData, setQuizData] = useState([]);
  const [questionList, setQuestionList] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [totalQuestion, setTotalQuestion] = useState(0);
  const [timer, setTimer] = useState(questionList[currentQuestion]?.timer);
  const [score, setScore] = useState(0);

  const fetchQuizData = async () => {
    const data = await fetchSharableQuizApi(quizId);
    if (data) {
      setQuizData(data);
      setQuestionList(data.quizData);
      setTotalQuestion(data.quizData.length);
    }
  };

  const handleNextQuestion = async () => {
    let newscore = score;
    if (quizData.quizType === 1) {
      if (selectedOption == questionList[currentQuestion].correctAnswer) {
        newscore += 1;
        setScore((score) => score + 1);
        await updateQuizResponseApi("isCorrect", quizId, currentQuestion);
      }
    }

    if (quizData.quizType === 2)
      await updateQuizResponseApi(
        "pollResponse",
        quizId,
        currentQuestion,
        selectedOption
      );

    if (currentQuestion < totalQuestion - 1) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      setQuestionCount((prevQuestion) => prevQuestion + 1);
    } else {
      localStorage.setItem("quizScore", newscore + "/" + totalQuestion);
      navigate("/result/" + quizData.quizType);
    }
    setSelectedOption(null);
  };

  const renderOptions = (quiz) => {
    return quiz.options.map((option, index) => (
      <div
        key={index}
        className={`${styles.card} ${
          quiz.optionType === "image" ? styles.onlyImage : ""
        } ${selectedOption === index ? styles.active : ""}`}
        onClick={() => setSelectedOption(index)}
      >
        {quiz.optionType !== "image" && option.value.text}
        {(quiz.optionType === "image" || quiz.optionType === "text&image") && (
          <img src={option.value.image} alt="question image" />
        )}
      </div>
    ));
  };

  const updateQsnIsAttempted = async (qsnNo) => {
    updateQuizResponseApi("isAttempted", quizId, qsnNo);
  };

  const countQuizHits = async () => {
    quizId && (await countQuizHitsApi(quizId));
  };

  useEffect(() => {
    fetchQuizData();
    setQuestionCount(1);
    countQuizHits();
    localStorage.removeItem("quizScore");
  }, []);

  useEffect(() => {
    quizData.quizType === 1 && updateQsnIsAttempted(currentQuestion);
    setTimer(questionList[currentQuestion]?.timer);
  }, [quizData, currentQuestion]);

  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    } else if (timer === 0) {
      handleNextQuestion();
    } else {
      return;
    }
  }, [timer]);

  return (
    <div className={styles.share}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h2>
              {String(questionCount).padStart(2, "0")}/
              {String(totalQuestion).padStart(2, "0")}
            </h2>
            <h2 className="timer">
              {timer > 0 && moment.utc(timer * 1000).format("mm:ss") + "s"}
            </h2>
          </div>
          <div className={styles.question}>
            <h2>{questionList[currentQuestion]?.question}</h2>
          </div>
          <div className={styles.options}>
            {questionList.length > 0 &&
              renderOptions(questionList[currentQuestion])}
          </div>
        </div>
        <div className={styles.submit}>
          <button
            onClick={handleNextQuestion}
            disabled={selectedOption === null}
          >
            {currentQuestion === totalQuestion - 1 ? "SUBMIT" : "NEXT"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Share;
