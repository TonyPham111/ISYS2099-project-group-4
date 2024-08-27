import jwt from "jsonwebtoken";

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
		const verified = await jwt.verify(token, process.env.JWT_SECRET);
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
