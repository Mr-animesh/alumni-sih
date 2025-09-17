exports.allLogs = async(req , res) => {
    try {
        res.json({msg: "this is dashboard"})
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}