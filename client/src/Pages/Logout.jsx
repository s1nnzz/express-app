import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import React, { useEffect } from "react";

function Logout(props) {
	const { setMessage } = props;
	const { setIsLoggedIn } = useAuth();
	let navigate = useNavigate();

	useEffect(() => {
		fetch("/api/logout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				if (data.success) {
					setIsLoggedIn(false); // Update auth state
					setMessage(data.message, "success");
					navigate("/");
				} else {
					setMessage(data.message || "Logout failed", "error");
					navigate("/");
				}
			})
			.catch((error) => {
				console.error("Logout error:", error);
				setMessage("Network error during logout", "error");
				navigate("/");
			});
	}, []);

	return <></>;
}

export default Logout;
