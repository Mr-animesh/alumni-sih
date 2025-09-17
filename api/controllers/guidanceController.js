const axios = require("axios");
const User = require("../models/User");

const FALLBACK_ADVICE = (
  "Here is a general roadmap you can adapt:\n\n" +
  "1) Clarify your goal: pick a role (e.g., Frontend, Backend, Data).\n" +
  "2) Build fundamentals: data structures, algorithms, Git, HTTP, SQL.\n" +
  "3) Skills stack: choose one primary stack and ship 2–3 projects.\n" +
  "4) Portfolio: concise README, live links, screenshots, metrics.\n" +
  "5) Resume: impact bullets (action + result with numbers).\n" +
  "6) Network: alumni outreach weekly; ask for informational interviews.\n" +
  "7) Interview prep: 4–6 weeks on DS&A + system/design basics.\n" +
  "8) Apply: 5–10 relevant roles/week; tailor resume to JD keywords.\n" +
  "9) Iterate: review rejections, refine projects and narrative.\n"
);

exports.getGuidance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    const {
      education: inputEducation,
      skills: inputSkills,
      interests: inputInterests,
      goal: inputGoal,
    } = req.body || {};

    const education = Array.isArray(inputEducation) ? inputEducation : (typeof inputEducation === "string" ? inputEducation.split(/\n+/).map(s => s.trim()).filter(Boolean) : (user?.education || []));
    const skills = Array.isArray(inputSkills) ? inputSkills : (typeof inputSkills === "string" ? inputSkills.split(/,\s*/).map(s => s.trim()).filter(Boolean) : (user?.skills || []));
    const interests = Array.isArray(inputInterests) ? inputInterests : (typeof inputInterests === "string" ? inputInterests.split(/,\s*/).map(s => s.trim()).filter(Boolean) : []);
    const goal = inputGoal || user?.currentJob || "";

    const missing = [];
    if (!education || education.length === 0) missing.push("education");
    if (!skills || skills.length === 0) missing.push("skills");
    if (!goal) missing.push("goal");

    const model = process.env.OPENAI_MODEL || "gpt-3.5-turbo";
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.json({ success: true, source: "fallback", missing, advice: FALLBACK_ADVICE });
    }

    const prompt = `You are a career coach. Based on the user's background, provide: (1) a concise diagnosis, (2) a 6-8 step roadmap with milestones, (3) 3 project ideas, (4) 3 networking actions, (5) 5 resources (courses/articles). Output clear sections with bullet points.\n\nBackground:\n- Education: ${education.join("; ") || "N/A"}\n- Skills: ${skills.join(", ") || "N/A"}\n- Interests: ${interests.join(", ") || "N/A"}\n- Goal: ${goal || "N/A"}`;

    let content;
    try {
      const { data } = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model,
          messages: [
            { role: "system", content: "You provide actionable, specific career guidance." },
            { role: "user", content: prompt }
          ],
          temperature: 0.4,
        },
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );
      content = data?.choices?.[0]?.message?.content || "";
    } catch (err) {
      return res.json({ success: true, source: "fallback", missing, advice: FALLBACK_ADVICE });
    }

    return res.json({ success: true, source: "openai", missing, advice: content });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
};


