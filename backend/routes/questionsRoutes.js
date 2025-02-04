const express = require("express");
const router = express.Router();
const QuestionModel = require("../models/questionModel"); 

// 🔍 GET a random question with optional course and type filtering
router.get("/random", async (req, res) => {
    try {
        const { course, question_type } = req.query;

        let query = {};
        if (course) query.course = course;
        if (question_type) query.question_type = question_type;

        const questionCount = await QuestionModel.countDocuments(query);
        if (questionCount === 0) {
            return res.status(404).json({ success: false, message: "No questions found." });
        }

        const randomIndex = Math.floor(Math.random() * questionCount);
        const question = await QuestionModel.findOne(query).skip(randomIndex).lean();

        if (!question) {
            return res.status(404).json({ success: false, message: "No questions found." });
        }

        res.json({ success: true, question });
    } catch (error) {
        console.error("Error fetching random question:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});

// Endpoint to add a new question
router.post("/add", async (req, res) => {
    try {
        const { question, course, question_type, variating_values } = req.body;
        
        if (!question || !course || !question_type || !variating_values) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        await addQuestion(question, course, question_type, variating_values);
        res.status(201).json({ success: true, message: "Question successfully added"});
    } catch (err) {
        console.error("Error saving question:", err.message);
        res.status(500).json({ success: false, message: "Error saving question"});
    }
});
module.exports = router;
