import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import { fetchQuizApi, fetchQuestionApi, deleteQuizApi } from "../apis/Quiz";
import Sidebar from "../components/Sidebar";
import { Modal } from "react-responsive-modal";
import UpdateQuestion from "../components/modal/UpdateQuestion";
import styles from "../assets/Analytics.module.css";

function Analytics() {
  const token = useAuth();
  const navigate = useNavigate();

  const [openUpdateQuestion, setOpenUpdateQuestion] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [quizId, setQuizId] = useState("");
  const [quizType, setQuizType] = useState("");
  const [quizData, setQuizData] = useState([]);
  const [questionData, setQuestionData] = useState([]);
  const [allQuestionData, setAllQuestionData] = useState([]);

  const fetchAllQuiz = async () => {
    const data = await fetchQuizApi(token);
    if (data) setQuizData(data);
  };

  const shareQuiz = async (quizId, hasQsn) => {
    if (!hasQsn) {
      toast.error("Can't share an empty quiz.");
      return;
    }
    const link = `${window.location.origin}/share/${quizId}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard.");
    } catch (error) {
      handleApiErr(error, navigate);
    }
  };

  const deleteQuiz = async () => {
    const data = await deleteQuizApi(quizId, token);
    if (data) {
      fetchAllQuiz();
      setOpenDelete(false);
    }
  };

  const fetchQuestion = async (quizId, qsnId = 0) => {
    const data = await fetchQuestionApi(quizId, token, qsnId);
    setQuestionData(data);
  };

  const fetchAllQuestion = async (quizId) => {
    const data = await fetchQuestionApi(quizId, token);
    setAllQuestionData(data);
  };

  useEffect(() => {
    if (token) {
      fetchAllQuiz();
    }
  }, [token]);

  return (
    <div className={styles.analytics}>
      <Sidebar refreshData={fetchAllQuiz} />
      <div className={styles.info}>
        <h1>Quiz Analysis</h1>
        {quizData.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Quiz Name</th>
                <th>Created on</th>
                <th>Impression</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {quizData.map((data, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{data.quizName}</td>
                  <td>{moment(data.createdAt).format("DD MMM, YYYY")}</td>
                  <td>{data.quizHits}</td>
                  <td>
                    <img
                      src="/icons/square-pen.svg"
                      onClick={() => {
                        setOpenUpdateQuestion(true);
                        setQuizId(data._id);
                        setQuizType(data.quizType);
                        fetchQuestion(data._id);
                        fetchAllQuestion(data._id);
                      }}
                      alt="square-pen icon"
                    />
                    <img
                      src="/icons/trash.svg"
                      id={data._id}
                      onClick={() => {
                        setOpenDelete(true);
                        setQuizId(data._id);
                      }}
                      alt="trash icon"
                    />
                    <img
                      src="/icons/share.svg"
                      onClick={() => shareQuiz(data._id, data.quizData.length)}
                      alt="share icon"
                    />
                  </td>
                  <td>
                    <Link to={`/analytics/${data._id}`}>
                      Question Wise Analysis
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noData}>No quizzes available.</p>
        )}
      </div>
      <Modal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        center
        classNames={{ modal: "createQuizModal" }}
        showCloseIcon={false}
      >
        <div className="content deleteTestModal">
          <h1>Are you confirm you want to delete ?</h1>
          <div className="quizAction">
            <button className="btnDelete" onClick={deleteQuiz}>
              Confirm Delete
            </button>
            <button className="btnCancel" onClick={() => setOpenDelete(false)}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      <UpdateQuestion
        quizId={quizId}
        quizType={quizType}
        questionData={questionData}
        allQuestionData={allQuestionData}
        open={openUpdateQuestion}
        onClose={() => {
          setOpenUpdateQuestion(false);
          fetchAllQuiz();
        }}
      />
    </div>
  );
}

export default Analytics;
