
const jwt = require("jsonwebtoken");
const db = require("../../Models/dbConnectionConfiguration");

const CreateToken = (username, role, shop_name) => {
  try {
    // Check if environment variables are set
    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
      throw new Error(
        "Token secrets are not set in the environment variables.",
      );
    }

    // Generate an access token
    const AccessToken = jwt.sign(
      { username: username, role: role, dept_name: dept_name },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" },
    );

    // Generate a refresh token
    const RefreshToken = jwt.sign(
      { username: username, role: role, dept_name: dept_name },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );

    console.log("\n");
    console.log(`User for tokens: ${username}`);
    console.log(`Role for tokens: ${role}`);


    return { AccessToken, RefreshToken };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = CreateToken;