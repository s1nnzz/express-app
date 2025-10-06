const express = require("express");
const app = express();

const db = require("./db");

const session = require("express-session");

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	session({
		secret: "SuperSecretKey",
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 2,
		},
	})
);

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "http://localhost:3000");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	res.header("Access-Control-Allow-Credentials", "true");
	next();
});

app.get("/api", (req, res) => {
	res.json({});
});

app.post("/api/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		db.LoginUser(email, password, res, req);
	} catch (err) {
		console.error("We did AN OPPOSIE WOOPSIES", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

app.post("/api/logout", (req, res) => {
	if (req.session) {
		req.session.destroy((err) => {
			if (err) {
				console.error("Error during logout:", err);
				return res
					.status(500)
					.json({ message: "Internal server error" });
			}
			res.status(200).json({
				success: true,
				message: "Logged out successfully",
			});
		});
	} else {
		res.status(200).json({
			success: false,
			message: "No active session found",
		});
	}
});

app.post("/api/register", async (req, res) => {
	const { email, password } = req.body;
	try {
		const result = await db.RegisterUser(email, password); // ⬅️ await, no res passed
		res.status(200).json({
			success: true,
			message: "User registered successfully",
			userId: result.insertId,
		});
	} catch (error) {
		console.error("Error during registration:", error);
		res.status(error.statusCode || 500).json({
			message: error.message || "Internal server error",
		});
	}
});

app.post("/api/authcheck", async (req, res) => {
	try {
		db.isLoggedIn(req, res);
	} catch (error) {
		console.error("Error during auth check:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

app.listen(5000, () => {
	console.log("Server is running on http://localhost:5000");
});
