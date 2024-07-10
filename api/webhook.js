// let responses = [];

// module.exports = (req, res) => {
//   if (req.method === "POST") {
//     console.log("Received POST webhook:", req.body);
//     const { requestId, data } = req.body;
//     if (requestId && data) {
//       responses.push({ requestId, data });
//       res.status(200).send("Webhook data received");
//     } else {
//       res.status(400).send("Invalid webhook payload");
//     }
//   } else if (req.method === "GET") {
//     console.log("Received GET webhook request");
//     res.status(200).send("Webhook GET route is working");
//   } else {
//     res.setHeader("Allow", ["GET", "POST"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// };

const express = require("express");
const router = express.Router();

// In-memory storage for ABDM responses. In a production environment, consider using a database.
let abdmResponses = [];

router.post("/abdm-callback", (req, res) => {
  console.log("Received ABDM callback:", req.body);
  const { requestId, response } = req.body;
  if (requestId && response) {
    abdmResponses.push({ requestId, response, timestamp: new Date() });
    return res.status(200).send("ABDM callback received");
  } else {
    return res.status(400).send("Invalid ABDM callback payload");
  }
});

// Endpoint to retrieve ABDM responses
router.get("/abdm-responses", (req, res) => {
  res.json(abdmResponses);
});

// Endpoint to clear responses (for testing/management purposes)
router.post("/clear-responses", (req, res) => {
  abdmResponses = [];
  res.status(200).send("Responses cleared");
});

module.exports = router;
