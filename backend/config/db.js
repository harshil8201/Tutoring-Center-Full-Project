const mongoose = require("mongoose");

const dbConfig = () => {
  mongoose
    .connect("mongodb://localhost:27017/tutoring-center", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected to tutoring-center database"))
    .catch((err) => console.log(err));
};

module.exports = dbConfig;
