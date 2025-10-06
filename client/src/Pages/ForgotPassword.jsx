import { Link } from "react-router-dom";

function ForgotPassword() {
	return (
		<div className="auth-container">
			<div className="auth-card">
				<h1>Reset Password</h1>
				<p className="auth-subtitle">
					Password reset functionality coming soon
				</p>
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
