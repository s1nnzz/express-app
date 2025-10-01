import { Link } from "react-router-dom";

function Nav() {
	return (
		<nav>
			<h2>
				<Link to="/">Restaurant</Link>
			</h2>
			<div id="right-nav">
				<Link to="/login">Login</Link>
				<Link to="/about">About</Link>
				<Link to="/contact">Contact</Link>
			</div>
		</nav>
	);
}

export default Nav;
