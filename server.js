const express = require("express");
const { join } = require("path");
const authRoutes = require("./api/auth");
const abdmRoutes = require("./api/abdm");
const webhookRoutes = require("./api/webhook");

const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, "public")));

let responses = [];

// Polling route to check for webhook responses
app.get("/api/poll-responses", (req, res) => {
  if (responses.length > 0) {
    return res.json({ status: "success", data: responses });
  } else {
    return res.json({ status: "pending", data: [] });
  }
});

// Other routes
app.use("/api", authRoutes);
app.use("/api", abdmRoutes);
app.use("/api", webhookRoutes);

// Server setup
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
