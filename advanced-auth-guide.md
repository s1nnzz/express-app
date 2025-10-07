# Step-by-Step Authentication Guide

## Build Authentication Features One by One

Instead of creating complete files that only work at the end, this guide teaches you to build authentication features incrementally. **Each step adds one working feature** that you can test immediately, so you understand how everything connects as you build.

---

## 🎯 Learning Approach

**Incremental Development**: Each step builds on the previous one

-   ✅ **Step 1**: Set up database → Test database connection
-   ✅ **Step 2**: Add user registration → Test creating users
-   ✅ **Step 3**: Add login system → Test logging in
-   ✅ **Step 4**: Add frontend forms → Test full registration flow
-   ✅ **Step 5**: Add session management → Test staying logged in
-   ✅ **Step 6**: Add protected routes → Test auth-only pages
-   ✅ **Step 7**: Add logout → Test complete auth cycle

**Why This Works Better:**

-   **Immediate feedback**: See results after each step
-   **Easier debugging**: Problems are isolated to recent changes
-   **Better understanding**: See how each piece connects to the whole
-   **Real workflow**: How professional developers actually build features

---

## 📋 Prerequisites

Before starting, you should have completed the basic setup from `guide.md`:

-   ✅ React frontend running on port 3000
-   ✅ Express backend running on port 5000
-   ✅ Node.js and npm installed
-   ✅ Basic understanding of React components and Express routes

**Quick Check**: Visit `http://localhost:3000` and `http://localhost:5000/api` to confirm both servers work.

---

## 🗄️ Step 1: Database Connection (Test Immediately)

**Goal**: Set up MySQL database and create a working connection that you can test right away.

### 1.1: Install MySQL and Create Database

**Install MySQL** (choose one):

-   **XAMPP**: Download from xampp.org (includes MySQL, Apache, phpMyAdmin)
-   **Direct MySQL**: Download from mysql.com

**Create your database**:

1. Start MySQL service
2. Open phpMyAdmin (http://localhost/phpmyadmin) or MySQL command line
3. Create database: `CREATE DATABASE express_test;`

**Quick Test**: Refresh phpMyAdmin - you should see `express_test` in the database list.

### 1.2: Install Database Dependencies

In your **server** folder:

```bash
cd server
npm install mysql2 bcryptjs express-session cors dotenv
```

**What each package does:**

-   `mysql2`: Connect to MySQL database
-   `bcryptjs`: Encrypt passwords securely
-   `express-session`: Remember logged-in users
-   `cors`: Let frontend talk to backend
-   `dotenv`: Store database passwords safely

### 1.3: Create Database Connection File

Create `server/db.js` with **just** the connection (no user functions yet):

```javascript
const mysql = require("mysql2");

// Database connection pool
const pool = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "", // Your MySQL password (often empty for XAMPP)
	database: "express_test",
	connectionLimit: 10,
	waitForConnections: true,
	queueLimit: 0,
});

// Test the connection
async function testConnection() {
	try {
		const [rows] = await pool.promise().execute("SELECT 1 as test");
		console.log("✅ Database connected successfully!");
		return true;
	} catch (error) {
		console.error("❌ Database connection failed:", error.message);
		return false;
	}
}

module.exports = { pool, testConnection };
```
`
**Detailed Code Breakdown:**

**1. Importing the MySQL Module:**

```javascript
const mysql = require("mysql2");
```

-   `require()`: Node.js function to import external packages
-   `"mysql2"`: The package name we installed with npm
-   `const`: Creates a constant variable that can't be reassigned
-   `mysql`: The variable name we'll use to access MySQL functions

**2. Connection Pool Concept:**

```javascript
const pool = mysql.createPool({...});
```

-   **What's a connection pool?** Think of it like a parking lot for database connections
-   **Why use it?** Creating new database connections is slow (like parking a car)
-   **Pool benefits**: Reuses existing connections (like reserved parking spots)
-   **Better performance**: Multiple requests can use different connections simultaneously

**3. Pool Configuration Options:**

```javascript
{
	host: "localhost",           // WHERE is the database?
	user: "root",               // WHO can access it?
	password: "",               // WHAT is the password?
	database: "express_test",   // WHICH database to use?
	connectionLimit: 10,        // HOW MANY connections max?
	waitForConnections: true,   // WAIT if all connections busy?
	queueLimit: 0,             // HOW MANY requests can wait? (0 = unlimited)
}
```

**4. Async Function Explanation:**

```javascript
async function testConnection() {
```

-   `async`: Tells JavaScript this function will do asynchronous work
-   **Asynchronous**: Operations that take time (like database queries)
-   **Why async?** Database operations don't happen instantly
-   **Benefit**: Other code can run while waiting for database response

**5. Promise Chain Breakdown:**

```javascript
const [rows] = await pool.promise().execute("SELECT 1 as test");
```

-   `pool.promise()`: Converts callback-based MySQL to Promise-based
-   `.execute()`: Runs the SQL command
-   `await`: Waits for the database operation to complete
-   `"SELECT 1 as test"`: Simple SQL that just returns the number 1
-   `[rows]`: Destructuring assignment - extracts first item from result array

**6. Error Handling Pattern:**

```javascript
try {
	// Code that might fail
} catch (error) {
	// Code that runs if something goes wrong
}
```

-   `try`: Attempt to run potentially risky code
-   `catch`: Handle any errors that occur
-   **Why this pattern?** Database connections can fail (server down, wrong password, etc.)

**7. Module Exports:**

```javascript
module.exports = { pool, testConnection };
```

-   `module.exports`: Node.js way to make functions/variables available to other files
-   `{ pool, testConnection }`: Object shorthand syntax
-   **Long form would be:** `{ pool: pool, testConnection: testConnection }`
-   **Why export both?** Other files need `pool` for queries and `testConnection` for testing

### 1.4: Test Your Database Connection

Add this to your `server/server.js` (after existing code):

```javascript
// Add at the top with other imports
const { testConnection } = require("./db");

// Add after your existing routes
app.get("/api/test-db", async (req, res) => {
	const isConnected = await testConnection();
	if (isConnected) {
		res.json({
			message: "Database connection successful!",
			timestamp: new Date().toISOString(),
		});
	} else {
		res.status(500).json({
			message: "Database connection failed!",
		});
	}
});
```

**Detailed Route Breakdown:**

**1. Importing with Destructuring:**

```javascript
const { testConnection } = require("./db");
```

-   `require("./db")`: Import from our local db.js file (`.` means current directory)
-   `{ testConnection }`: Destructuring - extract just the `testConnection` function
-   **Alternative syntax:** `const db = require("./db"); db.testConnection()`
-   **Why destructuring?** Cleaner code - we can use `testConnection()` directly

**2. Express Route Definition:**

```javascript
app.get("/api/test-db", async (req, res) => {
```

-   `app.get()`: Define a route that responds to GET requests
-   `"/api/test-db"`: The URL path that triggers this route
-   `async`: This route handler will use asynchronous operations
-   `(req, res) =>`: Arrow function with request and response parameters
-   `req`: Object containing information about the incoming request
-   `res`: Object used to send response back to the client

**3. Async Function Call:**

```javascript
const isConnected = await testConnection();
```

-   `await`: Wait for testConnection() to complete before continuing
-   **Why await?** testConnection() needs time to actually test the database
-   `isConnected`: Boolean variable (true or false) storing the result

**4. Conditional Response:**

```javascript
if (isConnected) {
	res.json({...});
} else {
	res.status(500).json({...});
}
```

-   `if/else`: Basic conditional logic
-   `res.json()`: Send JSON response with 200 (success) status
-   `res.status(500)`: Set HTTP status to 500 (server error)
-   **Status 500**: "Internal Server Error" - something went wrong on server side

**5. JSON Response Objects:**

```javascript
{
	message: "Database connection successful!",
	timestamp: new Date().toISOString(),
}
```

-   **Object literal syntax**: `{ key: value, key2: value2 }`
-   `new Date()`: Creates current date/time object
-   `.toISOString()`: Converts date to standardized text format
-   **Why timestamp?** Helps with debugging and shows when test was run

**6. HTTP Status Codes Explained:**

-   **200 (default)**: "OK" - request succeeded
-   **500**: "Internal Server Error" - server couldn't complete request
-   **Why status codes?** Frontend can check if request succeeded or failed

### 1.5: Test It Works

1. **Restart your server**: Stop and start your backend server
2. **Visit**: http://localhost:5000/api/test-db
3. **Expected result**: `{"message":"Database connection successful!","timestamp":"..."}`

**If it doesn't work:**

-   Check MySQL is running
-   Verify database name is `express_test`
-   Check username/password in `db.js`
-   Look at server console for error details

**✅ Checkpoint**: You now have a working database connection that you can test anytime by visiting the `/api/test-db` endpoint.

---

## 📋 Step 2: Create Users Table (Test with Data)

**Goal**: Add a users table to your database and test inserting/reading user data.

### 2.1: Create the Users Table

In phpMyAdmin or MySQL command line, run this SQL:

```sql
USE express_test;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**What each column does:**

-   `id`: Unique number for each user (automatically assigned)
-   `email`: User's login email (must be unique)
-   `password_hash`: Encrypted password (never store plain passwords!)
-   `created_at`: When the account was created

### 2.2: Add Database Functions

Update your `server/db.js` to include user management functions:

```javascript
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");

// Database connection pool
const pool = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "", // Your MySQL password
	database: "express_test",
	connectionLimit: 10,
	waitForConnections: true,
	queueLimit: 0,
});

// Test the connection
async function testConnection() {
	try {
		const [rows] = await pool.promise().execute("SELECT 1 as test");
		console.log("✅ Database connected successfully!");
		return true;
	} catch (error) {
		console.error("❌ Database connection failed:", error.message);
		return false;
	}
}

// Register a new user
async function registerUser(email, password) {
	try {
		// Check if user already exists
		const [existingUsers] = await pool
			.promise()
			.execute("SELECT email FROM users WHERE email = ?", [email]);

		if (existingUsers.length > 0) {
			throw new Error("User already exists with this email");
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 12);

		// Insert new user
		const [result] = await pool
			.promise()
			.execute("INSERT INTO users (email, password_hash) VALUES (?, ?)", [
				email,
				hashedPassword,
			]);

		console.log(`✅ User registered: ${email}`);
		return { success: true, userId: result.insertId };
	} catch (error) {
		console.error("❌ Registration error:", error.message);
		throw error;
	}
}

// Get all users (for testing purposes)
async function getAllUsers() {
	try {
		const [users] = await pool
			.promise()
			.execute("SELECT id, email, created_at FROM users");
		return users;
	} catch (error) {
		console.error("❌ Error getting users:", error.message);
		throw error;
	}
}

module.exports = {
	pool,
	testConnection,
	registerUser,
	getAllUsers,
};
```

**Detailed Function Explanations:**

**1. bcrypt Import and Purpose:**

```javascript
const bcrypt = require("bcryptjs");
```

-   **What is bcrypt?** A password hashing library
-   **Why use it?** Never store passwords in plain text (security disaster!)
-   **How it works:** Takes password → runs it through complex math → creates encrypted string
-   **One-way function:** You can't reverse the hash to get the original password

**2. registerUser Function Structure:**

```javascript
async function registerUser(email, password) {
```

-   **Function parameters:** `email` and `password` are inputs from whoever calls this function
-   **async keyword:** This function will perform database operations (which take time)
-   **Naming convention:** camelCase for function names in JavaScript

**3. Checking for Existing Users:**

```javascript
const [existingUsers] = await pool
	.promise()
	.execute("SELECT email FROM users WHERE email = ?", [email]);
```

-   **SQL breakdown:**
    -   `SELECT email FROM users`: Get email column from users table
    -   `WHERE email = ?`: Only rows where email matches our parameter
    -   `?`: Placeholder that gets safely replaced with actual email value
-   **Why check first?** Prevent duplicate accounts (email must be unique)
-   **Array destructuring:** `[existingUsers]` extracts first item from result array
-   **Parameterized query:** `[email]` safely inserts the email value where `?` is

**4. Duplicate User Detection:**

```javascript
if (existingUsers.length > 0) {
	throw new Error("User already exists with this email");
}
```

-   **Array.length:** Number of items in the array
-   **Logic:** If we found any users (length > 0), email is already taken
-   **throw new Error():** Stops function execution and sends error message
-   **Why throw?** Calling code can decide how to handle the error

**5. Password Hashing Process:**

```javascript
const hashedPassword = await bcrypt.hash(password, 12);
```

-   **bcrypt.hash():** Takes plain password and makes it unreadable
-   **Two parameters:** `password` (plain text) and `12` (salt rounds)
-   **Salt rounds (12):** How many times to run the hashing algorithm
    -   Higher number = more secure but slower
    -   12 rounds ≈ 400ms processing time
    -   Each increment doubles the time
-   **await:** Wait for hashing to complete (it's computationally intensive)
-   **Result:** Something like `$2b$12$xyz...` (60 characters of encrypted data)

**6. Inserting New User:**

```javascript
const [result] = await pool
	.promise()
	.execute("INSERT INTO users (email, password_hash) VALUES (?, ?)", [
		email,
		hashedPassword,
	]);
```

-   **INSERT SQL:** Add new row to database
-   **Column specification:** `(email, password_hash)` - which columns we're filling
-   **VALUES (?, ?):** Two placeholders for our two values
-   **Parameter array:** `[email, hashedPassword]` - values that replace the `?` placeholders
-   **Why parameterized?** Prevents SQL injection attacks (hackers can't inject malicious SQL)
-   **Return value:** Database gives us information about what was inserted

**7. Success Response:**

```javascript
console.log(`✅ User registered: ${email}`);
return { success: true, userId: result.insertId };
```

-   **Template literal:** `\`✅ User registered: ${email}\`` - embeds variable in string
-   **${email}:** Expression inside template literal (evaluates to actual email)
-   **result.insertId:** MySQL automatically generates this ID for new rows
-   **Object return:** `{ success: true, userId: result.insertId }` - structured response
-   **Why return object?** Calling code knows operation succeeded and gets the new user's ID

**8. getAllUsers Function:**

```javascript
async function getAllUsers() {
	try {
		const [users] = await pool
			.promise()
			.execute("SELECT id, email, created_at FROM users");
		return users;
	} catch (error) {
		console.error("❌ Error getting users:", error.message);
		throw error;
	}
}
```

-   **SELECT specific columns:** `id, email, created_at` (not password_hash for security!)
-   **No WHERE clause:** Gets ALL users from table
-   **Security note:** Never return password hashes to frontend
-   **Direct return:** `return users` gives back the array of user objects

**9. Module Exports Pattern:**

```javascript
module.exports = {
	pool,
	testConnection,
	registerUser,
	getAllUsers,
};
```

-   **Object shorthand:** `{ pool }` is same as `{ pool: pool }`
-   **Multiple exports:** Other files can import any of these functions
-   **Why export pool?** Other files might need direct database access

### 2.3: Add Test Routes

Add these routes to your `server/server.js` (after existing code):

```javascript
// Add at the top with other imports
const { testConnection, registerUser, getAllUsers } = require("./db");

// Test route to create a user
app.post("/api/test-register", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				message: "Email and password required",
			});
		}

		const result = await registerUser(email, password);
		res.json({
			message: "User created successfully!",
			userId: result.userId,
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
});

// Test route to see all users
app.get("/api/test-users", async (req, res) => {
	try {
		const users = await getAllUsers();
		res.json({
			message: `Found ${users.length} users`,
			users: users,
		});
	} catch (error) {
		res.status(500).json({
			message: "Error fetching users",
		});
	}
});
```

### 2.4: Test Your User System

**Test 1: Create a user**

Use a tool like Postman, or browser console:

```javascript
// In browser console at http://localhost:3000
fetch("http://localhost:5000/api/test-register", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		email: "test@example.com",
		password: "password123",
	}),
})
	.then((res) => res.json())
	.then((data) => console.log(data));
```

**Expected result**: `{"message":"User created successfully!","userId":1}`

**Test 2: See all users**

Visit: http://localhost:5000/api/test-users

**Expected result**: `{"message":"Found 1 users","users":[{"id":1,"email":"test@example.com","created_at":"..."}]}`

**Test 3: Try duplicate email**

Run the same registration again - you should get an error about user already existing.

### 2.5: Verify in Database

In phpMyAdmin:

1. Click on `express_test` database
2. Click on `users` table
3. Click "Browse" tab
4. You should see your test user with encrypted password

**✅ Checkpoint**: You can now create users and store them securely in the database. The password is encrypted (never stored in plain text).

---

## 🔐 Step 3: Add Login System (Test Authentication)

**Goal**: Add login functionality that validates email/password and test it immediately.

### 3.1: Add Login Function to Database

Add this function to your `server/db.js` (after the existing functions):

```javascript
// Login user
async function loginUser(email, password) {
	try {
		// Find user by email
		const [users] = await pool
			.promise()
			.execute(
				"SELECT id, email, password_hash FROM users WHERE email = ?",
				[email]
			);

		if (users.length === 0) {
			throw new Error("No user found with this email");
		}

		const user = users[0];

		// Check password
		const isValidPassword = await bcrypt.compare(
			password,
			user.password_hash
		);

		if (!isValidPassword) {
			throw new Error("Invalid password");
		}

		console.log(`✅ User logged in: ${email}`);
		return {
			success: true,
			user: {
				id: user.id,
				email: user.email,
			},
		};
	} catch (error) {
		console.error("❌ Login error:", error.message);
		throw error;
	}
}
```

**Update your exports** at the bottom of `server/db.js`:

```javascript
module.exports = {
	pool,
	testConnection,
	registerUser,
	getAllUsers,
	loginUser, // Add this line
};
```

**How login works:**

1. Look up user by email in database
2. Compare provided password with stored encrypted password
3. Return user info if passwords match
4. Throw error if email not found or password wrong

### 3.2: Add Login Route

Add this route to your `server/server.js`:

```javascript
// Add loginUser to your imports at the top
const {
	testConnection,
	registerUser,
	getAllUsers,
	loginUser,
} = require("./db");

// Test route to login
app.post("/api/test-login", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				message: "Email and password required",
			});
		}

		const result = await loginUser(email, password);
		res.json({
			message: "Login successful!",
			user: result.user,
		});
	} catch (error) {
		res.status(401).json({
			message: error.message,
		});
	}
});
```

### 3.3: Test Your Login System

**Test 1: Successful login**

Use the user you created in Step 2:

```javascript
// In browser console at http://localhost:3000
fetch("http://localhost:5000/api/test-login", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		email: "test@example.com",
		password: "password123",
	}),
})
	.then((res) => res.json())
	.then((data) => console.log(data));
```

**Expected result**: `{"message":"Login successful!","user":{"id":1,"email":"test@example.com"}}`

**Test 2: Wrong password**

```javascript
fetch("http://localhost:5000/api/test-login", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		email: "test@example.com",
		password: "wrongpassword",
	}),
})
	.then((res) => res.json())
	.then((data) => console.log(data));
```

**Expected result**: `{"message":"Invalid password"}`

**Test 3: Non-existent user**

```javascript
fetch("http://localhost:5000/api/test-login", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		email: "notreal@example.com",
		password: "password123",
	}),
})
	.then((res) => res.json())
	.then((data) => console.log(data));
```

**Expected result**: `{"message":"No user found with this email"}`

### 3.4: Understanding bcrypt.compare()

The login uses `bcrypt.compare()` to check passwords:

```javascript
const isValidPassword = await bcrypt.compare(password, user.password_hash);
```

**Why this works:**

-   `password`: Plain text password from user (e.g., "password123")
-   `user.password_hash`: Encrypted password from database (e.g., "$2b$12$...")
-   `bcrypt.compare()`: Encrypts the plain password using the same method and compares
-   Returns `true` if passwords match, `false` if they don't

**Security benefit**: Even if someone steals your database, they can't see actual passwords!

**✅ Checkpoint**: You now have a working authentication system! Users can register and login, with passwords securely encrypted.

**✅ Checkpoint**: Users now stay logged in across page refreshes and can access protected resources!

---

## ⚛️ Step 5: Create Frontend Registration Form (Build User Interface)

**Goal**: Create a working registration form that connects to your backend and test the full registration flow.

### 5.1: Create Registration Page

Create `client/src/Pages/Register.jsx`:

```jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
	// State to store form inputs
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault(); // Prevent page reload
		setMessage(""); // Clear previous messages

		// Frontend validation
		if (password !== confirmPassword) {
			setMessage("Passwords do not match");
			return;
		}

		if (password.length < 8) {
			setMessage("Password must be at least 8 characters");
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch(
				"http://localhost:5000/api/test-register",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include", // Important for sessions
					body: JSON.stringify({ email, password }),
				}
			);

			const data = await response.json();

			if (response.ok) {
				setMessage("Registration successful! Redirecting to login...");
				setTimeout(() => {
					navigate("/login"); // Redirect after 2 seconds
				}, 2000);
			} else {
				setMessage(data.message || "Registration failed");
			}
		} catch (error) {
			console.error("Registration error:", error);
			setMessage("Network error. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div
			style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}
		>
			<h2>Register</h2>

			<form onSubmit={handleSubmit}>
				<div style={{ marginBottom: "15px" }}>
					<label>Email:</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						style={{
							width: "100%",
							padding: "8px",
							marginTop: "5px",
							border: "1px solid #ccc",
							borderRadius: "4px",
						}}
					/>
				</div>

				<div style={{ marginBottom: "15px" }}>
					<label>Password:</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						style={{
							width: "100%",
							padding: "8px",
							marginTop: "5px",
							border: "1px solid #ccc",
							borderRadius: "4px",
						}}
					/>
				</div>

				<div style={{ marginBottom: "15px" }}>
					<label>Confirm Password:</label>
					<input
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
						style={{
							width: "100%",
							padding: "8px",
							marginTop: "5px",
							border: "1px solid #ccc",
							borderRadius: "4px",
						}}
					/>
				</div>

				<button
					type="submit"
					disabled={isLoading}
					style={{
						width: "100%",
						padding: "10px",
						backgroundColor: isLoading ? "#ccc" : "#007bff",
						color: "white",
						border: "none",
						borderRadius: "4px",
						cursor: isLoading ? "not-allowed" : "pointer",
					}}
				>
					{isLoading ? "Registering..." : "Register"}
				</button>
			</form>

			{message && (
				<div
					style={{
						marginTop: "15px",
						padding: "10px",
						backgroundColor: message.includes("successful")
							? "#d4edda"
							: "#f8d7da",
						color: message.includes("successful")
							? "#155724"
							: "#721c24",
						border:
							"1px solid " +
							(message.includes("successful")
								? "#c3e6cb"
								: "#f5c6cb"),
						borderRadius: "4px",
					}}
				>
					{message}
				</div>
			)}

			<p style={{ textAlign: "center", marginTop: "20px" }}>
				Already have an account? <a href="/login">Login here</a>
			</p>
		</div>
	);
}

export default Register;
```

### 5.2: Add Route for Registration Page

Update your `client/src/App.jsx` to include the register route:

```jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Register from "./Pages/Register"; // Add this import

function App() {
	return (
		<Router>
			<div className="App">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/register" element={<Register />} /> {/* Add this route */}
				</Routes>
			</div>
		</Router>
	);
}

export default App;
```

### 5.3: Test Your Registration Form

1. **Start both servers**:

    - Frontend: `npm start` in `client` folder
    - Backend: `node server.js` in `server` folder

2. **Visit registration page**: http://localhost:3000/register

3. **Test the form**:

    - Enter email: `newuser@example.com`
    - Enter password: `password123`
    - Confirm password: `password123`
    - Click Register

4. **Expected behavior**:
    - Success message appears
    - Page redirects to login after 2 seconds
    - Check your database - new user should be created

### 5.4: Understanding the Registration Flow

**Step-by-step breakdown:**

1. **User fills form**: React state (`useState`) stores form data
2. **Form submission**: `handleSubmit` prevents page reload
3. **Frontend validation**: Check passwords match, length requirements
4. **API call**: `fetch()` sends data to backend
5. **Backend processing**: Validates, hashes password, saves to database
6. **Response handling**: Show success/error message to user
7. **Redirect**: Navigate to login page on success

**Key React concepts:**

```jsx
const [email, setEmail] = useState('');
// useState hook: email = current value, setEmail = function to update it

onChange={(e) => setEmail(e.target.value)}
// Event handler: updates state when user types

credentials: 'include'
// Required for sessions/cookies to work between frontend and backend

e.preventDefault()
// Stops form from causing page reload (default browser behavior)
```

**Error handling patterns:**

```jsx
try {
	// Try to make API call
} catch (error) {
	// Handle network errors
} finally {
	// Always runs (cleanup code)
}
```

### 5.5: Common Issues and Solutions

**Form doesn't submit**: Check that `onSubmit={handleSubmit}` is on the `<form>` element, not the button.

**CORS errors**: Ensure your backend has `credentials: true` in CORS config and frontend uses `credentials: 'include'`.

**Network errors**: Check that backend server is running on port 5000.

**✅ Checkpoint**: You now have a working registration form that validates input, communicates with your backend, and provides user feedback!
const pool = mysql.createPool({
host: "localhost",
user: "root",
password: "", // Your MySQL password
database: "express_test",
connectionLimit: 10, // Maximum 10 concurrent connections
waitForConnections: true,
queueLimit: 0,
});

// Test the connection
pool.getConnection((err, connection) => {
if (err) {
console.error("Error connecting to the database:", err);
return;
} else {
console.log("SQL connection started successfully");
connection.release(); // Always release connections back to pool
}
});

// User registration function
async function RegisterUser(email, password) {
// Check if email already exists
const [existingUsers] = await pool
.promise()
.execute("SELECT \* FROM users WHERE email = ?", [email]);

    if (existingUsers.length > 0) {
    	const err = new Error("Email already in use");
    	err.statusCode = 400;
    	throw err;
    }

    // Hash password with salt rounds (10 is good balance of security vs performance)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into database
    const [result] = await pool
    	.promise()
    	.execute("INSERT INTO users (email, password_hash) VALUES (?, ?)", [
    		email,
    		hashedPassword,
    	]);

    return result;

}

// User login function
async function LoginUser(email, password, res, req) {
// Find user by email
const [existingUsers] = await pool
.promise()
.execute("SELECT \* FROM users WHERE email = ?", [email]);

    if (existingUsers.length < 1) {
    	return res.status(400).json({ message: "Email does not exist." });
    }

    const hashedPassword = existingUsers[0].password_hash;
    if (!hashedPassword) {
    	return res.status(500).json({ message: "Password error." });
    }

    // Compare provided password with stored hash
    const valid = await bcrypt.compare(password, hashedPassword);

    if (!valid) {
    	return res.status(401).json({ message: "Incorrect password." });
    }

    // Store user ID in session
    req.session.userId = existingUsers[0].id;
    res.status(200).json({ message: "Login successful." });

}

// Check if user is logged in
async function isLoggedIn(req, res) {
if (req.session && req.session.userId) {
res.status(200).json({ loggedIn: true, userId: req.session.userId });
} else {
res.status(200).json({ loggedIn: false });
}
}

module.exports = {
LoginUser,
RegisterUser,
isLoggedIn,
};

````

**JavaScript Syntax Breakdown for Beginners:**

**1. Import Statements:**

```javascript
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
````

-   `const`: Creates a constant variable (can't be changed later)
-   `require()`: Imports code from other files or packages
-   `"mysql2"`: The name of the package we installed with npm

**2. Object Creation:**

```javascript
const pool = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "",
	database: "express_test",
	connectionLimit: 10,
	waitForConnections: true,
	queueLimit: 0,
});
```

-   `mysql.createPool()`: Calls a function from the mysql2 package
-   `{}`: Creates an object with key-value pairs
-   `"localhost"`: String value (text in quotes)
-   `10`: Number value (no quotes)
-   `true`/`false`: Boolean values (true or false)

**3. Callback Functions:**

```javascript
pool.getConnection((err, connection) => {
	if (err) {
		console.error("Error connecting to the database:", err);
		return;
	} else {
		console.log("SQL connection started successfully");
		connection.release();
	}
});
```

-   `(err, connection) => {}`: Arrow function syntax (modern JavaScript)
-   `err`: First parameter - error object if something went wrong
-   `connection`: Second parameter - the database connection if successful
-   `if (err)`: Conditional statement - runs if there's an error
-   `return`: Exits the function early
-   `connection.release()`: Returns the connection to the pool for reuse

**4. Async/Await Functions:**

```javascript
async function RegisterUser(email, password) {
	const [existingUsers] = await pool
		.promise()
		.execute("SELECT * FROM users WHERE email = ?", [email]);
}
```

-   `async function`: Declares a function that can wait for other operations
-   `await`: Pauses function execution until the promise completes
-   `pool.promise()`: Converts callback-based function to promise-based
-   `[existingUsers]`: Destructuring assignment - extracts first element from array
-   `?`: Placeholder in SQL query (prevents SQL injection)
-   `[email]`: Array containing values to replace placeholders

**5. Error Handling:**

```javascript
if (existingUsers.length > 0) {
	const err = new Error("Email already in use");
	err.statusCode = 400;
	throw err;
}
```

-   `existingUsers.length`: Gets the number of items in the array
-   `> 0`: Comparison operator (greater than zero)
-   `new Error()`: Creates a new error object
-   `err.statusCode = 400`: Adds a custom property to the error
-   `throw err`: Throws the error (stops execution, goes to catch block)

**6. Password Hashing:**

```javascript
const hashedPassword = await bcrypt.hash(password, 10);
```

-   `bcrypt.hash()`: Function that encrypts passwords
-   `password`: The plain text password to encrypt
-   `10`: Salt rounds (how many times to apply the encryption algorithm)
-   Higher numbers = more secure but slower

**7. Database Operations:**

```javascript
const [result] = await pool
	.promise()
	.execute("INSERT INTO users (email, password_hash) VALUES (?, ?)", [
		email,
		hashedPassword,
	]);
```

-   `INSERT INTO`: SQL command to add a new row
-   `VALUES (?, ?)`: Placeholders for the values we want to insert
-   `[email, hashedPassword]`: Array of values to insert (replaces the ? placeholders)

**8. Module Exports:**

```javascript
module.exports = {
	LoginUser,
	RegisterUser,
	isLoggedIn,
};
```

-   `module.exports`: Makes functions available to other files
-   `{}`: Object containing the functions we want to export
-   `LoginUser`: Shorthand for `LoginUser: LoginUser` (key and value have same name)

**Key Concepts Explained:**

1. **Connection Pooling**: Instead of creating a new database connection for each request, we maintain a pool of reusable connections. This is much more efficient.

2. **Password Hashing**: We never store plain text passwords. `bcrypt.hash()` creates a one-way encrypted version that can't be reversed.

3. **Salt Rounds**: The number `10` in `bcrypt.hash(password, 10)` determines how secure (and slow) the hashing is. Higher = more secure but slower.

4. **Parameterized Queries**: Using `?` placeholders prevents SQL injection attacks.

5. **Sessions**: We store the user's ID in `req.session.userId` to remember they're logged in.

### Enhanced Server Configuration

Update your `server/server.js`:

```javascript
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const db = require("./db");

const app = express();

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
	session({
		secret: "SuperSecretKey", // Change this to a random string in production
		resave: false, // Don't save session if unmodified
		saveUninitialized: false, // Don't create session until something stored
		cookie: {
			httpOnly: true, // Prevent XSS attacks
			maxAge: 1000 * 60 * 60 * 2, // 2 hours
			secure: false, // Set to true in production with HTTPS
		},
	})
);

// CORS configuration for frontend communication
app.use(
	cors({
		origin: "http://localhost:3000", // Your frontend URL
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		credentials: true, // Allow cookies/sessions
	})
);

// Basic API endpoint
app.get("/api", (req, res) => {
	res.json({ message: "API is working!" });
});

// User registration endpoint
app.post("/api/register", async (req, res) => {
	const { email, password } = req.body;

	// Basic validation
	if (!email || !password) {
		return res.status(400).json({ message: "Email and password required" });
	}

	if (password.length < 6) {
		return res
			.status(400)
			.json({ message: "Password must be at least 6 characters" });
	}

	try {
		const result = await db.RegisterUser(email, password);
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

// User login endpoint
app.post("/api/login", async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ message: "Email and password required" });
	}

	try {
		await db.LoginUser(email, password, res, req);
	} catch (error) {
		console.error("Error during login:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

// User logout endpoint
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

// Check authentication status
app.post("/api/authcheck", async (req, res) => {
	try {
		await db.isLoggedIn(req, res);
	} catch (error) {
		console.error("Error checking auth status:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
```

**Session Security Explained:**

-   `httpOnly: true`: Prevents JavaScript from accessing the session cookie (XSS protection)
-   `secure: false`: Set to `true` in production when using HTTPS
-   `maxAge`: How long the session lasts (2 hours in this example)
-   `secret`: Used to sign the session ID (use environment variable in production)

---

## ⚛️ Part 3: Frontend Authentication System

### Authentication Context (Global State Management)

Create `client/src/contexts/AuthContext.jsx`:

```jsx
import { createContext, useContext, useEffect, useState } from "react";

// Create context for authentication state
const AuthContext = createContext();

// Provider component that wraps your app
export function AuthProvider({ children }) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [loading, setLoading] = useState(true);

	// Function to check authentication status with server
	const checkAuthStatus = () => {
		return fetch("/api/authcheck", {
			method: "POST",
			credentials: "include", // Include cookies/session
		})
			.then((res) => res.json())
			.then((data) => setIsLoggedIn(data.loggedIn))
			.catch(() => setIsLoggedIn(false));
	};

	// Check auth status when app loads
	useEffect(() => {
		checkAuthStatus().finally(() => setLoading(false));
	}, []);

	return (
		<AuthContext.Provider
			value={{ isLoggedIn, setIsLoggedIn, loading, checkAuthStatus }}
		>
			{children}
		</AuthContext.Provider>
	);
}

// Custom hook to use auth context
export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
```

**React Syntax Breakdown for Beginners:**

**1. Import Statement:**

```jsx
import { createContext, useContext, useEffect, useState } from "react";
```

-   `import { }`: Destructuring import - gets specific functions from React
-   `createContext`: Function to create a new React context
-   `useContext, useEffect, useState`: React hooks for managing state and side effects

**2. Creating Context:**

```jsx
const AuthContext = createContext();
```

-   `createContext()`: Creates a new context with undefined default value
-   Context allows sharing data between components without passing props down manually

**3. Component with Props:**

```jsx
export function AuthProvider({ children }) {
```

-   `export function`: Creates and exports a React component
-   `{ children }`: Destructuring the props object to extract the `children` prop
-   `children`: Special prop that contains any components nested inside this component

**4. State Hooks:**

```jsx
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [loading, setLoading] = useState(true);
```

-   `useState(false)`: Creates state variable starting with `false`
-   `[isLoggedIn, setIsLoggedIn]`: Destructuring - first item is current value, second is function to update it
-   `isLoggedIn`: Current authentication status
-   `setIsLoggedIn`: Function to change authentication status

**5. Arrow Functions:**

```jsx
const checkAuthStatus = () => {
	return fetch("/api/authcheck", {
		method: "POST",
		credentials: "include",
	})
		.then((res) => res.json())
		.then((data) => setIsLoggedIn(data.loggedIn))
		.catch(() => setIsLoggedIn(false));
};
```

-   `const checkAuthStatus = () => {}`: Arrow function stored in a variable
-   `fetch()`: Browser API to make HTTP requests
-   `.then()`: Promise chain - runs when previous operation completes
-   `(res) => res.json()`: Arrow function that converts response to JSON
-   `.catch()`: Handles errors in the promise chain

**6. useEffect Hook:**

```jsx
useEffect(() => {
	checkAuthStatus().finally(() => setLoading(false));
}, []);
```

-   `useEffect()`: Hook that runs side effects (like API calls)
-   `() => {}`: Function to run
-   `[]`: Dependency array - empty means run only once when component mounts
-   `.finally()`: Runs after promise completes (whether success or error)

**7. JSX Return:**

```jsx
return (
	<AuthContext.Provider
		value={{ isLoggedIn, setIsLoggedIn, loading, checkAuthStatus }}
	>
		{children}
	</AuthContext.Provider>
);
```

-   `return ()`: Function returns JSX (HTML-like syntax)
-   `<AuthContext.Provider>`: Component that provides context to child components
-   `value={{}}`: Prop containing object with values to share
-   `{children}`: Renders any components passed as children

**8. Object Shorthand:**

```jsx
value={{ isLoggedIn, setIsLoggedIn, loading, checkAuthStatus }}
```

-   Shorthand for: `{ isLoggedIn: isLoggedIn, setIsLoggedIn: setIsLoggedIn, ... }`
-   When key and value have same name, you can write just the name once

**9. Custom Hook:**

```jsx
export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
```

-   `useContext(AuthContext)`: Gets the current context value
-   Error checking ensures hook is used correctly
-   Returns the context value so components can access auth state

**Context Pattern Benefits:**

-   **No Prop Drilling**: Don't need to pass auth state through every component
-   **Global State**: Authentication status available anywhere in your app
-   **Automatic Updates**: When auth state changes, all components re-render
-   **Clean Code**: Components only import what they need with `useAuth()`

### Enhanced App Component

Update `client/src/App.jsx`:

```jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./Components/Nav";
import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";
import About from "./Pages/About";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Logout from "./Pages/Logout";
import ForgotPassword from "./Pages/ForgotPassword";

import { AuthProvider } from "./contexts/AuthContext";

import "./App-new.css"; // import your CSS file here

function App() {
	const [message, setMessage] = useState("");
	const [messageType, setMessageType] = useState("info");

	// Auto-hide messages after 5 seconds
	React.useEffect(() => {
		if (!message) return;
		const timeout = setTimeout(() => {
			setMessage("");
			setMessageType("info");
		}, 5000);
		return () => clearTimeout(timeout);
	}, [message]);

	// Helper function to set message with type
	const setMessageWithType = (msg, type = "info") => {
		setMessage(msg);
		setMessageType(type);
	};

	return (
		<AuthProvider>
			<Router>
				<div className="main">
					<Nav />
					<div className="content">
						{/* Global message display */}
						{message && (
							<div
								className={`app-message app-message--${messageType}`}
							>
								{message}
							</div>
						)}
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/about" element={<About />} />
							<Route
								path="/login"
								element={
									<Login setMessage={setMessageWithType} />
								}
							/>
							<Route
								path="/register"
								element={
									<Register setMessage={setMessageWithType} />
								}
							/>
							<Route
								path="/logout"
								element={
									<Logout setMessage={setMessageWithType} />
								}
							/>
							<Route
								path="/forgot-password"
								element={<ForgotPassword />}
							/>
							<Route path="*" element={<NotFound />} />
						</Routes>
					</div>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;
```

### Smart Navigation Component

Update `client/src/Components/Nav.jsx`:

```jsx
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import personsvg from "url:../assets/person.svg";

function Nav() {
	const { isLoggedIn, loading } = useAuth();

	// Don't render nav until we know auth status
	if (loading) {
		return (
			<nav>
				<div>Loading...</div>
			</nav>
		);
	}

	return (
		<nav>
			<h2>
				<Link to="/">Restaurant</Link>
			</h2>
			<div id="right-nav">
				{/* Show different links based on auth status */}
				{isLoggedIn ? (
					<Link to="/logout">Logout</Link>
				) : (
					<>
						<Link to="/login">Login</Link>
						<Link to="/register">Register</Link>
					</>
				)}
				<Link to="/about">About</Link>
				<Link to="/contact">Contact</Link>
				<Link
					to="/profile"
					className="nav-profile-link"
					title="Profile"
				>
					<img
						src={personsvg}
						alt="Profile"
						className="nav-profile-icon"
					/>
				</Link>
			</div>
		</nav>
	);
}

export default Nav;
```

**Conditional Rendering**: The navigation shows different links based on whether the user is logged in or not.

---

## � Understanding the Complete Authentication Flow

Before diving deeper into code, let's understand how all the pieces work together:

### The Authentication Journey

**1. User Registration:**

```
User fills form → Frontend validates → Sends to backend → Backend checks if email exists →
Hashes password → Saves to database → Sends success response → Frontend redirects to login
```

**2. User Login:**

```
User fills form → Frontend sends credentials → Backend finds user → Compares password hash →
Creates session → Sends success response → Frontend updates auth state → User is logged in
```

**3. Staying Logged In:**

```
Browser refreshes → Frontend checks with backend → Backend checks session →
Returns login status → Frontend updates auth state → User stays logged in
```

**4. Accessing Protected Pages:**

```
User clicks protected link → Component checks auth state → If logged in: show page →
If not logged in: redirect to login
```

### Why This Architecture?

**Frontend-Backend Separation:**

-   Frontend handles user interface and experience
-   Backend handles data, security, and business logic
-   They communicate through HTTP requests (APIs)

**Sessions vs Tokens:**

-   **Sessions** (what we use): Server remembers who's logged in
-   **Tokens** (alternative): Client proves who they are with each request
-   Sessions are simpler for beginners but less scalable

**Password Security:**

-   Never store plain text passwords
-   Use bcrypt to create one-way hashes
-   Even if database is compromised, passwords are safe

---

## �📝 Part 4: Authentication Pages

### Login Page

Create `client/src/Pages/Login.jsx`:

```jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Login({ setMessage }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const { setIsLoggedIn, checkAuthStatus } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const response = await fetch("/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include", // Include cookies/session
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (response.ok) {
				setMessage("Login successful!", "success");
				setIsLoggedIn(true);
				await checkAuthStatus(); // Refresh auth state
				navigate("/"); // Redirect to home page
			} else {
				setMessage(data.message || "Login failed", "error");
			}
		} catch (error) {
			console.error("Login error:", error);
			setMessage("Network error. Please try again.", "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-container">
			<div className="auth-card">
				<h1>Welcome Back</h1>
				<p className="auth-subtitle">Sign in to your account</p>

				<form onSubmit={handleSubmit} className="auth-form">
					<div className="form-group">
						<label htmlFor="email">Email Address</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email"
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Enter your password"
							required
						/>
					</div>

					<button
						type="submit"
						className="btn btn-primary auth-submit"
						disabled={loading}
					>
						{loading ? "Signing in..." : "Sign In"}
					</button>
				</form>

				<div className="auth-links">
					<p>
						Don't have an account?{" "}
						<Link to="/register" className="auth-link">
							<span>Create one here</span>
						</Link>
					</p>
					<Link to="/forgot-password" className="auth-link">
						<span>Forgot your password?</span>
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Login;
```

**React Form Handling Breakdown for Beginners:**

**1. Component Props and Hooks:**

```jsx
function Login({ setMessage }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
```

-   `{ setMessage }`: Props destructuring - function passed from parent component
-   `useState("")`: Creates state for form fields, starting with empty strings
-   Form state is "controlled" - React manages the input values

**2. Custom Hooks and Navigation:**

```jsx
const { setIsLoggedIn, checkAuthStatus } = useAuth();
const navigate = useNavigate();
```

-   `useAuth()`: Our custom hook to access authentication context
-   `useNavigate()`: React Router hook for programmatic navigation
-   Destructuring extracts specific functions we need

**3. Form Submit Handler:**

```jsx
const handleSubmit = async (e) => {
	e.preventDefault();
	setLoading(true);
```

-   `async`: Function can use `await` for asynchronous operations
-   `e.preventDefault()`: Stops form's default behavior (page refresh)
-   `setLoading(true)`: Shows loading state to user

**4. HTTP Request with Fetch:**

```jsx
const response = await fetch("/api/login", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	credentials: "include",
	body: JSON.stringify({ email, password }),
});
```

-   `fetch()`: Browser API for making HTTP requests
-   `method: "POST"`: HTTP verb for sending data
-   `headers`: Tell server what type of data we're sending
-   `credentials: "include"`: Send cookies/sessions with request
-   `JSON.stringify()`: Convert JavaScript object to JSON string
-   `{ email, password }`: Object shorthand for `{ email: email, password: password }`

**5. Response Handling:**

```jsx
const data = await response.json();

if (response.ok) {
	setMessage("Login successful!", "success");
	setIsLoggedIn(true);
	await checkAuthStatus();
	navigate("/");
} else {
	setMessage(data.message || "Login failed", "error");
}
```

-   `response.json()`: Convert response to JavaScript object
-   `response.ok`: Boolean - true if status code 200-299
-   `||`: Logical OR operator - use first value if truthy, otherwise second
-   `navigate("/")`: Programmatically navigate to home page

**6. Error Handling:**

```jsx
try {
	// API call code
} catch (error) {
	console.error("Login error:", error);
	setMessage("Network error. Please try again.", "error");
} finally {
	setLoading(false);
}
```

-   `try/catch/finally`: Error handling structure
-   `try`: Code that might fail
-   `catch`: Runs if error occurs
-   `finally`: Always runs (success or error)

**7. Controlled Form Inputs:**

```jsx
<input
	type="email"
	id="email"
	value={email}
	onChange={(e) => setEmail(e.target.value)}
	placeholder="Enter your email"
	required
/>
```

-   `type="email"`: HTML5 input type with built-in validation
-   `value={email}`: Input value controlled by React state
-   `onChange`: Event handler that runs when user types
-   `(e) => setEmail(e.target.value)`: Arrow function that updates state
-   `e.target.value`: The current value of the input field
-   `required`: HTML attribute for client-side validation

**8. Conditional Rendering:**

```jsx
<button disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
```

-   `disabled={loading}`: Button disabled when loading is true
-   `{loading ? "A" : "B"}`: Ternary operator - if loading is true, show "A", else show "B"
-   Provides user feedback during form submission

**9. React Router Links:**

```jsx
<Link to="/register" className="auth-link">
	<span>Create one here</span>
</Link>
```

-   `<Link>`: React Router component for navigation
-   `to="/register"`: URL to navigate to
-   Prevents page refresh (single page application behavior)

**Form Best Practices Demonstrated:**

-   **Controlled inputs**: React manages all form state
-   **Validation**: Client-side (required) and server-side
-   **Loading states**: User feedback during submission
-   **Error handling**: Network errors and API errors
-   **Accessibility**: Proper labels and input types

### Registration Page

Create `client/src/Pages/Register.jsx`:

```jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register({ setMessage }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		// Client-side validation
		if (password !== confirmPassword) {
			setMessage("Passwords do not match", "error");
			setLoading(false);
			return;
		}

		if (password.length < 6) {
			setMessage("Password must be at least 6 characters", "error");
			setLoading(false);
			return;
		}

		try {
			const response = await fetch("/api/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (response.ok) {
				setMessage(
					"Registration successful! Please log in.",
					"success"
				);
				navigate("/login"); // Redirect to login page
			} else {
				setMessage(data.message || "Registration failed", "error");
			}
		} catch (error) {
			console.error("Registration error:", error);
			setMessage("Network error. Please try again.", "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-container">
			<div className="auth-card">
				<h1>Create Account</h1>
				<p className="auth-subtitle">Join us today</p>

				<form onSubmit={handleSubmit} className="auth-form">
					<div className="form-group">
						<label htmlFor="email">Email Address</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email"
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Choose a password (min 6 characters)"
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="confirmPassword">
							Confirm Password
						</label>
						<input
							type="password"
							id="confirmPassword"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder="Confirm your password"
							required
						/>
					</div>

					<button
						type="submit"
						className="btn btn-primary auth-submit"
						disabled={loading}
					>
						{loading ? "Creating Account..." : "Create Account"}
					</button>
				</form>

				<div className="auth-links">
					<p>
						Already have an account?{" "}
						<Link to="/login" className="auth-link">
							<span>Sign in here</span>
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Register;
```

### Logout Page

Create `client/src/Pages/Logout.jsx`:

```jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Logout({ setMessage }) {
	const [loggingOut, setLoggingOut] = useState(true);
	const { setIsLoggedIn, checkAuthStatus } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const performLogout = async () => {
			try {
				const response = await fetch("/api/logout", {
					method: "POST",
					credentials: "include",
				});

				const data = await response.json();

				if (response.ok) {
					setIsLoggedIn(false);
					await checkAuthStatus(); // Refresh auth state
					setMessage("Logged out successfully", "success");
				} else {
					setMessage(data.message || "Logout failed", "error");
				}
			} catch (error) {
				console.error("Logout error:", error);
				setMessage("Network error during logout", "error");
			} finally {
				setLoggingOut(false);
				// Redirect to home page after logout
				setTimeout(() => navigate("/"), 1000);
			}
		};

		performLogout();
	}, [setIsLoggedIn, checkAuthStatus, setMessage, navigate]);

	if (loggingOut) {
		return (
			<div className="auth-container">
				<div className="auth-card">
					<h1>Logging out...</h1>
					<div className="loading"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="auth-container">
			<div className="auth-card">
				<h1>Logged Out</h1>
				<p>You have been successfully logged out.</p>
				<p>Redirecting to home page...</p>
			</div>
		</div>
	);
}

export default Logout;
```

### Forgot Password Placeholder

Create `client/src/Pages/ForgotPassword.jsx`:

```jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
	const [email, setEmail] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		// TODO: Implement password reset functionality
		alert(
			"Password reset functionality will be implemented in a future update!"
		);
	};

	return (
		<div className="auth-container">
			<div className="auth-card">
				<h1>Reset Password</h1>
				<p className="auth-subtitle">
					Enter your email to receive reset instructions
				</p>

				<form onSubmit={handleSubmit} className="auth-form">
					<div className="form-group">
						<label htmlFor="email">Email Address</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email"
							required
						/>
					</div>

					<button
						type="submit"
						className="btn btn-primary auth-submit"
					>
						Send Reset Link
					</button>
				</form>

				<div className="auth-links">
					<Link to="/login" className="auth-link">
						<span>Back to Sign In</span>
					</Link>
				</div>
			</div>
		</div>
	);
}

export default ForgotPassword;
```

---

## 🔒 Part 5: Protected Routes and Advanced Features

### Creating a Protected Route Component

Create `client/src/Components/ProtectedRoute.jsx`:

```jsx
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
	const { isLoggedIn, loading } = useAuth();

	// Show loading while checking authentication
	if (loading) {
		return (
			<div className="auth-container">
				<div className="loading"></div>
			</div>
		);
	}

	// Redirect to login if not authenticated
	if (!isLoggedIn) {
		return <Navigate to="/login" replace />;
	}

	// Render protected content if authenticated
	return children;
}

export default ProtectedRoute;
```

### Enhanced Home Page with Auth-Aware Content

Update `client/src/Pages/Home.jsx`:

```jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function Home() {
	const [backendData, setBackendData] = useState(null);
	const [loading, setLoading] = useState(true);
	const { isLoggedIn } = useAuth();

	useEffect(() => {
		// Fetch data from backend
		fetch("/api")
			.then((response) => response.json())
			.then((data) => {
				setBackendData(data);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	if (loading) {
		return (
			<div>
				<h1>Welcome to Our Restaurant</h1>
				<div className="loading"></div>
			</div>
		);
	}

	return (
		<div>
			<h1>Welcome to Our Restaurant</h1>

			{isLoggedIn ? (
				<div>
					<p>Welcome back! You are currently logged in.</p>
					<div className="card">
						<h3>Member Benefits</h3>
						<ul>
							<li>Priority reservations</li>
							<li>Exclusive menu items</li>
							<li>Birthday specials</li>
							<li>Loyalty points program</li>
						</ul>
					</div>
				</div>
			) : (
				<div>
					<p>Discover our authentic cuisine and warm atmosphere.</p>
					<div className="card">
						<h3>Join Our Community</h3>
						<p>
							Create an account to unlock exclusive benefits and
							personalized experiences.
						</p>
						<div className="buttonsList">
							<a href="/register">Create Account</a>
							<a href="/login">Sign In</a>
						</div>
					</div>
				</div>
			)}

			<div className="card">
				<h3>About Our Restaurant</h3>
				<p>
					We serve traditional dishes made with fresh, locally-sourced
					ingredients. Our chefs bring decades of experience and
					passion to every plate.
				</p>
			</div>
		</div>
	);
}

export default Home;
```

### Profile Page (Protected Route Example)

Create `client/src/Pages/Profile.jsx`:

```jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function Profile() {
	const [userInfo, setUserInfo] = useState(null);
	const [loading, setLoading] = useState(true);
	const { isLoggedIn } = useAuth();

	useEffect(() => {
		// In a real app, you'd fetch user profile data here
		setTimeout(() => {
			setUserInfo({
				email: "user@example.com", // This would come from your API
				memberSince: "January 2024",
				loyaltyPoints: 150,
			});
			setLoading(false);
		}, 1000);
	}, []);

	if (loading) {
		return (
			<div>
				<h1>Profile</h1>
				<div className="loading"></div>
			</div>
		);
	}

	return (
		<div>
			<h1>Your Profile</h1>

			<div className="card">
				<h3>Account Information</h3>
				<p>
					<strong>Email:</strong> {userInfo.email}
				</p>
				<p>
					<strong>Member Since:</strong> {userInfo.memberSince}
				</p>
				<p>
					<strong>Loyalty Points:</strong> {userInfo.loyaltyPoints}
				</p>
			</div>

			<div className="card">
				<h3>Account Settings</h3>
				<div className="buttonsList">
					<a href="/change-password">Change Password</a>
					<a href="/update-profile">Update Profile</a>
					<a href="/delete-account">Delete Account</a>
				</div>
			</div>
		</div>
	);
}

export default Profile;
```

### Update App.jsx with Protected Routes

Update your routes in `App.jsx`:

```jsx
// Add this import
import ProtectedRoute from "./Components/ProtectedRoute";
import Profile from "./Pages/Profile";

// Update your Routes section
<Routes>
	<Route path="/" element={<Home />} />
	<Route path="/about" element={<About />} />
	<Route path="/login" element={<Login setMessage={setMessageWithType} />} />
	<Route
		path="/register"
		element={<Register setMessage={setMessageWithType} />}
	/>
	<Route
		path="/logout"
		element={<Logout setMessage={setMessageWithType} />}
	/>
	<Route path="/forgot-password" element={<ForgotPassword />} />
	{/* Protected Route Example */}
	<Route
		path="/profile"
		element={
			<ProtectedRoute>
				<Profile />
			</ProtectedRoute>
		}
	/>
	<Route path="*" element={<NotFound />} />
</Routes>;
```

---

## 🧠 Understanding HTTP and APIs for Beginners

Before testing your application, it's important to understand how web communication works:

### HTTP Status Codes - What Do Those Numbers Mean?

When your frontend talks to your backend, the backend responds with a status code:

```javascript
// Success codes (200s)
200 - OK (everything worked)
201 - Created (new resource was created)

// Client error codes (400s) - Something wrong with the request
400 - Bad Request (missing or invalid data)
401 - Unauthorized (wrong password)
403 - Forbidden (not allowed to access)
404 - Not Found (page/resource doesn't exist)

// Server error codes (500s) - Something wrong on the server
500 - Internal Server Error (server crashed)
503 - Service Unavailable (server overloaded)
```

**In Our Code:**

```javascript
// Success response
res.status(200).json({ message: "Login successful." });

// Error responses
res.status(400).json({ message: "Email and password required" });
res.status(401).json({ message: "Incorrect password." });
res.status(500).json({ message: "Internal server error" });
```

### How Frontend and Backend Communicate

**1. Request Structure:**

```javascript
fetch("/api/login", {
	method: "POST", // What type of action (GET, POST, PUT, DELETE)
	headers: {
		// Metadata about the request
		"Content-Type": "application/json",
	},
	credentials: "include", // Include cookies/sessions
	body: JSON.stringify({
		// The actual data being sent
		email: "user@example.com",
		password: "password123",
	}),
});
```

**2. Response Structure:**

```javascript
{
	"success": true,             // Whether operation succeeded
	"message": "Login successful.", // Human-readable message
	"userId": 123               // Additional data
}
```

### Understanding Async/Await vs Promises

**Old Way (Promises with .then()):**

```javascript
fetch("/api/login")
	.then((response) => response.json())
	.then((data) => console.log(data))
	.catch((error) => console.error(error));
```

**Modern Way (Async/Await):**

```javascript
try {
	const response = await fetch("/api/login");
	const data = await response.json();
	console.log(data);
} catch (error) {
	console.error(error);
}
```

**Why Async/Await is Better:**

-   Easier to read (looks like regular code)
-   Better error handling with try/catch
-   Can use regular if/else statements

### Sessions and Cookies Explained

**What happens when you log in:**

1. You send username/password to server
2. Server verifies credentials
3. Server creates a session (temporary record that you're logged in)
4. Server sends session ID back to browser as a cookie
5. Browser automatically includes this cookie in future requests
6. Server recognizes the session ID and knows you're logged in

**In Code:**

```javascript
// Server creates session
req.session.userId = existingUsers[0].id;

// Browser includes session automatically (because we use credentials: "include")
fetch("/api/authcheck", {
	credentials: "include", // This sends the session cookie
});

// Server checks session
if (req.session && req.session.userId) {
	// User is logged in
}
```

---

## 🚀 Part 6: Testing and Running Your Application

### Starting Your Application

1. **Start the database** (if using XAMPP, start MySQL service)

2. **Start the backend**:

```bash
cd server
npm run dev
```

3. **Start the frontend**:

```bash
cd client
npm start
```

4. **Visit** http://localhost:3000

### Testing Your Authentication Flow

#### Test Registration:

1. Go to `/register`
2. Enter email and password
3. Verify user is created in database
4. Check that you're redirected to login

#### Test Login:

1. Go to `/login`
2. Enter your credentials
3. Verify successful login message
4. Check that navigation updates (shows "Logout" instead of "Login")
5. Verify session persists after page refresh

#### Test Logout:

1. Click "Logout" in navigation
2. Verify logout message
3. Check that navigation updates
4. Verify you can't access protected routes

#### Test Protected Routes:

1. While logged out, try to visit `/profile`
2. Verify you're redirected to login
3. Log in and try again
4. Verify profile page loads

### Common Issues and Solutions

#### Database Connection Problems

**"Cannot connect to database" or "ECONNREFUSED"**:

**What it means**: Your application can't reach the MySQL database.

**How to debug**:

1. Check if MySQL is running:

    - XAMPP: Start MySQL service in control panel
    - Direct install: Check if MySQL service is running

2. Verify connection settings in `db.js`:

    ```javascript
    const pool = mysql.createPool({
    	host: "localhost", // Should be "localhost" for local development
    	user: "root", // Your MySQL username
    	password: "", // Your MySQL password (often empty for XAMPP)
    	database: "express_test", // Database must exist
    });
    ```

3. Test if database exists:
    - Open phpMyAdmin or MySQL command line
    - Check if `express_test` database exists
    - Run the schema SQL if it doesn't

**Fix**: Double-check each connection parameter matches your MySQL setup.

#### CORS (Cross-Origin) Errors

**"Access to fetch blocked by CORS policy"**:

**What it means**: Browser blocks frontend (port 3000) from talking to backend (port 5000).

**How to debug**:

1. Check browser console for exact error message
2. Verify CORS configuration in `server.js`:

    ```javascript
    app.use(
    	cors({
    		origin: "http://localhost:3000", // Must match your frontend URL
    		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    		credentials: true, // Required for sessions
    	})
    );
    ```

3. Check all fetch requests include:
    ```javascript
    fetch("/api/endpoint", {
    	credentials: "include", // This line is crucial
    	// ... rest of config
    });
    ```

**Fix**: Ensure `credentials: true` in server and `credentials: "include"` in all fetch requests.

#### Session/Authentication Issues

**"Session not persisting" or "User logged out after refresh"**:

**What it means**: Browser isn't storing or sending session cookies.

**How to debug**:

1. Open browser developer tools
2. Go to Application/Storage tab
3. Check if session cookie exists under "Cookies"
4. Verify session configuration:
    ```javascript
    app.use(
    	session({
    		secret: "SuperSecretKey",
    		resave: false,
    		saveUninitialized: false,
    		cookie: {
    			httpOnly: true,
    			maxAge: 1000 * 60 * 60 * 2, // 2 hours
    			secure: false, // Must be false in development
    		},
    	})
    );
    ```

**Fix**: Check cookie settings and ensure `secure: false` for localhost development.

#### Form Submission Problems

**"Nothing happens when I click submit" or "Form doesn't work"**:

**What it means**: Form submission isn't reaching your handleSubmit function.

**How to debug**:

1. Add console.log in your handleSubmit:

    ```javascript
    const handleSubmit = async (e) => {
    	console.log("Form submitted!", { email, password }); // Add this line
    	e.preventDefault();
    	// ... rest of function
    };
    ```

2. Check form element:

    ```jsx
    <form onSubmit={handleSubmit}>
    	{" "}
    	{/* Make sure this is present */}
    	{/* form inputs */}
    	<button type="submit">Submit</button> {/* type="submit" is important */}
    </form>
    ```

3. Check for JavaScript errors in browser console

**Fix**: Ensure `onSubmit={handleSubmit}` on form and `type="submit"` on button.

#### API Response Issues

**"Login failed" or "Incorrect password" when credentials are correct**:

**What it means**: Backend validation is failing.

**How to debug**:

1. Add logging in your backend functions:

    ```javascript
    async function LoginUser(email, password, res, req) {
    	console.log("Login attempt for:", email);

    	const [existingUsers] = await pool
    		.promise()
    		.execute("SELECT * FROM users WHERE email = ?", [email]);

    	console.log("Users found:", existingUsers.length);

    	if (existingUsers.length < 1) {
    		console.log("No user found with email:", email);
    		return res.status(400).json({ message: "Email does not exist." });
    	}

    	// ... rest of function
    }
    ```

2. Check server console output
3. Verify password hashing during registration

**Fix**: Use console.log to trace exactly where the process fails.

#### Import/Export Errors

**"Cannot use import statement outside a module" or "require is not defined"**:

**What it means**: Mixing different JavaScript module systems.

**How to debug**:

1. Check file extensions:

    - `.jsx` files: Use `import/export`
    - `.js` files: Use `require/module.exports`

2. Frontend (React) syntax:

    ```jsx
    import React from "react";
    export default MyComponent;
    ```

3. Backend (Node.js) syntax:
    ```javascript
    const express = require("express");
    module.exports = { myFunction };
    ```

**Fix**: Use appropriate syntax for frontend vs backend files.

#### Network/Connection Issues

**"Failed to fetch" or "Network error"**:

**What it means**: Frontend can't reach backend server.

**How to debug**:

1. Check if backend server is running:

    - Look for "Server running on http://localhost:5000" message
    - Try visiting http://localhost:5000/api in browser

2. Check frontend proxy configuration (if using)
3. Verify API endpoints match:

    ```javascript
    // Frontend
    fetch("/api/login", ...)

    // Backend
    app.post("/api/login", ...)  // Must match exactly
    ```

**Fix**: Ensure both servers are running and URLs match exactly.

#### State Management Issues

**"useAuth must be used within an AuthProvider"**:

**What it means**: Component trying to use auth context isn't wrapped in AuthProvider.

**How to debug**:

1. Check App.jsx structure:

    ```jsx
    return (
    	<AuthProvider>
    		{" "}
    		{/* This must wrap everything */}
    		<Router>
    			<Routes>{/* All routes here can use useAuth */}</Routes>
    		</Router>
    	</AuthProvider>
    );
    ```

2. Verify component is inside the provider tree

**Fix**: Ensure AuthProvider wraps all components that need authentication state.

---

## 🔐 Part 7: Security Best Practices

### Environment Variables

Create `server/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=express_test
SESSION_SECRET=your_very_secure_random_string_here
NODE_ENV=development
```

Install dotenv:

```bash
cd server
npm install dotenv
```

Update `server/db.js` to use environment variables:

```javascript
require("dotenv").config();

const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	connectionLimit: 10,
	waitForConnections: true,
	queueLimit: 0,
});
```

### Input Validation and Sanitization

Add validation middleware in `server/server.js`:

```javascript
// Email validation function
function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

// Enhanced registration endpoint with validation
app.post("/api/register", async (req, res) => {
	const { email, password } = req.body;

	// Validation
	if (!email || !password) {
		return res.status(400).json({ message: "Email and password required" });
	}

	if (!isValidEmail(email)) {
		return res.status(400).json({ message: "Invalid email format" });
	}

	if (password.length < 8) {
		return res.status(400).json({
			message: "Password must be at least 8 characters",
		});
	}

	// Check password complexity
	const hasUpperCase = /[A-Z]/.test(password);
	const hasLowerCase = /[a-z]/.test(password);
	const hasNumbers = /\d/.test(password);

	if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
		return res.status(400).json({
			message: "Password must contain uppercase, lowercase, and numbers",
		});
	}

	try {
		const result = await db.RegisterUser(
			email.toLowerCase().trim(),
			password
		);
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
```

### Rate Limiting

Install and configure rate limiting:

```bash
cd server
npm install express-rate-limit
```

Add to `server/server.js`:

```javascript
const rateLimit = require("express-rate-limit");

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // Limit each IP to 5 requests per windowMs
	message: {
		message: "Too many authentication attempts, please try again later.",
	},
	standardHeaders: true,
	legacyHeaders: false,
});

// Apply rate limiting to auth routes
app.use("/api/login", authLimiter);
app.use("/api/register", authLimiter);
```

**Understanding Rate Limiting**:

Rate limiting prevents brute force attacks by limiting how many requests an IP address can make:

-   `windowMs`: Time window for requests (15 minutes = 900,000 milliseconds)
-   `max`: Maximum requests per window (5 login attempts per 15 minutes)
-   `message`: Response when limit exceeded
-   `standardHeaders`: Adds rate limit info to response headers

**Why This Matters**:
Without rate limiting, attackers could try thousands of password combinations per minute. With rate limiting, they can only try 5 passwords every 15 minutes, making attacks impractical.

### Additional Security Measures

**1. HTTPS in Production**

Never use HTTP in production - all data including passwords travel in plain text:

```javascript
// Force HTTPS in production
if (process.env.NODE_ENV === "production") {
	app.use((req, res, next) => {
		if (req.header("x-forwarded-proto") !== "https") {
			res.redirect(`https://${req.header("host")}${req.url}`);
		} else {
			next();
		}
	});
}
```

**2. Security Headers with Helmet**

Install security middleware:

```bash
cd server
npm install helmet
```

Add to `server/server.js`:

```javascript
const helmet = require("helmet");

// Add security headers
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				styleSrc: ["'self'", "'unsafe-inline'"],
			},
		},
	})
);
```

**What Helmet Does**:

-   Prevents clickjacking attacks
-   Blocks MIME type sniffing
-   Adds XSS protection headers
-   Forces HTTPS connections
-   Sets secure content security policies

**3. Session Security Enhancements**

Update your session configuration for maximum security:

```javascript
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true, // Prevents JavaScript access to cookies
			maxAge: 1000 * 60 * 60 * 2, // 2 hour expiration
			secure: process.env.NODE_ENV === "production", // HTTPS only in production
			sameSite: "strict", // CSRF protection
		},
		name: "sessionId", // Don't use default session name
	})
);
```

**Security Explanations**:

-   `httpOnly`: Prevents malicious JavaScript from stealing session cookies
-   `secure`: Only sends cookies over encrypted HTTPS connections
-   `sameSite`: Prevents cross-site request forgery (CSRF) attacks
-   Custom `name`: Obscures that you're using Express sessions

**4. Input Sanitization**

Always sanitize user input to prevent injection attacks:

```javascript
function sanitizeInput(input) {
	if (typeof input !== "string") return input;

	return input
		.trim() // Remove whitespace
		.replace(/[<>]/g, "") // Remove potential HTML tags
		.substring(0, 255); // Limit length
}

// Use in your routes
app.post("/api/login", async (req, res) => {
	const email = sanitizeInput(req.body.email);
	const password = req.body.password; // Don't modify passwords

	// ... rest of login logic
});
```

**5. Error Handling Security**

Never expose sensitive information in error messages:

```javascript
// ❌ Bad - exposes database structure
catch (error) {
    res.status(500).json({ message: error.message });
}

// ✅ Good - logs details privately, sends generic message
catch (error) {
    console.error("Database error:", error);  // For developers
    res.status(500).json({
        message: "An error occurred. Please try again."
    });  // For users
}
```

**6. Password Security Best Practices**

Enhance password requirements:

```javascript
function validatePassword(password) {
	const errors = [];

	if (password.length < 8) {
		errors.push("Password must be at least 8 characters long");
	}

	if (!/[A-Z]/.test(password)) {
		errors.push("Password must contain at least one uppercase letter");
	}

	if (!/[a-z]/.test(password)) {
		errors.push("Password must contain at least one lowercase letter");
	}

	if (!/\d/.test(password)) {
		errors.push("Password must contain at least one number");
	}

	if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
		errors.push("Password should contain a special character");
	}

	// Check for common passwords
	const commonPasswords = ["password", "123456", "qwerty", "admin"];
	if (commonPasswords.includes(password.toLowerCase())) {
		errors.push("Password is too common");
	}

	return errors;
}
```

**7. Environment Security**

Secure your environment variables:

```javascript
// Check for required environment variables on startup
const requiredEnvVars = [
	"DB_HOST",
	"DB_USER",
	"DB_PASSWORD",
	"DB_NAME",
	"SESSION_SECRET",
];

requiredEnvVars.forEach((envVar) => {
	if (!process.env[envVar]) {
		console.error(`Missing required environment variable: ${envVar}`);
		process.exit(1);
	}
});

// Validate session secret strength
if (process.env.SESSION_SECRET.length < 32) {
	console.error("SESSION_SECRET should be at least 32 characters long");
	process.exit(1);
}
```

**8. Regular Security Maintenance**

```bash
# Check for security vulnerabilities
npm audit

# Fix automatically when possible
npm audit fix

# Keep dependencies updated
npm update

# Check for outdated packages
npm outdated
```

---

## 📊 Part 8: Monitoring and Debugging

### Logging System

Create `server/logger.js`:

```javascript
const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "logs", "app.log");

// Ensure logs directory exists
if (!fs.existsSync(path.dirname(logFile))) {
	fs.mkdirSync(path.dirname(logFile), { recursive: true });
}

function log(level, message, data = null) {
	const timestamp = new Date().toISOString();
	const logEntry = {
		timestamp,
		level,
		message,
		data,
	};

	// Console output
	console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
	if (data) console.log(data);

	// File output
	fs.appendFileSync(logFile, JSON.stringify(logEntry) + "\n");
}

module.exports = {
	info: (message, data) => log("info", message, data),
	error: (message, data) => log("error", message, data),
	warn: (message, data) => log("warn", message, data),
	debug: (message, data) => log("debug", message, data),
};
```

Use logging in your routes:

```javascript
const logger = require("./logger");

app.post("/api/login", async (req, res) => {
	const { email } = req.body;

	logger.info("Login attempt", { email, ip: req.ip });

	try {
		await db.LoginUser(email, password, res, req);
		logger.info("Login successful", { email });
	} catch (error) {
		logger.error("Login failed", { email, error: error.message });
		res.status(500).json({ message: "Internal server error" });
	}
});
```

### Frontend Error Handling

Create `client/src/utils/errorHandler.js`:

```javascript
export function handleApiError(error, setMessage) {
	console.error("API Error:", error);

	if (error.name === "TypeError" && error.message.includes("fetch")) {
		setMessage("Network error. Please check your connection.", "error");
	} else if (error.response) {
		setMessage(error.response.data?.message || "Server error", "error");
	} else {
		setMessage("An unexpected error occurred", "error");
	}
}
```

---

## 🚀 Part 9: Production Deployment Considerations

### Production Environment Variables

Create `server/.env.production`:

```env
NODE_ENV=production
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_secure_production_password
DB_NAME=your_production_db_name
SESSION_SECRET=your_very_secure_random_production_string
```

### Production Server Configuration

Update session configuration for production:

```javascript
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24, // 24 hours in production
			secure: process.env.NODE_ENV === "production", // HTTPS in production
			sameSite: "strict", // CSRF protection
		},
	})
);
```

### Build Scripts

Update `package.json` scripts:

```json
{
	"scripts": {
		"start": "node server.js",
		"dev": "nodemon server.js",
		"build": "npm run build:client && npm run build:server",
		"build:client": "cd ../client && npm run build",
		"build:server": "echo 'Server build complete'"
	}
}
```

---

## 🎯 Summary and Next Steps

### What You've Built

Congratulations! You now have a complete full-stack authentication system with:

✅ **Secure user registration** with email validation and password hashing  
✅ **Session-based authentication** with login/logout functionality  
✅ **Database integration** with MySQL for persistent user storage  
✅ **Protected routes** that require authentication  
✅ **Global authentication state** using React Context  
✅ **Professional UI** with loading states and error handling  
✅ **Security best practices** including rate limiting and input validation

### Learning Outcomes

You now understand:

-   **How databases work** and how to design schemas
-   **Password security** and why we hash passwords
-   **Session management** and how servers remember users
-   **React Context** for global state management
-   **Protected routes** and conditional rendering
-   **API design** and error handling
-   **Security fundamentals** for web applications

### Next Steps to Enhance Your Application

#### Immediate Improvements:

1. **Email verification** - Send confirmation emails for new accounts
2. **Password reset** - Implement forgot password functionality
3. **User profiles** - Allow users to update their information
4. **Remember me** - Longer-lasting sessions option

#### Intermediate Features:

1. **Two-factor authentication** - Add SMS or app-based 2FA
2. **OAuth integration** - Allow login with Google/Facebook
3. **Role-based access** - Different user types (admin, user, etc.)
4. **Password strength meter** - Real-time password validation

#### Advanced Features:

1. **JWT tokens** - Stateless authentication
2. **Microservices** - Separate auth service
3. **Redis sessions** - Scalable session storage
4. **Audit logging** - Track user actions

### Learning Resources

-   **MDN Web Docs**: Comprehensive web development documentation
-   **React Documentation**: Official React learning resources
-   **Node.js Documentation**: Server-side JavaScript guides
-   **OWASP**: Web application security best practices
-   **MySQL Documentation**: Database design and optimization

### Final Tips

1. **Security First**: Always validate input and follow security best practices
2. **Test Everything**: Test happy paths and error cases
3. **User Experience**: Make authentication smooth and intuitive
4. **Documentation**: Document your code and API endpoints
5. **Stay Updated**: Keep dependencies updated for security patches

---

Remember: Building authentication systems is complex, but you've now laid a solid foundation. Each feature you add will build upon this core system, and the patterns you've learned here will apply to many other web development challenges!
