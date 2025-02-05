
const express = require("express");
const axios = require("axios");
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

        // Send the data to an external service if needed
        const response = await axios.post("http://localhost:5000/api/question/add", {
            question,
            course,
            question_type,
            variating_values,
        });

        if (response.data.success) {
            return res.status(201).json({ success: true, message: "Question added successfully" });
        } else {
            return res.status(500).json({ success: false, message: "Failed to add question" });
        }
    } catch (error) {
        console.error("Error adding question:", error);
        res.status(500).json({ success: false, message: "Error saving data" });
    }
});

module.exports = router;
