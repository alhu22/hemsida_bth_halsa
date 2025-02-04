const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.resolve(__dirname, "../db/question_data.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("Failed to connect to the database:", err.message);
    } else {
      console.log("Connected to the SQLite database.");
    }
});


// Initialize the database and create the table
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS question_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT, -- Store as string "Question %%var_name%%kg rest of question %%var_name2%%?"
            answer_unit TEXT, -- Store as string "kg"
            answer_formula TEXT, -- Store as string "var_name + var_name2"
            variating_values TEXT, -- Store as JSON string "{"var_name": [50, 70], "var_name2": [10, 20]}"
            course TEXT,
            question_type TEXT
        )
    `);
});

/**
 * Add a new question to the database.
 * @param {string} question - The question text.
 * @param {string} variatingValues - JSON string of variable values.
 * @param {string} answerFomula - String of variables and expretions.
 * @param {string} answerUnit - String of what the unit should be.
 * @param {string} course - Course name.
 * @param {string} questionType - Type of the question.
 * @returns {Promise<void>}
 */
const addQuestion = async (question, answerFomula, answerUnit, variatingValues, course, questionType) => {
    db.run('INSERT INTO question_data (question, answer_fomula, answer_unit, variating_values, course, question_type) VALUES (?, ?, ?, ?)', 
            [question.trim(), answerFomula.trim(), answerUnit.trim(), variatingValues.trim(), course.trim(), questionType.trim()]);
    
};

/**
 * Generate a formatted question and correct answer.
 * @param {string} questionTemplate - The question template with placeholders.
 * @param {Object} variatingValues - An object containing variables with possible values.
 * @param {string} answerFormula - A string formula that calculates the answer.
 * @returns {Object} An object with formattedQuestion and the computed answer.
 */
const generateQuestion = (questionTemplate, variatingValues, answerFormula) => {
    let formattedQuestion = questionTemplate;
    let computedAnswer = null;
    let selectedValues = {}; // Store the randomly selected values

    // Replace variables in the question template
    for (const [variable, values] of Object.entries(variatingValues)) {
        if (Array.isArray(values) && values.length > 0) {
            const randomValue = values[Math.floor(Math.random() * values.length)]; // Select random value
            selectedValues[variable] = randomValue;
            formattedQuestion = formattedQuestion.replaceAll(`%%${variable}%%`, randomValue);
        }
    }

    // Compute the answer by replacing variables in the answer formula and evaluating it
    try {
        const formulaWithValues = answerFormula.replace(/var_\d+/g, match => selectedValues[match] || 0);
        computedAnswer = eval(formulaWithValues); // Using eval (ensure input is validated in real use cases)
    } catch (error) {
        console.error("Error evaluating answer formula:", error);
    }

    return { formattedQuestion, answer: computedAnswer };
};



module.exports = { generateQuestion, addQuestion };
