import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
	const navigate = useNavigate();
	const btn = useRef();
	localStorage.clear();

	useEffect(() => {
		navigate("/login");
	});

	return (
		<>
			<a ref={btn} className="d-none" href="/login" />
		</>
	);
};

export default Logout;
