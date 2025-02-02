const express = require("express");
const { getRandomQuestion, addQuestion } = require("../models/questionModel");
const router = express.Router();

// Endpoint to get a question for a specific course or type/types
router.get("/get_question", async (req, res) => {
    try {
        const { course, question_types } = req.query; // Use query params instead of body
        
        if (!course || !question_types) {
            return res.status(400).json({ success: false, message: "Missing parameters" });
        }

        const question = await getRandomQuestion(course, question_types.split(","));
        
        if (!question) {
            return res.status(404).json({ success: false, message: "No question found" });
        }

        res.status(200).json({ success: true, data: question });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error retrieving data" });
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
