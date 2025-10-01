import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
	const [backendData, setBackendData] = useState([{}]);

	useEffect(() => {
		fetch("/api")
			.then((response) => response.json())
			.then((data) => setBackendData(data));
	}, []);

	return (
		<div>
			<h2>T-Level Restarant</h2>
			<h3 className="tagline">Looking for something to eat?</h3>
			<h3 className="tagline">
				Look through our world-class dishes, and find something you
				enjoy.
			</h3>

			<div className="buttonsList">
				<Link to="/menu">View Menu</Link>
				<Link to="/book">Book a Table</Link>
				<Link to="/login">Want to view your bookings? Log In</Link>
			</div>
		</div>
	);
}

export default Home;
