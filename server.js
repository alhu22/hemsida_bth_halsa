const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("./routes/router.js");
const questionsRoutes = require("./routes/questionsRoutes.js");
const path = require("path");  // dout usage
const { render } = require("ejs"); // dout usage

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // For URL-encoded data
app.use(questionsRoutes);
app.use(router);
app.use(express.static("public")); // Serve static files (CSS, JS, etc.)
app.set("view engine", "ejs"); // Set EJS as the view engine
app.set("views", path.join(__dirname, "views")); // Set the folder for EJS templates

// Render a page using EJS


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
