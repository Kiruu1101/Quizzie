const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.ObjectId,
        },
        quizName: {
            type: String,
            required: true,
        },
        quizType: {
            type: Number,
            required: true,
        },
        quizData: {
            type: Array,
        },
        quizHits: {
            type: Number,
            required: true,
            default: 0
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Quiz', quizSchema);