// // const express = require("express");
// // const bodyParser = require("body-parser");
// // const path = require("path");
// // const authRoutes = require("./api/auth");
// // const abdmRoutes = require("./api/abdm");
// // const webhookRoutes = require("./api/webhook");

// // const app = express();

// // // Middleware
// // app.use(bodyParser.json());
// // app.use(express.static(path.join(__dirname, "public")));

// // // Debugging middleware
// // app.use((req, res, next) => {
// //   console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
// //   next();
// // });

// // let responses = [];

// // // Polling route
// // app.get("/api/poll-responses", (req, res) => {
// //   if (responses.length > 0) {
// //     return res.json({ status: "success", data: responses });
// //   } else {
// //     return res.json({ status: "pending", data: [] });
// //   }
// // });

// // // Routes
// // app.use("/api", authRoutes);
// // app.use("/api", abdmRoutes);
// // app.use("/api", webhookRoutes);

// // // Catch-all route for debugging
// // app.use("*", (req, res) => {
// //   res.status(404).send(`Cannot ${req.method} ${req.url}`);
// // });

// // // Error handling middleware
// // app.use((err, req, res, next) => {
// //   console.error(err.stack);
// //   res.status(500).send("Something broke!");
// // });

// // // Server setup
// // const port = process.env.PORT || 3000;
// // app.listen(port, () => {
// //   console.log(`Server is running on port ${port}`);
// //   console.log(
// //     `Webhook route should be available at http://localhost:${port}/api/webhook`
// //   );
// // });
// const express = require("express");
// const bodyParser = require("body-parser");
// const authRoutes = require("./api/auth");
// const abdmRoutes = require("./api/abdm");
// const webhookRoutes = require("./api/webhook");

// const app = express();

// app.use(bodyParser.json());

// app.get("/api/test", (req, res) => {
//   res.status(200).send("Test route is working");
// });

// // Debugging middleware
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
//   next();
// });

// // Routes
// app.use("/api", authRoutes);
// app.use("/api", abdmRoutes);
// app.use("/api", webhookRoutes);

// // Root route
// app.get("/", (req, res) => {
//   res.send("Welcome to the ABDM integration API");
// });

// // Catch-all route for debugging
// app.use("*", (req, res) => {
//   res.status(404).send(`Cannot ${req.method} ${req.url}`);
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// });

// // For local development
// if (process.env.NODE_ENV !== "production") {
//   const port = process.env.PORT || 3000;
//   app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//   });
// }

// // For Vercel
// module.exports = app;

// const express = require("express");
// const bodyParser = require("body-parser");
// const path = require("path");
// const webhookRoutes = require("./api/webhook");

// const app = express();

// app.use(bodyParser.json({ limit: "10mb" }));
// app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// app.use(express.static(path.join(__dirname, "public")));

// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
//   next();
// });

// app.use("/api", webhookRoutes);

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// app.use("*", (req, res) => {
//   console.log(`404 - Not Found: ${req.method} ${req.url}`);
//   res.status(404).send(`Cannot ${req.method} ${req.url}`);
// });

// app.use((err, req, res, next) => {
//   console.error("Error:", err);
//   res.status(500).send("Something broke! Check server logs for details.");
// });

// module.exports = app;

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

let webhookData = [];

// Parse raw body
app.use(bodyParser.raw({ type: "*/*", limit: "10mb" }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Root-level handler for all methods
app.all("*", (req, res) => {
  if (req.url === "/favicon.ico") {
    return res.status(204).end();
  }

  const webhook = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    method: req.method,
    headers: req.headers,
    query: req.query,
    body: req.body.toString("utf8"),
    url: req.originalUrl,
    path: req.path,
    ip: req.ip,
  };

  console.log("Received request:", JSON.stringify(webhook, null, 2));
  webhookData.unshift(webhook);

  if (webhookData.length > 100) {
    webhookData = webhookData.slice(0, 100);
  }

  res.status(200).send("Request received successfully");
});

// Route to view webhooks
app.get("/view-webhooks", (req, res) => {
  res.json(webhookData);
});

// Serve a simple HTML page to view webhooks
app.get("/view", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).send("Something broke! Check server logs for details.");
});

module.exports = app;
