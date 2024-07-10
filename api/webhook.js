const express = require("express");
const router = express.Router();

let abdmResponses = [];

router.post("/abdm-callback", (req, res) => {
  console.log(
    "Received ABDM POST callback. Body:",
    JSON.stringify(req.body, null, 2)
  );

  // Store the entire payload without validation
  abdmResponses.push({
    payload: req.body,
    timestamp: new Date(),
  });

  // Respond with success regardless of payload structure
  res.status(200).send("ABDM callback received and stored");
});

router.get("/abdm-callback", (req, res) => {
  console.log("Received ABDM GET request");
  res
    .status(200)
    .send("ABDM GET route is working. Note: Callbacks should use POST.");
});

router.get("/abdm-responses", (req, res) => {
  res.json(abdmResponses);
});

// New route to clear stored responses
router.post("/clear-responses", (req, res) => {
  abdmResponses = [];
  res.status(200).send("All stored responses cleared");
});

module.exports = router;
