import jwt from "jsonwebtoken";


// Function to generate access and refresh tokens
export const generateTokens = (id, email, role) => {
	const accessToken = jwt.sign({ id, email, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
	const refreshToken = jwt.sign({ id, email, role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
  
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
		const token = await req.cookies.accessToken;
		console.log(token);
		if (!token) {
			console.log("token is not provided");
			// res.redirect("/")
			return res.status(403).json({ message: "Access Denied" });
		}
		// if (token.startsWith("Bearer ")) {
		// 	token = token.slice(7, token.length).trimLeft();
		// }
		try {
			const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
			req.user = verified;
		} catch (err) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}
		next();
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
