/* 
to start mongo db server, 
run this command in mac: 

sudo mongod --dbpath=/Users/harshilpatel/data/db

then run this commands in Backend folder terminal to downlaod node_modules package.

npm install
npm start

*/

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const courseRoutes = require("./routes/courseRoutes");
const userRoutes = require("./routes/userRoutes");
const dbConfig = require("./config/db");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Set EJS as view engine
app.set("view engine", "ejs");

// Connect to MongoDB
dbConfig();

// Routes
app.use("/api/courses", courseRoutes); // Course routes
app.use("/api/user", userRoutes); // User routes (cart management, etc.)

// Server Setup
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT}\ncheck course at: http://localhost:${PORT}/api/courses`
  );
});
