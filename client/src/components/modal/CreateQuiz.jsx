import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { createQuizApi } from "../../apis/Quiz";
import { Modal } from "react-responsive-modal";

function CreateQuiz({ open, onClose, onContinue }) {
  const token = useAuth();
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState({ quizName: "", quizType: "" });
  const [quizError, setQuizError] = useState({ quizName: "", quizType: "" });

  const createQuiz = async () => {
    setQuizError(() => ({ quizName: "", quizType: "" }));

    let hasErrors = false;
    for (const key in quizData) {
      if (!quizData[key]) {
        setQuizError((error) => ({
          ...error,
          [key]:
            (key === "quizName" ? "Quiz Name" : "Quiz Type") + " is required",
        }));
        hasErrors = true;
      }
    }

    if (!hasErrors) {
      setQuizData(() => ({ quizName: "", quizType: "" }));
      setQuizError(() => ({ quizName: "", quizType: "" }));

      const quizId = await createQuizApi(quizData, token, navigate);
      if (quizId) onContinue(quizId, quizData.quizType);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        setQuizError("");
      }}
      center
      classNames={{ modal: "createQuizModal" }}
      showCloseIcon={false}
    >
      <div className="content">
        <div>
          <input
            type="text"
            placeholder="Quiz Name"
            value={quizData.quizName}
            onChange={(e) =>
              setQuizData({ ...quizData, quizName: e.target.value })
            }
          />
          {quizError.quizName && (
            <span className="error">{quizError.quizName}</span>
          )}
        </div>
        <div>
          <div className="quizType">
            <p>Quiz Type</p>
            <button
              className={quizData.quizType == 1 ? "active" : ""}
              id="1"
              onClick={(e) =>
                setQuizData({ ...quizData, quizType: e.target.id })
              }
            >
              Q & A
            </button>
            <button
              className={quizData.quizType == 2 ? "active" : ""}
              id="2"
              onClick={(e) =>
                setQuizData({ ...quizData, quizType: e.target.id })
              }
            >
              Poll Type
            </button>
          </div>
          {quizError.quizType && (
            <span className="error">{quizError.quizType}</span>
          )}
        </div>
        <div className="quizAction">
          <button type="button" className="btnCancel" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btnContinue" onClick={createQuiz}>
            Continue
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default CreateQuiz;
