const express = require("express");
const { getQuestion } = require("../models/marketModel");
const router = express.Router();

// Endpoint to get question for a specific course or type/types
router.get("/get_question", async (req, res) => {
    try {
        const { question_types } = req.body; // Accept scan data from the frontend
        
        // Possibly parse the input from the frontend
        
        await getQuestion(question_types);
        res.status(201).json({success: true, message: "Data added successfully"});
    } catch (err) {
        res.status(500).json({success: false, message: "Error saving data"});
    }
});




module.exports = router;