require("dotenv").config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  abdmBaseUrl: process.env.ABDM_BASE_URL,
  abdmClientId: process.env.ABDM_CLIENT_ID,
  abdmClientSecret: process.env.ABDM_CLIENT_SECRET,
  hipId: process.env.HIP_ID,
};
