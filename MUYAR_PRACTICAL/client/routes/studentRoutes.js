const express = require("express");
const Studyante = require("../models/Student");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const studyante = await Studyante.create(req,body);
        res.status(201).json(studyante);
    } catch (error) {
        res.status(400).json({ message: error.message});
    }
});

router.get("/", async (req, res) => {
    try {
        const studyantes = await Studyante.find().sort({ createdAt: -1});
        res.json(studyantes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
      const studyante = await Studyante.findById(req.params.id);
  
      if (!studyante) {
        return res.status(404).json({
          message: "Student not found",
        });
      }
  
      res.json(studyante);
    } catch (error) {
      res.status(400).json({ message: "Invalid Student ID" });
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const studyante = await Studyante.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
  
      if (!studyante) {
        return res.status(404).json({
          message: "Student not found",
        });
      }
  
      res.json(studyante);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const studyante = await Studyante.findByIdAndDelete(req.params.id);
  
      if (!studyante) {
        return res.status(404).json({
          message: "Student not found",
        });
      }
  
      res.json({
        message: "Student Info deleted successfully",
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid Student ID" });
    }
  });