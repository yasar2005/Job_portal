const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/resume", upload.single("file"), (req, res) => {
  const { file } = req;
  if (!file) return res.status(400).json({ message: "No file uploaded" });
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".pdf" && file.mimetype !== "application/pdf") {
    return res.status(400).json({ message: "Invalid format. Only PDF allowed." });
  }
  const base64 = file.buffer.toString("base64");
  const dataUrl = `data:application/pdf;base64,${base64}`;
  res.json({ message: "File uploaded successfully", url: dataUrl });
});

router.post("/profile", upload.single("file"), (req, res) => {
  const { file } = req;
  if (!file) return res.status(400).json({ message: "No file uploaded" });
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".jpg" && ext !== ".png") {
    return res.status(400).json({ message: "Invalid format. Only JPG/PNG allowed." });
  }
  const base64 = file.buffer.toString("base64");
  const mime = ext === ".png" ? "image/png" : "image/jpeg";
  const dataUrl = `data:${mime};base64,${base64}`;
  res.json({ message: "Profile image uploaded successfully", url: dataUrl });
});

module.exports = router;
