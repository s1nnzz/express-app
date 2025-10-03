import { Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

function Nav(props) {
	const { isLoggedIn } = useAuth();
	console.log("Nav component - isLoggedIn:", isLoggedIn);
	console.log("Nav component - typeof isLoggedIn:", typeof isLoggedIn);

	return (
		<nav>
			<h2>
				<Link to="/">Restaurant</Link>
			</h2>
			<div id="right-nav">
				{isLoggedIn ? (
					<Link to="/logout">Logout</Link>
				) : (
					<Link to="/login">Login</Link>
				)}
				<Link to="/about">About</Link>
				<Link to="/contact">Contact</Link>
			</div>
		</nav>
	);
}

export default Nav;
