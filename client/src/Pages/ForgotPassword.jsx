import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function ForgotPassword(props) {
	const { setMessage } = props;
	const { isLoggedIn } = useAuth();
	const navigate = useNavigate();
	const [resetToken, setResetToken] = useState(null);
	const [email, setEmail] = useState("");

	useEffect(() => {
		if (isLoggedIn) {
			setMessage("You are already logged in.", "info");
			navigate("/");
		}
	}, [isLoggedIn, setMessage, navigate]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const response = await fetch("/api/forgot", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				email: event.target.email.value,
			}),
		});

		setEmail(event.target.email.value);

		const data = await response.json();
		console.log(data);

		// Set message color based on status code
		if (response.ok) {
			setMessage(data.message, "success");
			// Store the reset token to display the link
			if (data.resetToken) {
				setResetToken(data.resetToken);
			}
		} else {
			// Error status codes (400, 401, 500, etc.)
			setMessage(data.message, "error");
			setResetToken(null);
		}
	};

	return (
		<div className="auth-container">
			<div className="auth-card">
				<h1>Forgot Password</h1>
				<p className="auth-subtitle">
					Enter your email for a code to reset your password.
				</p>
				<form
					onSubmit={handleSubmit}
					className="auth-form"
					autoComplete="off"
				>
					<div className="form-group">
						<label htmlFor="email">Email Address</label>
						<input
							type="email"
							id="email"
							name="email"
							required
							autoComplete="off"
						/>
					</div>
					<button
						type="submit"
						className="btn btn-primary auth-submit"
					>
						Submit
					</button>
				</form>

				{/* Display reset link if token is available */}
				{resetToken && (
					<div className="auth-card">
						<h3>Password Reset Link</h3>
						<p className="auth-subtitle">
							Since this is a prototype, here's your password
							reset link:
						</p>
						<Link
							to={`/reset?email=${email}&token=${resetToken}`}
							className="btn btn-primary auth-submit"
						>
							Reset Your Password
						</Link>
					</div>
				)}

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
