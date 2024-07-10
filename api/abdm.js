const express = require("express");
const axios = require("axios");
const uuid = require("uuid");
const { authenticate } = require("../middleware/auth");
const {
  abdmBaseUrl,
  abdmClientId,
  abdmClientSecret,
  hipId,
} = require("../config/config");

const router = express.Router();

let pendingRequests = {};
let connections = {};

router.post("/request-abdm", authenticate, async (req, res) => {
  const requestId = uuid.v4();
  const { abhaAddress } = req.user;

  try {
    const accessToken = await getAbdmToken();
    await initiateDiscovery(accessToken, requestId, abhaAddress);

    pendingRequests[requestId] = res;
    res.status(202).json({
      requestId,
      status: "pending",
      message: "Request initiated. Waiting for response...",
    });
  } catch (error) {
    console.error("Error in request-abdm:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

async function getAbdmToken() {
  const tokenUrl = `${abdmBaseUrl}/v0.5/sessions`;
  const tokenPayload = {
    clientId: abdmClientId,
    clientSecret: abdmClientSecret,
  };
  const headers = {
    accept: "*/*",
    "X-CM-ID": "sbx",
    "Content-Type": "application/json",
  };
  const response = await axios.post(tokenUrl, tokenPayload, { headers });
  return response.data.accessToken;
}

async function initiateDiscovery(accessToken, requestId, abhaAddress) {
  const url = `${abdmBaseUrl}/v0.5/users/auth/init`;
  const headers = {
    accept: "*/*",
    "X-CM-ID": "sbx",
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
  const timestamp = new Date().toISOString();
  const payload = {
    requestId,
    timestamp,
    query: {
      id: abhaAddress,
      purpose: "KYC_AND_LINK",
      requester: { type: "HIP", id: hipId },
    },
  };
  await axios.post(url, payload, { headers });
}

module.exports = router;
