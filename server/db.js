const mysql = require("mysql2"); // Connecting to SQL database
const bcrypt = require("bcrypt"); // Password hashing library

const pool = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "",
	database: "express_test",
	connectionLimit: 10,
	waitForConnections: true,
	queueLimit: 0,
});

pool.getConnection((err, connection) => {
	if (err) {
		console.error("Error connecting to the database:", err);
		return;
	} else {
		console.log("SIGMA CONNECTED");
		connection.release();
	}
});

function GetUserByEmail(email) {}

async function RegisterUser(email, password, res) {
	const [existingUsers] = await pool
		.promise()
		.execute("SELECT * FROM users WHERE email = ?", [email]);

	if (existingUsers.length > 0) {
		return res.status(400).json({ message: "Email already in use" });
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const [result] = await pool
		.promise()
		.execute("INSERT INTO users (email, password_hash) VALUES (?, ?)", [
			email,
			hashedPassword,
		]);

	return result;
}

async function LoginUser(email, password, res) {
	const [existingUsers] = await pool
		.promise()
		.execute("SELECT * FROM users WHERE email = ?", [email]);

	if (existingUsers.length < 1) {
		return res.status(400).json({ message: "Email does not exist." });
	}

	const hashedPassword = existingUsers[0].password_hash;
	if (!hashedPassword) {
		return res.status(500).json({ message: "Password error." });
	}

	console.log(password, hashedPassword);

	const valid = await bcrypt.compare(password, hashedPassword);

	if (!valid) {
        return res.status(401).json({ message: "Incorrect password." });
    };

    req.session.userId = existingUsers[0].id;
    res.status(200).json({ message: "Login successful." });
}

module.exports.LoginUser = LoginUser;
module.exports.RegisterUser = RegisterUser;
