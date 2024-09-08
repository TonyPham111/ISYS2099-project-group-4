import jwt from "jsonwebtoken";

// Function to generate access and refresh tokens
export const generateTokens = (id, email, role, job_id, department_id) => {
  role = role.replace(" ", "");
  const accessToken = jwt.sign({ id, email, role, job_id, department_id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id, email, role, job_id, department_id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

  return { accessToken, refreshToken };
};

// Function to set tokens as cookies
export const setTokenCookie = (res, tokens) => {
  res.cookie("accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    console.log(token);
    if (!token) {
      console.log("Token is not provided");
      return res.status(403).json({ message: "Access Denied. Try logging in again." });
    }
    try {
      const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = verified;
      console.log("Verified user:", verified);
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        // Handle expired token
        return res.status(401).json({ error: "Token expired. Please log in again." });
      }
      // Handle other token errors
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }
  } catch (err) {
    console.error("Error in verifyToken middleware:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const refreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh Token not found" });
  }

  try {
    const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const { id, email, role, job_id, department_id } = verified;
    const tokens = generateTokens(id, email, role, job_id, department_id);
    setTokenCookie(res, tokens);
    next();
  } catch (err) {
    console.error("Error refreshing token:", err);
    res.status(401).json({ error: "Invalid Refresh Token" });
  }
};
