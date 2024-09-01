import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import ViewAnalytics from "./pages/ViewAnalytics";
import Share from "./pages/Share";
import Result from "./pages/Result";

import "react-responsive-modal/styles.css";
import "./assets/modal/CreateQuiz.css";
import "./assets/modal/CreateQuestion.css";

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/analytics/:quizId" element={<ViewAnalytics />} />
        <Route path="/share/:quizId" element={<Share />} />
        <Route path="/result/:quizType" element={<Result />} />
      </Routes>
    </Router>
  );
}

export default App;
