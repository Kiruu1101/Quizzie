const Quiz = require('../models/Quiz');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const validateQuizData = async (quizId) => {
    if (!ObjectId.isValid(quizId)) {
        throw Object.assign(Error("This is not a valid quiz, please check your URL"), { code: 400 });
    }

    const quizData = await Quiz.findById(quizId);
    if (!quizData) {
        throw Object.assign(Error("This is not a valid quiz, please check your URL."), { code: 404 });
    }

    return quizData;
};

const fetchQuiz = async (req, res, next) => {
    const { quizId } = req.body;
    try {
        const data = quizId ? await validateQuizData(quizId) : await Quiz.find({ userId: req.user });
        res.status(200).json({ status: "success", data: data });
    } catch (err) {
        next(err);
    }
};

const createQuiz = async (req, res, next) => {
    try {
        const userId = req.user;
        const { quizName, quizType } = req.body;

        if (!quizName) throw Object.assign(Error("Please enter quiz name."), { code: 400 });
        if (!quizType) throw Object.assign(Error("Please choose the quiz type."), { code: 400 });

        const data = await Quiz.create({ userId, quizName, quizType });
        res.status(200).json({ status: "success", msg: "Quiz created successfully.", quizId: data._id });
    } catch (err) {
        next(err);
    }
};

const fetchQuestion = async (req, res, next) => {
    const { quizId } = req.params;
    const { qsnId } = req.body;
    try {
        const data = await validateQuizData(quizId);
        res.status(200).json({ status: "success", data: typeof qsnId !== 'undefined' ? data.quizData[qsnId] : data.quizData });
    } catch (err) {
        next(err);
    }
};

const addQuestion = async (req, res, next) => {
    const { quizId } = req.params;
    const quizData = req.body;
    try {
        const data = await validateQuizData(quizId);
        const questionsToAdd = Array.isArray(quizData) ? quizData : [quizData];

        if (data.quizData.length + questionsToAdd.length <= 5) {
            questionsToAdd.forEach((question) => {
                data.quizData.push(question);
            });

            await data.save();
            res.status(200).json({ status: "success", msg: "Question(s) added successfully." });
        } else {
            throw Object.assign(new Error("Cannot add more than 5 questions."), { code: 400 });
        }
    } catch (err) {
        next(err);
    }
};

const updateQuestion = async (req, res, next) => {
    const { quizId, qsnId } = req.params;
    const { type, quizData } = req.body;
    try {
        const data = await validateQuizData(quizId);

        if (!(qsnId in data.quizData))
            throw Object.assign(Error("This question does not exist"), { code: 400 });

        if (type === "update") {
            const existingQuestion = data.quizData[qsnId];
            const excludedKeys = ['isAttempted', 'isCorrect'];
            for (const key in quizData) {
                if (quizData.hasOwnProperty(key) && !excludedKeys.includes(key)) {
                    existingQuestion[key] = quizData[key];
                }
            }
            data.quizData[qsnId] = existingQuestion;
        } else if (type === "delete") {
            data.quizData.splice(qsnId, 1);
        }

        await Quiz.findByIdAndUpdate(quizId, { quizData: data.quizData });
        res.status(200).json({ status: "success", msg: "Question " + type + "d successfully." });
    } catch (err) {
        next(err);
    }
};

const deleteQuiz = async (req, res, next) => {
    const { quizId } = req.params;
    try {
        await validateQuizData(quizId);
        await Quiz.findByIdAndDelete(quizId);
        res.status(200).json({ status: "success", msg: "Quiz deleted successfully." });
    } catch (err) {
        next(err);
    }
};

const updateQuizResponse = async (req, res, next) => {
    const { quizId, qsnNo } = req.params;
    const { type, optNo } = req.body;
    try {
        const data = await validateQuizData(quizId);

        if (!(qsnNo in data.quizData))
            throw Object.assign(Error("This question does not exist"), { code: 400 });

        if (type == "isAttempted")
            data.quizData[qsnNo].isAttempted += 1;
        else if (type == "isCorrect")
            data.quizData[qsnNo].isCorrect += 1;
        else if (type == "pollResponse") {
            if (optNo != null) data.quizData[qsnNo].options[optNo].value.response += 1;
        }
        await Quiz.findByIdAndUpdate(quizId, { quizData: data.quizData });

        res.status(200).json({ status: "success", msg: "" });
    } catch (err) {
        next(err);
    }
};

const countQuizHits = async (req, res, next) => {
    const { quizId } = req.params;
    try {
        const data = await validateQuizData(quizId);
        await Quiz.findByIdAndUpdate(quizId, { quizHits: data.quizHits + 1 });
        res.status(200).json({ status: "success" });
    } catch (err) {
        next(err);
    }
};

module.exports = { createQuiz, fetchQuiz, addQuestion, fetchQuestion, updateQuestion, deleteQuiz, updateQuizResponse, countQuizHits };