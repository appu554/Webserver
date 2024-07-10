// const express = require("express");
// const bodyParser = require("body-parser");
// const path = require("path");
// const authRoutes = require("./api/auth");
// const abdmRoutes = require("./api/abdm");
// const webhookRoutes = require("./api/webhook");

// const app = express();

// // Middleware
// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, "public")));

// // Debugging middleware
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
//   next();
// });

// let responses = [];

// // Polling route
// app.get("/api/poll-responses", (req, res) => {
//   if (responses.length > 0) {
//     return res.json({ status: "success", data: responses });
//   } else {
//     return res.json({ status: "pending", data: [] });
//   }
// });

// // Routes
// app.use("/api", authRoutes);
// app.use("/api", abdmRoutes);
// app.use("/api", webhookRoutes);

// // Catch-all route for debugging
// app.use("*", (req, res) => {
//   res.status(404).send(`Cannot ${req.method} ${req.url}`);
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// });

// // Server setup
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
//   console.log(
//     `Webhook route should be available at http://localhost:${port}/api/webhook`
//   );
// });
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./api/auth");
const abdmRoutes = require("./api/abdm");
const webhookRoutes = require("./api/webhook");

const app = express();

app.use(bodyParser.json());

// Debugging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api", authRoutes);
app.use("/api", abdmRoutes);
app.use("/api", webhookRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the ABDM integration API");
});

// Catch-all route for debugging
app.use("*", (req, res) => {
  res.status(404).send(`Cannot ${req.method} ${req.url}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// For local development
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// For Vercel
module.exports = app;
