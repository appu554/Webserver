const express = require("express");
const { generateToken } = require("../middleware/auth");

const router = express.Router();

let pendingRequests = {};
let connections = {};

router.post("/webhook", (req, res) => {
  const { requestId, data } = req.body;

  if (requestId && data) {
    const encryptedData = generateToken({
      userId: data.userId,
      role: data.role,
      data: data,
    });
    responses.push({ requestId, encryptedData });
    return res.status(200).send("Webhook data received");
  } else {
    return res.status(400).send("Invalid webhook payload");
  }

  // if (pendingRequests[requestId]) {
  //   const client = connections[requestId];
  //   if (client && client.readyState === WebSocket.OPEN) {
  //     const encryptedData = generateToken({
  //       userId: data.userId,
  //       role: data.role,
  //       data: data,
  //     });
  //     client.send(JSON.stringify({ encryptedData }));
  //     client.close(); // Close the WebSocket connection after sending the response
  //   }

  //   delete pendingRequests[requestId];
  // }
});

module.exports = router;
