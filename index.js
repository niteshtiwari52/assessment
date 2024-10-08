const express = require("express");
const dotenv = require("dotenv");
const DbConnection = require("./databaseConnection");

const ContactRouter = require("./routes/contact");

dotenv.config();
const app = express();
const port = 5000;

app.use(express.json());
DbConnection();

app.get("/", (req, res) => {
  res.status(200).json({
    message: "WELCOME TO THE  TEST",
  });
});

app.use("/contact", ContactRouter);

app.all("/", (req, res) => {
  res.status(500).json({
    message: "PAge not found",
  });
});
app.get("*", (req, res) => {
  res.status(500).json({
    message: "This Route Not Exsist .",
  });
});

app.listen(port, () => {
  // console.log(process.env.MONGO_URI);
  console.log(`Server is Running on  http://localhost:${port}`);
});
