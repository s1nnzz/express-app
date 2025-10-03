import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Login(props) {
	const { setMessage } = props;
	const { checkAuthStatus } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();
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
		const data = await response.json();
		console.log(data);

		// Set message color based on status code
		if (response.ok) {
			setMessage(data.message, "success");
			// Update auth state after successful login
			await checkAuthStatus();
			navigate("/");
		} else {
			// Error status codes (400, 401, 500, etc.)
			setMessage(data.message, "error");
		}
	};

	return (
		<div className="login">
			<h1>Login</h1>
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
				<button type="submit">Login</button>
			</form>
			<Link to="/register">Register if you don't have an account.</Link>
		</div>
	);
}

export default Login;
