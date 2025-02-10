"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const {insert_unit, read_unit } = require("../models/questionModel");
const e = require("express");


router.get("/addquestion", (req, res) => {
    res.render("addQuestion.ejs"); // This will render views/index.ejs
});
router.post("/addquestion", (req, res) => {
    const { question, course, customCourse, question_type, variating_values } = req.body;
    if(customCourse){
        // new course added
        console.log("Received data:", question, customCourse, question_type, variating_values);
    }else{
        console.log("Received data:", question, course, question_type, variating_values);
    }

    res.render("home.ejs");
});
router.get("/", (req, res) => {
    res.render("log.ejs"); // This will render views/index.ejs
});

router.get("/home", (req, res) => {
    res.render("home.ejs"); // This will render views/index.ejs
});
router.post("/home", (req, res) => {
    const { username, password } = req.body;
    console.log("Received data:", username, password);
    // render home
    res.render("home.ejs");
});

router.get("/taketest", (req, res) => {
    let count = req.query.count || 0;  // Get count from URL or default to 0
    res.render("takeTest.ejs", {question: "What is 6 divided by two?", correctAnswer: "3", hint:"halv of 6", count:count}); // This will render views/index.ejs
});

router.get("/Next", (req, res) => {
    let count = req.query.count || 0;  // Get count from URL or default to 0
    res.render("takeTest.ejs", {question: "What is 6 divided by two?", correctAnswer: "3", hint:"halv of 6", count:count}); // This will render views/index.ejs
});
router.post("/Next", (req, res) => {
    const { count } = req.body;
    // convert count to int
    let countInt = parseInt(count);
    if(countInt >=3){
        res.render("home.ejs");
    }else{
        countInt++;
        res.render("takeTest.ejs", {question: "What is 6 divided by two?", correctAnswer: "3", hint:"halv of 6", count:countInt}); // This will render views/index.ejs
    }
});

router.get("/add-questionnew", async (req, res) => {
    let units;
    try {
        units = await read_unit();
    } catch (error) {
        console.error("Error fetching units:", error);
        res.status(500).json({ success: false, message: "Error fetching units" });
    }
    res.render("newaddquestion.ejs", {
        isSuccess: false,
        responseMessage: "",
        isUploading: false,
        units: units
    }); // This will render views/index.ejs
});

router.post("/addQ", urlencodedParser, async (req, res) => {
    const {question, answerFormula,answerUnit,variating_values,course,question_type } = req.body;
    if(answerUnit[1] === ""){
        insert_unit(answerUnit[0]);
    }else{
        insert_unit(answerUnit[1]);
    }
    res.render("home.ejs");
}
);

module.exports = router;