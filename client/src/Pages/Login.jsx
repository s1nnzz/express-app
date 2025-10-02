import { Link } from "react-router-dom";

const handleSubmit = async (event) => {
	event.preventDefault();
	const response = await fetch("/login", {
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
};

function Login() {
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
				<button type="submit">Login</button>
			</form>
			<Link to="/register">Register if you don't have an account.</Link>
		</div>
	);
}

export default Login;
