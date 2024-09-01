import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal } from "react-responsive-modal";
import styles from "../assets/Sidebar.module.css";

import CreateQuiz from "./modal/CreateQuiz";
import AddQuestion from "./modal/AddQuestion";

function Sidebar({ refreshData }) {
  const location = useLocation();
  const [activeNav, setActiveNav] = useState(location.pathname);

  const [openCreateQuiz, setOpenCreateQuiz] = useState(false);
  const [openAddQuestion, setOpenAddQuestion] = useState(false);
  const [openShareQuiz, setOpenShareQuiz] = useState(false);

  const [quizId, setQuizId] = useState("");
  const [quizType, setQuizType] = useState(null);

  const shareQuiz = async () => {
    const link = `${window.location.origin}/share/${quizId}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard.");
    } catch (error) {
      handleApiErr(error, navigate);
    }
  };

  return (
    <div className={styles.sidebar}>
      <h1 className="brand">QUIZZIE</h1>
      <div className={styles.nav}>
        <button className={activeNav === "/dashboard" ? styles.active : ""}>
          <Link to="/dashboard" onClick={() => setActiveNav("dashboard")}>
            Dashboard
          </Link>
        </button>
        <button className={activeNav === "/analytics" ? styles.active : ""}>
          <Link to="/analytics" onClick={() => setActiveNav("analytics")}>
            Analytics
          </Link>
        </button>
        <button>
          <div type="button" onClick={() => setOpenCreateQuiz(true)}>
            Create Quiz
          </div>
        </button>
      </div>
      <div>
        <hr className={styles.divider} />
        <br />
        <Link to="/login" onClick={() => localStorage.removeItem("authToken")}>
          LOGOUT
        </Link>
      </div>
      <CreateQuiz
        open={openCreateQuiz}
        onClose={() => setOpenCreateQuiz(false)}
        onContinue={(quizId, quizType) => {
          setOpenAddQuestion(true);
          setQuizId(quizId);
          setQuizType(quizType);
        }}
      />
      <AddQuestion
        quizId={quizId}
        quizType={quizType}
        open={openAddQuestion}
        onClose={() => {
          setOpenAddQuestion(false);
          setOpenCreateQuiz(false);
          refreshData();
        }}
        onContinue={(quizId) => {
          setOpenAddQuestion(false);
          setOpenShareQuiz(true);
          setQuizId(quizId);
        }}
      />
      <Modal
        open={openShareQuiz}
        onClose={() => {
          setOpenShareQuiz(false);
          setOpenCreateQuiz(false);
          refreshData();
        }}
        center
        classNames={{ modal: "createQuizModal" }}
      >
        <div className="content shareTestModal">
          <h1>Congrats your Quiz is Published!</h1>
          <input
            type="text"
            placeholder={`${window.location.origin}/share/${quizId}`}
            readOnly
          />
          <div className="quizAction">
            <button className="btnShare" onClick={shareQuiz}>
              Share
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Sidebar;
