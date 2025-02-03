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
            anser_unit TEXT, -- Store as string "kg"
            answer_formula TEXT, -- Store as string "var_name + var_name2"
            variating_values TEXT, -- Store as JSON string "{"var_name": [50,70], "var_name2": [10,20]}"
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
 * Fetch a random question matching course and question type.
 * @param {string} course - The selected course.
 * @param {string[]} questionTypes - An array of possible question types.
 * @returns {Promise<{question: string, answer: number}>} The formatted question and correct answer.
 */
const getRandomQuestion = async (course, questionTypes) => {
    return new Promise((resolve, reject) => {
        const placeholders = questionTypes.map(() => "?").join(",");
        const query = `
            SELECT * FROM question_data 
            WHERE course = ? 
            AND question_type IN (${placeholders}) 
            ORDER BY RANDOM() 
            LIMIT 1
        `;

        db.get(query, [course, ...questionTypes], (err, row) => {
            if (err) return reject(err);
            if (!row) return resolve(null);

            try {
                const variatingValues = JSON.parse(row.variating_values);
                const { formattedQuestion, answer } = generateQuestion(row.question, variatingValues);
                resolve({ question: formattedQuestion, answer });
            } catch (error) {
                reject("Error parsing variating values.");
            }
        });
    });
};

/**
 * Generate a formatted question and correct answer.
 * @param {string} questionTemplate - The question template with placeholders.
 * @param {Array} variatingValues - A list containing variables to replace in the question.
 * @returns {Object} An object with formattedQuestion and the computed answer.
 */
const generateQuestion = (questionTemplate, variatingValues) => {
    let formattedQuestion = questionTemplate;
    let computedAnswer = null;


    return { formattedQuestion, answer: computedAnswer };
};


module.exports = { getRandomQuestion, addQuestion };
