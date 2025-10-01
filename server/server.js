const express = require("express");
const app = express();

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "http://localhost:3000");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

app.get("/api", (req, res) => {
	res.json({ users: ["user1", "user2", "user3"] });
});

app.listen(5000, () => {
	console.log("Server is running on http://localhost:5000");
});
