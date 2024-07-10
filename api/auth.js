const express = require("express");
const { generateToken } = require("../middleware/auth");

const router = express.Router();

router.post("/generate-token", (req, res) => {
  const { userId, role } = req.body;
  if (!userId || !role) {
    return res
      .status(400)
      .json({ status: "error", message: "userId and role are required" });
  }

  const token = generateToken({ userId, role });
  res.status(200).json({ token });
});

module.exports = router;
