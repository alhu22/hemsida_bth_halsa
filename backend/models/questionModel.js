const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/question_data.db");

// Initialize the database and create the table
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS question_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT,
            variating_values TEXT, -- Store as JSON string
            course TEXT,
            question_type TEXT
        )
    `);
});

/**
 * Add a new question to the database.
 * @param {string} question - The question text.
 * @param {string} variatingValues - JSON string of variable values.
 * @param {string} course - Course name.
 * @param {string} questionType - Type of the question.
 * @returns {Promise<void>}
 */
const addQuestion = async (question, variatingValues, course, questionType) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO question_data (question, variating_values, course, question_type)
            VALUES (?, ?, ?, ?)
        `;

        db.run(query, [question, variatingValues, course, questionType], function (err) {
            if (err) return reject(err);
            resolve({ success: true, id: this.lastID });
        });
    });
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

    // Extract variable name, ranges, etc.
    const variableName = variatingValues[0];
    const weightRange = variatingValues[1]; // e.g., [50, 70]
    const dosageRange = variatingValues[2]; // e.g., [0.25, 1.5]

    // Pick random values within the ranges
    const randomWeight = getRandomValue(weightRange);
    const randomDosage = getRandomValue(dosageRange);

    // Replace placeholders in the question template
    formattedQuestion = formattedQuestion.replace("________", variableName);
    formattedQuestion = formattedQuestion.replace("___", randomWeight);

    // Compute the answer (weight * dosage)
    computedAnswer = (randomWeight * randomDosage).toFixed(2); // Keep two decimal places

    return { formattedQuestion, answer: computedAnswer };
};

/**
 * Get a random value between a given range.
 * @param {Array<number>} range - A two-element array [min, max].
 * @returns {number} A random value within the range.
 */
const getRandomValue = (range) => {
    const [min, max] = range;
    return (Math.random() * (max - min) + min).toFixed(2);
};

module.exports = { getRandomQuestion, addQuestion };
