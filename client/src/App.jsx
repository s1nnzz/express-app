import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./Components/Nav";
import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";
import About from "./Pages/About";
// import Contact from "./Pages/Contact";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Logout from "./Pages/Logout";
import ForgotPassword from "./Pages/ForgotPassword";
import Reset from "./Pages/Reset";

import { AuthProvider } from "./contexts/AuthContext";

import "./App-new.css";

function App() {
	const [message, setMessage] = useState("");
	const [messageType, setMessageType] = useState("info"); // success, error, warning, info

	React.useEffect(() => {
		if (!message) return;
		const timeout = setTimeout(() => {
			setMessage("");
			setMessageType("info");
		}, 5000);
		return () => clearTimeout(timeout);
	}, [message]);

	// Helper function to set message with type
	const setMessageWithType = (msg, type = "info") => {
		setMessage(msg);
		setMessageType(type);
	};

	const [isLoggedIn, setIsLoggedIn] = useState(false);
	React.useEffect(() => {
		fetch("/api/authcheck", {
			method: "POST",
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.loggedIn) {
					console.log("You are logged in as user id: " + data.userId);
					setIsLoggedIn(true);
				} else {
					setIsLoggedIn(false);
				}
			})
			.catch(() => setIsLoggedIn(false));
	}, []);

	React.useEffect(() => {
		if (message !== "") {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	}, [message, setMessage]);

	return (
		<AuthProvider>
			<Router>
				<div className="main">
					<Nav isLoggedIn={isLoggedIn} />
					<div className="content">
						{message && (
							<div
								className={`app-message app-message--${messageType}`}
							>
								{message}
							</div>
						)}
						<Routes>
							<Route path="*" element={<NotFound />} />

							<Route
								path="/"
								element={
									<Home setMessage={setMessageWithType} />
								}
							/>
							<Route
								path="/about"
								element={
									<About setMessage={setMessageWithType} />
								}
							/>
							{/* <Route path="/contact" element={<Contact setMessage={setMessageWithType} />} /> */}
							<Route
								path="/login"
								element={
									<Login setMessage={setMessageWithType} />
								}
							/>
							<Route
								path="/register"
								element={
									<Register setMessage={setMessageWithType} />
								}
							/>
							<Route
								path="/logout"
								element={
									<Logout setMessage={setMessageWithType} />
								}
							/>
							<Route
								path="/forgot"
								element={
									<ForgotPassword
										setMessage={setMessageWithType}
									/>
								}
							/>
							<Route
								path="/reset"
								element={
									<Reset setMessage={setMessageWithType} />
								}
							/>
						</Routes>
					</div>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;
