import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Middleware = ({ children, fnSetUserData = () => {} }, menu) => {
	const navigate = useNavigate();

	const isLoginLoad = async (accessToken) => {
		try {
			let res = await axios.post(
				process.env.REACT_APP_BACKEND_URL + "/api/is-login",
				undefined,
				{
					headers: {
						Authorization: "Bearer " + accessToken,
						"x-api-key": process.env.REACT_APP_BACKEND_KEY,
					},
				}
			);
			return {
				data: res.data,
				status: res.status,
			};
		} catch (error) {
			if (error.response === undefined) {
				return {
					data: { data: error.message },
					status: 500,
				};
			} else {
				return {
					data: error.response,
					status: error.response.status,
				};
			}
		}
	};

	useEffect(() => {
		if (
			localStorage.getItem("access_token") !== null &&
			localStorage.getItem("access_token") !== ""
		) {
			console.log(localStorage.getItem("login_state"));
			if (localStorage.getItem("login_state") != "true") {
				localStorage.setItem("login_state", "false");
				isLoginLoad(localStorage.getItem("access_token")).then((res) => {
					console.log(res);
					if (res.status !== 200) {
						localStorage.removeItem("access_token");
						localStorage.removeItem("login_state");
						navigate("/login");
					} else {
						fnSetUserData(res.data);
					}
				});
			} else {
				console.log("From login", localStorage.getItem("login_state"));
				localStorage.setItem("login_state", "false");
			}
		} else {
			try {
				localStorage.removeItem("access_token");
				localStorage.removeItem("login_state");
			} catch (error) {
				console.log(error);
			}
			navigate("/login");
		}
	}, [menu]);

	return children;
};

export default Middleware;
