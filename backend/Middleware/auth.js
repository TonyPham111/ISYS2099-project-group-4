import jwt from "jsonwebtoken";


// Function to generate access and refresh tokens
export const generateTokens = (username, role) => {
	const accessToken = jwt.sign({ username, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
	const refreshToken = jwt.sign({ username, role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
  
	return { accessToken, refreshToken };
  };
  
  // Function to set tokens as cookies
export const setTokenCookie = (res, tokens) => {
	res.cookie("accessToken", tokens.accessToken, {
	  httpOnly: true,
	  secure: process.env.NODE_ENV === "production",
	  maxAge: 15 * 60 * 1000, // 15 minutes
	});
	
	res.cookie("refreshToken", tokens.refreshToken, {
	  httpOnly: true,
	  secure: process.env.NODE_ENV === "production",
	  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});
  };

export const verifyToken = async (req, res, next) => {
	try {
		const token = await req.cookies.JWT;
		console.log(token);
		if (!token) {
			console.log("token is not provided");
			// res.redirect("/")
			return res.status(403).json({ message: "Access Denied" });
		}
		// if (token.startsWith("Bearer ")) {
		// 	token = token.slice(7, token.length).trimLeft();
		// }
		const verified = await jwt.verify(token, process.env.ACCESS_TOKEN);
		if (!verified) {
			return res
				.status(401)
				.json({ error: "Unauthorized - Invalid Token" });
		}
		req.user = verified;
		next();
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
