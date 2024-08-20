const generateTokens = require("./CreateToken");

const SetToken = (res, username, role, dept_name_name) => {
  const tokens = CreateToken(username, role, dept_name);

  console.log("\n");
  console.log("access token: ", tokens.accessToken);
  console.log("refresh token: ", tokens.refreshToken);

  console.log("\n");
  console.log("response accessToken cookie and refreshToken cookie");
};

module.exports = SetToken;