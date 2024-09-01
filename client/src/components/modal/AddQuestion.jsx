import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Modal } from "react-responsive-modal";
import { addQuestionApi } from "../../apis/Quiz";

function AddQuestion({ quizId, quizType, open, onClose, onContinue }) {
  const token = useAuth();

  const [allQuestion, setAllQuestion] = useState([]);
  const [question, setQuestion] = useState("");
  const [questionsError, setQuestionsError] = useState("");
  const [optionType, setOptionType] = useState("text");
  const [options, setOptions] = useState([
    { id: 1, value: { text: "", image: "", response: 0 } },
    { id: 2, value: { text: "", image: "", response: 0 } },
  ]);
  const [optionsError, setOptionsError] = useState("");
  const [timer, setTimer] = useState(-1);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  const [questionData, setQuestionData] = useState({
    question: "",
    optionType: "",
    options: [],
    timer: -1,
    correctAnswer: null,
    isAttempted: 0,
    isCorrect: 0,
  });

  const handleTextOptionInput = (e, id) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === id
          ? { ...option, value: { ...option.value, text: e.target.value } }
          : option
      )
    );
  };

  const handleImageOptionInput = (e, id) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === id
          ? { ...option, value: { ...option.value, image: e.target.value } }
          : option
      )
    );
  };

  const handleRemoveOption = (id) => {
    setOptions((prevOptions) => {
      const filteredOptions = prevOptions.filter((option) => option.id !== id);
      return filteredOptions.map((option, index) => ({
        ...option,
        id: index + 1,
      }));
    });
  };

  const addOptionBox = () => {
    setOptions((prevOptions) => [
      ...prevOptions,
      {
        id: prevOptions.length + 1,
        value: { text: "", image: "", response: 0 },
      },
    ]);
  };

  const renderOptionType = () => {
    const renderOptionInput = (
      index,
      option,
      placeholder,
      value,
      handleChange
    ) => (
      <div className="inputs">
        <input
          type="text"
          id={`Option ${index + 1}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleChange(e, option.id)}
          autoComplete="off"
        />
        <span htmlFor={`Option ${index + 1}`} className="error">
          {optionsError.includes(`Option ${option.id}`) ? optionsError : ""}
        </span>
      </div>
    );

    const renderOptionBox = () => {
      return options.map((option, index) => (
        <div className="radioBox" key={option.id}>
          {quizType == 1 && (
            <input
              type="radio"
              name="correctOption"
              id={`Option ${index + 1}`}
              onChange={() => setCorrectAnswer(index)}
              checked={correctAnswer === index}
            />
          )}
          <div className="inputWraps">
            {optionType !== "image" &&
              renderOptionInput(
                index,
                option,
                `Text ${index + 1}`,
                option.value.text,
                handleTextOptionInput
              )}
            {optionType !== "text" &&
              renderOptionInput(
                index,
                option,
                `Image URL ${index + 1}`,
                option.value.image,
                handleImageOptionInput
              )}
          </div>
          {(option.id == 3 || option.id == 4) && (
            <img
              src="/icons/trash.svg"
              className="btnRemOption"
              alt="trash icon"
              onClick={() => handleRemoveOption(option.id)}
            />
          )}
        </div>
      ));
    };

    return (
      <div className="optionsPanel">
        {renderOptionBox()}
        {options.length != 4 && (
          <div className="radioBox">
            <button
              className={`${quizType == 2 ? "pollOption" : ""}`}
              onClick={addOptionBox}
            >
              Add option
            </button>
          </div>
        )}
      </div>
    );
  };

  const resetQuestionPanel = () => {
    setQuestion("");
    setQuestionsError("");
    setOptionsError("");
    setOptionType("text");
    setOptions([
      { id: 1, value: { text: "", image: "", response: 0 } },
      { id: 2, value: { text: "", image: "", response: 0 } },
    ]);
    setTimer(-1);
    setCorrectAnswer(null);
  };

  const handleChangeOptionType = (type) => {
    setOptionsError("");
    setOptionType(type);
    setOptions([
      { id: 1, value: { text: "", image: "", response: 0 } },
      { id: 2, value: { text: "", image: "", response: 0 } },
    ]);
    setCorrectAnswer("");
  };

  const validateQuestion = () => {
    setQuestionsError("");
    setOptionsError("");

    if (question.trim() === "") {
      setQuestionsError("Question cannot be blank");
      return true;
    }

    for (let option of options) {
      const { text, image } = option.value;
      if (
        (optionType === "text" && text.trim() === "") ||
        (optionType === "image" && image.trim() === "") ||
        (optionType !== "text" &&
          optionType !== "image" &&
          (text.trim() === "" || image.trim() === ""))
      ) {
        setOptionsError(`Option ${option.id} cannot be blank`);
        return true;
      }
    }

    if (quizType == 1 && correctAnswer == null) {
      setQuestionsError("Please choose one correct option");
      return true;
    }

    return false;
  };

  const addQuestion = () => {
    if (!validateQuestion()) {
      const finalQsnData = [...allQuestion, questionData];
      setAllQuestion(finalQsnData);
      resetQuestionPanel();

      return finalQsnData;
    }
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = allQuestion.filter((_, i) => i !== index);
    setAllQuestion(updatedQuestions);
  };

  const createQuiz = async () => {
    const quizData = addQuestion();
    const data = quizData && (await addQuestionApi(quizId, quizData, token));
    if (data) onContinue(quizId);
  };

  useEffect(() => {
    setQuestionData({
      ...questionData,
      question: question,
      optionType: optionType,
      options: options,
      timer: timer,
      correctAnswer: correctAnswer,
    });
  }, [question, optionType, options, timer, correctAnswer]);

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        resetQuestionPanel();
        setAllQuestion([]);
      }}
      center
      classNames={{ modal: "createQuestionModal" }}
      showCloseIcon={false}
    >
      <div className="header">
        <div className="palette">
          {allQuestion?.map((_, index) => (
            <div className="question" key={index}>
              <div className="bubble">{index + 1}</div>
              {index != 0 && (
                <img
                  className="delete"
                  src="/icons/cross.svg"
                  onClick={() => deleteQuestion(index)}
                  alt="cross icon"
                />
              )}
            </div>
          ))}
          {allQuestion.length < 4 && (
            <div onClick={addQuestion}>
              <img src="/icons/plus.svg" alt="plus icon" />
            </div>
          )}
        </div>
        <div>
          <p>Max 5 questions</p>
        </div>
      </div>
      <div className="questionBox">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={`${quizType == 1 ? "Q&A" : "Poll"} Questions`}
        />
        <span htmlFor="" className="error">
          {questionsError}
        </span>
      </div>
      <div className="optionType">
        <p>Option Type</p>
        {["text", "image", "text&image"].map((type) => (
          <div className="radioBox" key={type}>
            <input
              type="radio"
              name="optionType"
              onChange={(e) => handleChangeOptionType(e.target.id)}
              id={type}
              checked={optionType === type}
            />
            <label htmlFor={type}>
              {type === "text"
                ? "Text"
                : type === "image"
                ? "Image URL"
                : "Text & Image URL"}
            </label>
          </div>
        ))}
      </div>
      <div className="optionAndTimer">
        {renderOptionType()}
        <div className="timer">
          <p>Timer</p>
          {[-1, 5, 10].map((time) => (
            <button
              key={time}
              className={timer === time ? "active" : ""}
              onClick={() => setTimer(time)}
            >
              {time === -1 ? "OFF" : `${time} sec`}
            </button>
          ))}
        </div>
      </div>
      <div className={`qsnAction ${quizType == 2 ? "pollAction" : ""}`}>
        <button onClick={onClose}>Cancel</button>
        <button className="btnCreateQuiz" onClick={createQuiz}>
          Create Quiz
        </button>
      </div>
    </Modal>
  );
}

export default AddQuestion;
