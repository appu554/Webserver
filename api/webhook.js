let responses = [];

module.exports = (req, res) => {
  if (req.method === "POST") {
    console.log("Received POST webhook:", req.body);
    const { requestId, data } = req.body;
    if (requestId && data) {
      responses.push({ requestId, data });
      res.status(200).send("Webhook data received");
    } else {
      res.status(400).send("Invalid webhook payload");
    }
  } else if (req.method === "GET") {
    console.log("Received GET webhook request");
    res.status(200).send("Webhook GET route is working");
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
