const User = require("../models/User");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const axios = require("axios");

const wait = ms => new Promise(res => setTimeout(res, ms));

// Helper to split text into chunks (max ~1000 tokens for safety)
function chunkText(text, chunkSize = 1000) {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }
  return chunks;
}

exports.uploadResume = async (req, res) => {
  try {
    const userId = req.user.id; //right
    const filePath = req.file.path;

    // Step 1: Extract text from PDF
    const dataBuffer = fs.readFileSync(filePath);
    const resumeText = await pdfParse(dataBuffer);

    const textChunks = chunkText(resumeText.text, 1000);

    let parsedData = {};


   // Step 2: Send each chunk to OpenAI with retry and force JSON-only output when possible
    for (const chunk of textChunks) {
      let aiResponse;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          aiResponse = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
              model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content: "You are a strict JSON extractor. Output ONLY a single valid JSON object with keys: name (string), email (string), phone (string), education (array of strings), skills (array of strings), experience (array of strings), currentJob (string). No explanations, no code fences."
                },
                { role: "user", content: chunk }
              ],
              temperature: 0,
              // Newer models support response_format; ignore if unsupported
              response_format: { type: "json_object" }
            },
            { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
          );
          break; // success
        } catch (err) {
          if (err.response?.status === 429) {
            console.log(`Rate limit hit, retrying in ${2 ** attempt} seconds...`);
            await wait(2000 * (attempt + 1));
          } else {
            throw err;
          }
        }
      }

      if (!aiResponse) continue; // skip if failed

      // Merge parsed JSON
      try {
        let content = aiResponse.data.choices?.[0]?.message?.content || "{}";
        // If model ignored json_object, try to extract JSON between braces
        const firstBrace = content.indexOf("{");
        const lastBrace = content.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1) {
          content = content.slice(firstBrace, lastBrace + 1);
        }
        const chunkData = JSON.parse(content);
        // Normalize shapes to expected types
        const normalizeToArray = (v) => Array.isArray(v) ? v : (typeof v === "string" && v.trim() ? v.split(/\n+|,\s*/).map(s => s.trim()).filter(Boolean) : []);
        const normalized = {
          name: chunkData.name || chunkData.Name || "",
          email: chunkData.email || chunkData.Email || "",
          phone: chunkData.phone || chunkData.Phone || "",
          education: normalizeToArray(chunkData.education || chunkData.Education),
          skills: normalizeToArray(chunkData.skills || chunkData.Skills),
          experience: normalizeToArray(chunkData.experience || chunkData.Experience),
          currentJob: chunkData.currentJob || chunkData.CurrentJob || "",
        };
        parsedData = { ...parsedData, ...normalized };
      } catch (err) {
        console.log("Failed parsing AI chunk, skipping:", err.message);
      }
    }
    
    // Step 3: Update user in DB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...parsedData,
        resumeURL: filePath
      },
      { new: true }
    );

    res.json({ success: true, parsed: parsedData, user: updatedUser });
  } catch (error) {
    console.error("Upload error:", error.message);
    res.status(500).json({ success: false, msg: "Server error during alumniController", error: error.message });
  }
};

// Parse resume without auth/save (for pre-registration)
exports.parseResume = async (req, res) => {
  try {
    if (!req.file) {
      console.log("parseResume: no file received");
      return res.status(400).json({ success: false, msg: "No file uploaded" });
    }
    console.log("parseResume: received file", req.file?.originalname, req.file?.mimetype, req.file?.size);
    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const resumeText = await pdfParse(dataBuffer);
    const textChunks = chunkText(resumeText.text, 1000);

    let parsedData = {};

    for (const chunk of textChunks) {
      let aiResponse;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          aiResponse = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
              model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content: "You are a strict JSON extractor. Output ONLY a single valid JSON object with keys: name (string), email (string), phone (string), education (array of strings), skills (array of strings), experience (array of strings), currentJob (string). No explanations, no code fences."
                },
                { role: "user", content: chunk }
              ],
              temperature: 0,
              response_format: { type: "json_object" }
            },
            { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
          );
          break;
        } catch (err) {
          if (err.response?.status === 429) {
            await wait(2000 * (attempt + 1));
          } else {
            throw err;
          }
        }
      }

      if (!aiResponse) continue;

      try {
        let content = aiResponse.data.choices?.[0]?.message?.content || "{}";
        const firstBrace = content.indexOf("{");
        const lastBrace = content.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1) {
          content = content.slice(firstBrace, lastBrace + 1);
        }
        const chunkData = JSON.parse(content);
        const normalizeToArray = (v) => Array.isArray(v) ? v : (typeof v === "string" && v.trim() ? v.split(/\n+|,\s*/).map(s => s.trim()).filter(Boolean) : []);
        const normalized = {
          name: chunkData.name || chunkData.Name || "",
          email: chunkData.email || chunkData.Email || "",
          phone: chunkData.phone || chunkData.Phone || "",
          education: normalizeToArray(chunkData.education || chunkData.Education),
          skills: normalizeToArray(chunkData.skills || chunkData.Skills),
          experience: normalizeToArray(chunkData.experience || chunkData.Experience),
          currentJob: chunkData.currentJob || chunkData.CurrentJob || "",
        };
        parsedData = { ...parsedData, ...normalized };
      } catch (err) {
      }
    }

    const hasAny = (
      (parsedData.name && parsedData.name.trim()) ||
      (parsedData.email && parsedData.email.trim()) ||
      (parsedData.currentJob && parsedData.currentJob.trim()) ||
      (Array.isArray(parsedData.education) && parsedData.education.length > 0) ||
      (Array.isArray(parsedData.skills) && parsedData.skills.length > 0) ||
      (Array.isArray(parsedData.experience) && parsedData.experience.length > 0)
    );
    console.log("parseResume: parsed fields", Object.keys(parsedData), "hasAny=", !!hasAny);
    if (!hasAny) {
      return res.status(200).json({ success: false, msg: "No recognizable details found in resume.", parsed: parsedData });
    }
    res.json({ success: true, parsed: parsedData });
  } catch (error) {
    console.error("parseResume error:", error);
    res.status(500).json({ success: false, msg: "Server error during parseResume", error: error.message });
  }
};

exports.saveParsedResume = async (req, res) => {
  try {
    const userId = req.user.id; // assuming auth middleware sets req.user
    const { parsed } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          name: parsed.Name,
          email: parsed.Email,
          phone: parsed.Phone,
          education: parsed.Education,
          skills: parsed.Skills,
          experience: parsed.Experience,
        },
      },
      { new: true }
    );

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error saving resume data" });
  }
};

// Simple alumni profile fetch
exports.getAlumni = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "Alumni not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update current user's profile (phone, address, description, plus optional fields)
exports.updateMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const allowed = [
      "name", "phone", "address", "description",
      "currentJob", "skills", "education", "experience"
    ];
    const update = {};
    for (const key of allowed) {
      if (key in req.body) update[key] = req.body[key];
    }
    const updated = await User.findByIdAndUpdate(userId, update, { new: true });
    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

// List users (basic directory) - exclude password
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email role currentJob skills education followers following");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Follow / Unfollow toggle
exports.toggleFollow = async (req, res) => {
  try {
    const me = req.user.id;
    const target = req.params.id;
    if (me === target) return res.status(400).json({ success: false, msg: "Cannot follow yourself" });
    const meUser = await User.findById(me);
    const targetUser = await User.findById(target);
    if (!targetUser) return res.status(404).json({ success: false, msg: "User not found" });

    const isFollowing = meUser.following?.some(u => String(u) === String(target));
    if (isFollowing) {
      meUser.following = meUser.following.filter(u => String(u) !== String(target));
      targetUser.followers = targetUser.followers.filter(u => String(u) !== String(me));
    } else {
      meUser.following = [...(meUser.following || []), targetUser._id];
      targetUser.followers = [...(targetUser.followers || []), meUser._id];
    }
    await meUser.save();
    await targetUser.save();
    res.json({ success: true, following: !isFollowing });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};
