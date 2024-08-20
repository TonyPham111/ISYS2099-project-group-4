
const { setTokenCookie, verifyToken } = require("Util");
const { model } = require("../Models");

const authenticate = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  console.log("\n");
  console.log("Access token: " + accessToken);
  console.log("Refresh token: " + refreshToken);
};

module.exports = {
  authenticate,
};