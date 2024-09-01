const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/verifyToken');

const { createQuiz, fetchQuiz, addQuestion, fetchQuestion, updateQuestion, deleteQuiz, updateQuizResponse, countQuizHits } = require('../controllers/Quiz');

router.post('/quiz', verifyToken, fetchQuiz);
router.post('/quiz/create', verifyToken, createQuiz);
router.post('/quiz/question/:quizId', verifyToken, fetchQuestion);
router.post('/quiz/question/add/:quizId', verifyToken, addQuestion);
router.post('/quiz/question/update/:quizId/:qsnId', verifyToken, updateQuestion);
router.get('/quiz/delete/:quizId', verifyToken, deleteQuiz);

router.post('/quiz/share', fetchQuiz);
router.post('/quiz/share/response/:quizId/:qsnNo', updateQuizResponse);
router.get('/quiz/share/hits/:quizId', countQuizHits);

module.exports = router;