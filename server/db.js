const mysql = require("mysql2"); // Connecting to SQL database
const bcrypt = require("bcrypt"); // Password hashing library
const crypto = require("crypto");

const chalk = require("chalk"); // colored console output

const dbSchemaFile = "./dbschema.sql";

let pool;

async function checkDatabaseExists(connection) {
	try {
		const [databases] = await connection.query(
			"SHOW DATABASES LIKE 'express_test'"
		);
		return databases.length > 0;
	} catch (err) {
		console.error(
			chalk.redBright("Error checking database existence:"),
			err
		);
		return false;
	}
}

async function runCreateDatabase(connection) {
	const schemaSQL = require("fs").readFileSync(dbSchemaFile, "utf8");

	const statements = schemaSQL
		.split(";")
		.map((stmt) => stmt.trim()) // trim each one
		.filter((stmt) => stmt.length > 0); // remove empty statements

	for (const statement of statements) {
		if (statement.trim()) {
			console.log(
				chalk.blueBright(`Executing: ${statement.substring(0, 50)}...`)
			);
			await connection.query(statement);
		}
	}

	console.log(chalk.greenBright("Database schema setup completed"));
}

async function initializeDatabase() {
	try {
		const connection = await mysql // use a single connection to check/create DB
			.createConnection({
				host: "localhost",
				user: "root",
				password: "",
			})
			.promise();

		// Check if database already exists
		const databaseExists = await checkDatabaseExists(connection);

		if (!databaseExists) {
			console.log(
				chalk.yellowBright(
					"Database 'express_test' not found, setting up database schema..."
				)
			);

			await runCreateDatabase(connection);
		}

		// Close the single connection
		await connection.end();

		// Now create our main pool since we know the database exists
		pool = mysql.createPool({
			host: "localhost",
			user: "root",
			password: "",
			database: "express_test",
			connectionLimit: 10,
			waitForConnections: true,
			queueLimit: 0,
		});

		console.log(chalk.cyan("Database connection pool established"));
	} catch (err) {
		console.error(chalk.redBright("Error initializing database:"), err);
		throw err;
	}
}

// Initialize the database and connection pool
initializeDatabase();

function GetUserByEmail(email) {}

async function completePasswordReset(token, newPassword, res) {
	if (!token || typeof token !== "string" || token.length !== 64) {
		const error = new Error("Invalid token format");
		error.statusCode = 400;
		throw error;
	}

	if (!newPassword || newPassword.length < 8) {
		const error = new Error("Password must be at least 8 characters");
		error.statusCode = 400;
		throw error;
	}

	// Get user and validate token in one query
	const [users] = await pool
		.promise()
		.execute("SELECT id, reset_expires FROM users WHERE reset_token = ?", [
			token,
		]);

	if (users.length === 0) {
		const error = new Error("Invalid or expired token");
		error.statusCode = 400;
		throw error;
	}

	const user = users[0];

	// Check if token is expired
	if (!user.reset_expires || new Date(user.reset_expires) < new Date()) {
		// Clear expired token
		await pool
			.promise()
			.execute(
				"UPDATE users SET reset_token = NULL, reset_expires = NULL WHERE id = ?",
				[user.id]
			);

		const error = new Error("Token has expired");
		error.statusCode = 400;
		throw error;
	}

	// Hash new password
	const hashedPassword = await bcrypt.hash(newPassword, 12); // Higher salt rounds

	// Update password and clear reset fields atomically
	const [result] = await pool
		.promise()
		.execute(
			"UPDATE users SET password_hash = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?",
			[hashedPassword, user.id]
		);

	if (result.affectedRows === 0) {
		const error = new Error("Failed to update password");
		error.statusCode = 500;
		throw error;
	}

	res.status(200).json({ message: "Password has been reset successfully." });
}

async function doesAccountExist(email) {
	const [existingUsers] = await pool
		.promise()
		.execute("SELECT * FROM users WHERE email = ?", [email]);

	if (existingUsers.length > 0) {
		// Throw an error so the route can catch it
		return true;
	} else {
		return false;
	}
}

async function RegisterUser(email, password) {
	// Add await here - this was missing!
	const accountExists = await doesAccountExist(email);

	if (accountExists) {
		const error = new Error("Email already registered");
		error.statusCode = 400;
		throw error;
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

async function createPasswordReset(email, res) {
	const accountIsExisting = await doesAccountExist(email);

	if (!accountIsExisting) {
		const error = new Error("Email is not registered.");
		error.statusCode = 400;
		throw error;
	}

	const token = crypto.randomBytes(32).toString("hex");
	const [result] = await pool
		.promise()
		.execute("UPDATE users SET reset_token = ? WHERE email = ?", [
			token,
			email,
		]);

	const [result2] = await pool
		.promise()
		.execute(
			"UPDATE users SET reset_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE email = ?",
			[email]
		);

	res.status(200).json({
		message: "Password reset token created.",
		resetToken: token,
	});
}

async function LoginUser(email, password, res, req) {
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

	const valid = await bcrypt.compare(password, hashedPassword);

	if (!valid) {
		return res.status(401).json({ message: "Incorrect password." });
	}

	req.session.userId = existingUsers[0].id;
	res.status(200).json({ message: "Login successful." });
}

async function isLoggedIn(req, res) {
	if (req.session && req.session.userId) {
		res.status(200).json({ loggedIn: true, userId: req.session.userId });
	} else {
		res.status(200).json({ loggedIn: false });
	}
}

module.exports.LoginUser = LoginUser;
module.exports.RegisterUser = RegisterUser;
module.exports.isLoggedIn = isLoggedIn;
module.exports.createPasswordReset = createPasswordReset;
module.exports.completePasswordReset = completePasswordReset;
