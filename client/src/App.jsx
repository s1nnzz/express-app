import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./Components/Nav";
import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";
import About from "./Pages/About";
// import Contact from "./Pages/Contact";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

import "./App.css";

function App() {
	const [message, setMessage] = useState("");
	React.useEffect(() => {
		if (!message) return;
		const timeout = setTimeout(() => {
			setMessage("");
		}, 5000);
		return () => clearTimeout(timeout);
	}, [message]);

	return (
		<Router>
			<div className="main">
				<Nav />
				{message && <div className="app-message">{message}</div>}
				<div className="content">
					<Routes>
						<Route path="*" element={<NotFound />} />

						<Route
							path="/"
							element={<Home setMessage={setMessage} />}
						/>
						<Route
							path="/about"
							element={<About setMessage={setMessage} />}
						/>
						{/* <Route path="/contact" element={<Contact setMessage={setMessage} />} /> */}
						<Route
							path="/login"
							element={<Login setMessage={setMessage} />}
						/>
						<Route
							path="/register"
							element={<Register setMessage={setMessage} />}
						/>
					</Routes>
				</div>
			</div>
		</Router>
	);
}

export default App;
