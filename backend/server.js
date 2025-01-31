const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const questionsRoutes = require("./routes/questionsRoutes");



const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/api/question", questionsRoutes);

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));