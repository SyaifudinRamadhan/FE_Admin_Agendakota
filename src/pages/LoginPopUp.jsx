import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/Login.module.css";
import Form from "react-bootstrap/Form";
import { Alert } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import "../App.css";
import { json, useNavigate } from "react-router-dom";

const LoginPopUp = ({
	fnSetLoginState = () => {},
	fnSetUserData = () => {},
	loginState,
}) => {
	const [isLoading, setLoading] = useState(false);
	const [isFailed, setFailedState] = useState({ state: false, msg: "" });
	const [captcha, setCaptchaState] = useState(false);

	const email = useRef();
	const password = useRef();

	const navigate = useNavigate();

	const dummyLoad = () => {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(false);
			}, 3000);
		});
	};

	const loginLoad = async () => {
		try {
			let res = await axios.post(
				process.env.REACT_APP_BACKEND_URL + "/api/login",
				{
					email: email.current.value,
					password: password.current.value,
				},
				{
					headers: {
						"x-api-key": process.env.REACT_APP_BACKEND_KEY,
					},
				}
			);
			return {
				data: res.data,
				status: res.status,
			};
		} catch (error) {
			console.log(error);
			if (error.response === undefined) {
				return {
					data: { data: [error.message] },
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

	const handleSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		if (
			!email.current.value ||
			email.current.value === "" ||
			!password.current.value ||
			password.current.value === "" ||
			!captcha
		) {
			setLoading(false);
			setFailedState({ state: true, msg: "Semua field wajb diisi" });
			setTimeout(() => {
				setFailedState({ state: false, msg: "Semua field wajb diisi" });
			}, 3000);
		} else {
			loginLoad().then((res) => {
				setLoading(false);
				if (res.status === 200 && res.data.admin) {
					// redirect page
					console.log(res);
					localStorage.setItem("access_token", res.data.access_token);
					localStorage.setItem("login_state", "true");
					localStorage.setItem(
						"profile",
						JSON.stringify({
							email: res.data.data.email,
							name: res.data.data.name,
							photo: res.data.data.photo,
						})
					);
					fnSetUserData(res.data.data);
					if (loginState === 2) {
						window.location.reload();
					}
					fnSetLoginState(1);
				} else {
					setFailedState({
						state: true,
						msg: Object.values(res.data.data).toString(),
					});
					setTimeout(() => {
						setFailedState({ state: false, msg: "" });
					}, 3000);
				}
			});
		}
	};

	return (
		<div className={`m-auto p-5 pt-2 rounded-3 bg-white`}>
			<Form onSubmit={handleSubmit}>
				<Form.Group className="mb-3" controlId="formBasicEmail">
					<div className="w-100 d-flex">
						<img
							className={`${styles.LogoForm}`}
							src="/images/logo.png"
							alt=""
						/>
					</div>
				</Form.Group>
				<Form.Group className="mb-3" controlId="formBasicEmail">
					<h4 className="mb-4">Login</h4>
					{isFailed.state ? (
						<Alert variant="danger">{isFailed.msg}</Alert>
					) : (
						<></>
					)}
				</Form.Group>
				<Form.Group className="mb-3" controlId="formBasicEmail">
					<Form.Label>Email</Form.Label>
					<Form.Control ref={email} type="email" placeholder="Enter email" />
				</Form.Group>

				<Form.Group className="mb-3" controlId="formBasicPassword">
					<Form.Label>Password</Form.Label>
					<Form.Control ref={password} type="password" placeholder="Password" />
				</Form.Group>

				<div className="d-flex">
					<ReCAPTCHA
						sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY}
						onChange={(value) => {
							setCaptchaState(value);
						}}
						className="mb-3 mx-auto"
					/>
				</div>
				{isLoading ? (
					<button className="btn btn-primary w-100" disabled>
						<Spinner className={styles.LoadingBtnIcon} /> Loading ...
					</button>
				) : (
					<button className="btn btn-primary w-100">Login</button>
				)}
			</Form>
		</div>
	);
};

export default LoginPopUp;
