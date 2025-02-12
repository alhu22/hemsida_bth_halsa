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


// -------------------------- Help Functions -----------------------------

/**
 * Handles database insert errors and returns appropriate messages.
 * @param {Error} err - The SQLite error object.
 * @returns {Object} - An error message and status code.
 */
const handleInsertError = (err) => {
    if (!err) return null;
    if (err.message.includes("FOREIGN KEY constraint failed")) {
        return { message: "Foreign key constraint failed. Check that referenced data exists.", status: 400 };
    }
    if (err.message.includes("UNIQUE constraint failed")) {
        return { message: "Duplicate entry. This record already exists.", status: 409 };
    }
    return { message: "Database error occurred.", status: 500 };
};


// -------------------------- Initialize Database -----------------------------
db.serialize(() => {
    db.run("PRAGMA foreign_keys = ON;");

    db.run(`
        CREATE TABLE IF NOT EXISTS units (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ascii_name TEXT NOT NULL UNIQUE,
            accepted_answer TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS course (
            course_code TEXT PRIMARY KEY NOT NULL UNIQUE,
            course_name TEXT NOT NULL,
            question_types TEXT -- List of qtype(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS medicine (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            namn TEXT UNIQUE NOT NULL,
            fass_link TEXT NOT NULL,
            skyrkor_doser TEXT CHECK(json_valid(skyrkor_doser))
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS qtype (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            right_answers INTEGER DEFAULT 0,  -- Counter for the day 
            wrong_answers INTEGER DEFAULT 0,  -- Counter for the day 
            history_json TEXT CHECK(json_valid(history_json))
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS question_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            answer_unit_id INTEGER NOT NULL,
            answer_formula TEXT NOT NULL,
            variating_values TEXT NOT NULL,
            course_code TEXT NOT NULL,
            question_type_id INTEGER NOT NULL,
            hint_id INTEGER NOT NULL,
            wrong_answer INTEGER DEFAULT 0,
            right_answer INTEGER DEFAULT 0,
            FOREIGN KEY (hint_id) REFERENCES hints(id),
            FOREIGN KEY (course_code) REFERENCES course(course_code),
            FOREIGN KEY (question_type_id) REFERENCES qtype(id),
            FOREIGN KEY (answer_unit_id) REFERENCES units(id)
        )
    `);

    // Create indexes if the table gets large (thousands of entries)
    // db.run("CREATE INDEX idx_course_code ON question_data(course_code);");
    // db.run("CREATE INDEX idx_question_type ON question_data(question_type_id);");
});


// -------------------------- Insert Functions -----------------------------

/**
 * Adds a new question to the database.
 * @param {string} question - The question text.
 * @param {string} answerFormula - The mathematical formula for the answer.
 * @param {number} answerUnitId - The unit ID corresponding to the answer.
 * @param {Object} variatingValues - JSON object of variable values.
 * @param {string} courseCode - The course code the question belongs to.
 * @param {number} questionTypeId - The type ID of the question.
 * @param {number} hintId - The ID of the associated hint.
 * @returns {Promise<void>}
 */
const addQuestion = async (question, answerFormula, answerUnitId, variatingValues, courseCode, questionTypeId, hintId) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO question_data (question, answer_formula, answer_unit_id, variating_values, course_code, question_type_id, hint_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [question.trim(), answerFormula.trim(), answerUnitId, JSON.stringify(variatingValues), courseCode.trim(), questionTypeId, hintId],
            function (err) {
                const error = handleInsertError(err);
                if (error) return reject(error);
                resolve();
            }
        );
    });
};

/**
 * Adds a new unit to the database.
 * @param {string} asciiName - The ASCII name of the unit.
 * @param {string} acceptedAnswer - The accepted answer format.
 * @returns {Promise<void>}
 */
const addUnit = async (asciiName, acceptedAnswer) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO units (ascii_name, accepted_answer) VALUES (?, ?)`,
            [asciiName.trim(), acceptedAnswer.trim()],
            function (err) {
                const error = handleInsertError(err);
                if (error) return reject(error);
                resolve();
            }
        );
    });
};

/**
 * Adds a new course to the database.
 * @param {string} courseCode - Unique identifier for the course.
 * @param {string} courseName - The full name of the course.
 * @param {Array<number>} questionTypes - List of question type IDs.
 * @returns {Promise<void>}
 */
const addCourse = async (courseCode, courseName, questionTypes) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO course (course_code, course_name, question_types) VALUES (?, ?, ?)`,
            [courseCode.trim(), courseName.trim(), JSON.stringify(questionTypes)],
            function (err) {
                const error = handleInsertError(err);
                if (error) return reject(error);
                resolve();
            }
        );
    });
};

/**
 * Adds a new medicine entry to the database.
 * @param {string} namn - Name of the medicine.
 * @param {string} fassLink - Link to official documentation.
 * @param {Object} skyrkorDoser - JSON object containing dosage information.
 * @returns {Promise<void>}
 */
const addMedicine = async (namn, fassLink, skyrkorDoser) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO medicine (namn, fass_link, skyrkor_doser) VALUES (?, ?, ?)`,
            [namn.trim(), fassLink.trim(), JSON.stringify(skyrkorDoser)],
            function (err) {
                const error = handleInsertError(err);
                if (error) return reject(error);
                resolve();
            }
        );
    });
};

/**
 * Adds a new question type to the database.
 * @param {string} name - The name of the question type.
 * @returns {Promise<void>}
 */
const addQuestionType = async (name) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO qtype (name) VALUES (?)`,
            [name.trim()],
            function (err) {
                const error = handleInsertError(err);
                if (error) return reject(error);
                resolve();
            }
        );
    });
};

// ----------------------------- Export Functions -----------------------------

module.exports = {
    addQuestion,
    addUnit,
    addCourse,
    addMedicine,
    addQuestionType
};


// ----------------------------- Get Functions -----------------------------

// /**
//  * Generate a formatted question and correct answer.
//  * @param {string} questionTemplate - The question template with placeholders.
//  * @param {Object} variatingValues - An object containing variables with possible values.
//  * @param {string} answerFormula - A string formula that calculates the answer.
//  * @returns {Object} An object with formattedQuestion and the computed answer.
//  */
// const generateQuestion = (questionTemplate, variatingValues, answerFormula) => {
//     let formattedQuestion = questionTemplate;
//     let computedAnswer = null;
//     let selectedValues = {}; // Store the randomly selected values

//     // Replace variables in the question template
//     for (const [variable, values] of Object.entries(variatingValues)) {
//         if (Array.isArray(values) && values.length > 0) {
//             const randomValue = values[Math.floor(Math.random() * values.length)]; // Select random value
//             selectedValues[variable] = randomValue;
//             formattedQuestion = formattedQuestion.replaceAll(`%%${variable}%%`, randomValue);
//         }
//     }

//     // Compute the answer by replacing variables in the answer formula and evaluating it
//     try {
//         const formulaWithValues = answerFormula.replace(/var_\d+/g, match => selectedValues[match] || 0);
//         computedAnswer = eval(formulaWithValues); // Using eval (ensure input is validated in real use cases)
//     } catch (error) {
//         console.error("Error evaluating answer formula:", error);
//     }

//     return { formattedQuestion, answer: computedAnswer };
// };



