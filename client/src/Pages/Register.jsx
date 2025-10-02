import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

function Register(props) {
	const { setMessage } = props;

	const handleSubmit = async (event) => {
		event.preventDefault();
		const response = await fetch("/register", {
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
			setMessage("Successfully registered.");
		}
	};

	return (
		<div className="login">
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
