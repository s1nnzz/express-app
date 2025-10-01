import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./Components/Nav";
import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";
// import About from "./Pages/About";
// import Contact from "./Pages/Contact";
// import Login from "./Pages/Login";

import "./App.css";

function App() {
	return (
		<Router>
			<div className="main">
				<Nav />
				<div className="content">
					<Routes>
						<Route path="*" element={<NotFound />} />

						<Route path="/" element={<Home />} />
						{/* <Route path="/about" element={<About />} /> */}
						{/* <Route path="/contact" element={<Contact />} /> */}
						{/* <Route path="/login" element={<Login />} /> */}
					</Routes>
				</div>
			</div>
		</Router>
	);
}

export default App;
