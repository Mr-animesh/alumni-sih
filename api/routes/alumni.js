const express = require("express");
const { uploadResume, getAlumni, saveParsedResume, listUsers, parseResume, updateMe, toggleFollow} = require("../controllers/alumniController");
const multer = require("multer");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Multer setup (store files temporarily in uploads/)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Routes
router.post("/upload-resume/",authMiddleware, upload.single("resume"), uploadResume);
router.post("/parse-resume", upload.single("resume"), parseResume);
router.get("/:id", getAlumni);
router.post("/save-resume", authMiddleware, saveParsedResume)
router.get("/", authMiddleware, listUsers)
router.put("/me", authMiddleware, updateMe)
router.post("/:id/follow", authMiddleware, toggleFollow)

module.exports = router;
