const express = require("express");
const router = express.Router();
const {
    addQuestion,
    addUnit,
    addCourse,
    addMedicine,
    addQuestionType
} = require("../models/questionModel"); 

/**
 * @route POST /question/add
 * @desc Adds a new question to the database
 */
router.post("/question/add", async (req, res) => {
    try {
        const { question, answer_formula, answer_unit_id, variating_values, course_code, question_type_id, hint_id } = req.body;
        
        if (!question || !answer_formula || !answer_unit_id || !variating_values || !course_code || !question_type_id || !hint_id) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        
        await addQuestion(question, answer_formula, answer_unit_id, variating_values, course_code, question_type_id, hint_id);
        res.status(201).json({ success: true, message: "Question successfully added" });
    } catch (err) {
        console.error("Error adding question:", err.message);
        res.status(500).json({ success: false, message: "Error adding question" });
    }
});

/**
 * @route POST /unit/add
 * @desc Adds a new unit
 */
router.post("/unit/add", async (req, res) => {
    try {
        const { ascii_name, accepted_answer } = req.body;
        
        if (!ascii_name || !accepted_answer) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        await addUnit(ascii_name, accepted_answer);
        res.status(201).json({ success: true, message: "Unit successfully added" });
    } catch (err) {
        console.error("Error adding unit:", err.message);
        res.status(500).json({ success: false, message: "Error adding unit" });
    }
});

/**
 * @route POST /course/add
 * @desc Adds a new course
 */
router.post("/course/add", async (req, res) => {
    try {
        const { course_code, course_name, question_types } = req.body;

        if (!course_code || !course_name || !question_types) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        await addCourse(course_code, course_name, question_types);
        res.status(201).json({ success: true, message: "Course successfully added" });
    } catch (err) {
        console.error("Error adding course:", err.message);
        res.status(500).json({ success: false, message: "Error adding course" });
    }
});

/**
 * @route POST /medicine/add
 * @desc Adds a new medicine entry
 */
router.post("/medicine/add", async (req, res) => {
    try {
        const { namn, fass_link, skyrkor_doser } = req.body;

        if (!namn || !fass_link || !skyrkor_doser) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        await addMedicine(namn, fass_link, skyrkor_doser);
        res.status(201).json({ success: true, message: "Medicine successfully added" });
    } catch (err) {
        console.error("Error adding medicine:", err.message);
        res.status(500).json({ success: false, message: "Error adding medicine" });
    }
});

/**
 * @route POST /qtype/add
 * @desc Adds a new question type
 */
router.post("/qtype/add", async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        await addQuestionType(name);
        res.status(201).json({ success: true, message: "Question type successfully added" });
    } catch (err) {
        console.error("Error adding question type:", err.message);
        res.status(500).json({ success: false, message: "Error adding question type" });
    }
});

module.exports = router;


// // 🔍 GET a random question with optional course and type filtering
// router.get("/random", async (req, res) => {
//     try {
//         const { course, question_type } = req.query;

//         let query = {};
//         if (course) query.course = course;
//         if (question_type) query.question_type = question_type;

//         const questionCount = await QuestionModel.countDocuments(query);
//         if (questionCount === 0) {
//             return res.status(404).json({ success: false, message: "No questions found." });
//         }

//         const randomIndex = Math.floor(Math.random() * questionCount);
//         const question = await QuestionModel.findOne(query).skip(randomIndex).lean();

//         if (!question) {
//             return res.status(404).json({ success: false, message: "No questions found." });
//         }

//         res.json({ success: true, question });
//     } catch (error) {
//         console.error("Error fetching random question:", error);
//         res.status(500).json({ success: false, message: "Internal server error." });
//     }
// });