const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const router = express.Router();

const upload = multer();

router.post("/resume", upload.single("file"), (req, res) => {
  const { file } = req;
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".pdf" && file.mimetype !== "application/pdf") {
    return res.status(400).json({ message: "Invalid format. Only PDF allowed." });
  }
  const filename = `${uuidv4()}.pdf`;
  fs.writeFile(`${__dirname}/../public/resume/${filename}`, file.buffer, (err) => {
    if (err) {
      return res.status(400).json({ message: "Error while uploading" });
    }
    res.json({
      message: "File uploaded successfully",
      url: `/host/resume/${filename}`,
    });
  });
});

router.post("/profile", upload.single("file"), (req, res) => {
  const { file } = req;
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".jpg" && ext !== ".png") {
    return res.status(400).json({ message: "Invalid format. Only JPG/PNG allowed." });
  }
  const filename = `${uuidv4()}${ext}`;
  fs.writeFile(`${__dirname}/../public/profile/${filename}`, file.buffer, (err) => {
    if (err) {
      return res.status(400).json({ message: "Error while uploading" });
    }
    res.json({
      message: "Profile image uploaded successfully",
      url: `/host/profile/${filename}`,
    });
  });
});

module.exports = router;
