const express = require("express");
const router = express.Router();

let webhookData = [];

router.post("/abdm-callback", (req, res) => {
  const webhook = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    method: req.method,
    headers: req.headers,
    query: req.query,
    body: req.body,
    url: req.originalUrl,
  };

  console.log("Received webhook:", JSON.stringify(webhook, null, 2));
  webhookData.unshift(webhook); // Add to the beginning of the array

  // Keep only the last 100 webhooks
  if (webhookData.length > 100) {
    webhookData = webhookData.slice(0, 100);
  }

  res.status(200).send("Webhook received successfully");
});

router.get("/webhooks", (req, res) => {
  res.json(webhookData);
});

router.delete("/webhooks/:id", (req, res) => {
  const id = req.params.id;
  const index = webhookData.findIndex((webhook) => webhook.id === id);
  if (index !== -1) {
    webhookData.splice(index, 1);
    res.status(200).send("Webhook deleted successfully");
  } else {
    res.status(404).send("Webhook not found");
  }
});

router.delete("/webhooks", (req, res) => {
  webhookData = [];
  res.status(200).send("All webhooks cleared");
});

module.exports = router;
