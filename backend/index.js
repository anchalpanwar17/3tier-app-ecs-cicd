const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// RDS connection (via env vars from ECS or local)
const db = mysql.createConnection({
  host: process.env.DB_HOST,      // RDS endpoint
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306
});

// Connect to DB
db.connect(err => {
  if (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  }
  console.log("Connected to RDS");
});

// GET all tasks
app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// ADD a task
app.post("/tasks", (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).send("Title required");

  db.query(
    "INSERT INTO tasks (title) VALUES (?)",
    [title],
    err => {
      if (err) return res.status(500).json(err);
      res.send("Task added");
    }
  );
});

app.listen(5000, () =>
  console.log("Backend running on port 5000")
);
