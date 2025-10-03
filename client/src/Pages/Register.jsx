import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

function Register(props) {
	const { setMessage } = props;
	const navigate = useNavigate();
	const { checkAuthStatus } = useAuth();
	const handleSubmit = async (event) => {
		event.preventDefault();
		const response = await fetch("/api/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: event.target.email.value,
				password: event.target.password.value,
			}),
		});
		const data = await response.json();
		console.log(data);
		if (data.success) {
			setMessage("Successfully registered.", "success");
			setTimeout(async () => {
				const response = await fetch("/api/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({
						email: event.target.email.value,
						password: event.target.password.value,
					}),
				});
				const data2 = await response.json();
				console.log(data2);

				// Set message color based on status code
				if (response.ok) {
					setMessage(data2.message, "success");
					// Update auth state after successful login
					await checkAuthStatus();
					navigate("/");
				} else {
					// Error status codes (400, 401, 500, etc.)
					setMessage(data2.message, "error");
				}
			}, 1000);
		} else {
			setMessage(data.message || "Registration failed", "error");
		}
	};

	return (
		<div className="login">
			<h1>Register</h1>
			<form onSubmit={handleSubmit}>
				<label>
					Email:
					<input type="email" name="email" required />
				</label>
				<br />
				<label>
					Password:
					<input type="password" name="password" required />
				</label>
				<br />
				<button type="submit">Register</button>
			</form>
			<Link to="/login">Already have an account? Login here.</Link>
		</div>
	);
}

export default Register;
