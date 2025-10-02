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
	next();
});

app.use((req, res, next) => {
	console.log(
		`${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`
	);
	next();
});

app.get("/api", (req, res) => {
	res.json({ users: ["user1", "user2", "user3"] });
});

app.post("/login", async (req, res) => {
	console.log("Login attempt received", req.body);

	const { email, password } = req.body;

	try {
		db.LoginUser(email, password, res);
	} catch (err) {
		console.error("We did AN OPPOSIE WOOPSIES", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

app.post("/register", async (req, res) => {
	console.log("Register attempt received", req.body);

	const { email, password } = req.body;
	try {
		const result = db.RegisterUser(email, password, res);

		if (!result) {
			return;
		}
		res.status(200).json({
			success: true,
			message: "User registered successfully",
			userId: result.insertId,
		});
	} catch (error) {
		console.error("Error during registration:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

app.listen(5000, () => {
	console.log("Server is running on http://localhost:5000");
});
