const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb+srv://gabrielmuyar_db_user:rii63VOMjJQSMWrJ@cluster0.8s0oabv.mongodb.net/?appName=Cluster0")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("MongoDB connection error:", error));

// Root route
app.get("/", (req, res) => {
  res.send("Server is Running!");
});

// GET /students - Read all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /students - Create a student
app.post("/students", async (req, res) => {
  try {
    const { name, course, age } = req.body;
    const newStudent = new Student({ name, course, age });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /students/:id - Update a student
app.put("/students/:id", async (req, res) => {
  try {
    const { name, course, age } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name, course, age },
      { new: true, runValidators: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /students/:id - Delete a student
app.delete("/students/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid Student ID" });
  }
});

module.exports = app;

if (process.env.NODE_ENV !== "production") {
  app.listen(5000, () => console.log("Server running on port 5000"));
}