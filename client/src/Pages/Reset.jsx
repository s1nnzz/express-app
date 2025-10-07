import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

function Reset(props) {
	const { setMessage } = props;
	const { isLoggedIn } = useAuth();
	const navigate = useNavigate();

	const [searchParams] = useSearchParams();
	const email = searchParams.get("email");
	const token = searchParams.get("token");

	useEffect(() => {
		if (!email || !token) {
			setMessage("Invalid password reset link.", "error");
			navigate("/forgot");
		}
	}, [email, token, setMessage, navigate]);

	// check login state
	useEffect(() => {
		if (isLoggedIn) {
			setMessage("You are already logged in.", "info");
			navigate("/");
		}
	}, [isLoggedIn, setMessage, navigate]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const response = await fetch("/api/reset", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				password: event.target.password.value,
				token: token,
			}),
		});
		const data = await response.json();
		console.log(data);

		// Set message color based on status code
		if (response.ok) {
			setMessage(data.message, "success");
			// Update auth state after successful login
		} else {
			// Error status codes (400, 401, 500, etc.)
			setMessage(data.message, "error");
		}
	};

	return (
		<div className="auth-container">
			<div className="auth-card">
				<h1>Password Reset</h1>
				<p className="auth-subtitle">Resetting password for {email}.</p>
				<form onSubmit={handleSubmit} className="auth-form">
					<div className="form-group">
						<label htmlFor="email">New Password</label>
						<input
							type="password"
							id="password"
							name="password"
							required
						/>
					</div>
					<button
						type="submit"
						className="btn btn-primary auth-submit"
					>
						Submit
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

export default Reset;
