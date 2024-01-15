import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/Categories.module.css";
import styles2 from "./styles/FrontBanners.module.css";
import Navbar from "../../partials/Navbar";
import axios from "axios";
import {
	BiArrowBack,
	BiArrowFromLeft,
	BiArrowToBottom,
	BiArrowToLeft,
	BiArrowToRight,
	BiArrowToTop,
	BiPlusCircle,
	BiRightArrow,
	BiTrash,
} from "react-icons/bi";
import InputImage from "../../components/InputImage";
import Loading from "../../components/Loading";

const dummyLoad = () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(false);
		}, 3000);
	});
};

const loadData = async () => {
	try {
		let data = await axios.get(
			process.env.REACT_APP_BACKEND_URL + "/api/front-banners",
			{
				headers: {
					"x-api-key": process.env.REACT_APP_BACKEND_KEY,
				},
			}
		);
		return {
			data: data.data,
			status: data.status,
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

const addData = async ({ name, url, file }) => {
	try {
		console.log(name, url, file.files[0]);
		await axios.post(
			process.env.REACT_APP_BACKEND_URL + "/api/admin/fbanner/create",
			{
				name: name,
				url: url,
				banner: file.files[0],
			},
			{
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: "Bearer " + localStorage.getItem("access_token"),
					"x-api-key": process.env.REACT_APP_BACKEND_KEY,
				},
			}
		);
		return loadData();
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

const toLeft = async ({ id }) => {
	try {
		let res = await axios.post(
			process.env.REACT_APP_BACKEND_URL + "/api/admin/fbanner/set-prio-plus",
			{
				f_banner_id: id,
			},
			{
				headers: {
					Authorization: "Bearer " + localStorage.getItem("access_token"),
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

const toRight = async ({ id }) => {
	try {
		let res = await axios.post(
			process.env.REACT_APP_BACKEND_URL + "/api/admin/fbanner/set-prio-min",
			{
				f_banner_id: id,
			},
			{
				headers: {
					Authorization: "Bearer " + localStorage.getItem("access_token"),
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

const delData = async ({ id }) => {
	try {
		let res = await axios.post(
			process.env.REACT_APP_BACKEND_URL + "/api/admin/fbanner/delete",
			{
				f_banner_id: id,
				_method: "DELETE",
			},
			{
				headers: {
					Authorization: "Bearer " + localStorage.getItem("access_token"),
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

const FrontBanner = ({
	fnSetActive = () => {},
	fnSetLoginState = () => {},
}) => {
	const catImgForm = useRef();
	const catNameForm = useRef();
	const urlForm = useRef();
	const delPreview = useRef();
	const closePopUp = useRef();
	const btnAdd = useRef();

	const [alert, setAlert] = useState({ state: false, content: "", type: "" });
	const [loading, setLoading] = useState(false);
	const [showData, setData] = useState(null);

	const resetAlert = () => {
		setTimeout(() => {
			setAlert({ state: false, content: "", type: "" });
		}, 3000);
	};

	const resetForm = () => {
		catNameForm.current.value = "";
		urlForm.current.value = "";
		catImgForm.current.value = "";
		delPreview.current.click();
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (
			!catImgForm.current.value ||
			catImgForm.current.value === "" ||
			!catNameForm.current.value ||
			catNameForm.current.value === "" ||
			!urlForm.current.value ||
			urlForm.current.value === ""
		) {
			setAlert({
				state: true,
				content: "All fields are required to be filled in",
				type: "danger",
			});
			resetAlert();
		} else {
			setLoading(true);
			closePopUp.current.click();
			addData({
				name: catNameForm.current.value,
				url: urlForm.current.value,
				file: catImgForm.current,
			}).then((res) => {
				setLoading(false);
				if (res.status === 200) {
					setData(res.data.f_banners);
					resetForm();
					setAlert({
						state: true,
						content: "Data city has added",
						type: "success",
					});
					resetAlert();
				} else {
					if (res.status == 401) {
						fnSetLoginState(0);
					}
					setAlert({
						state: true,
						content: Object.values(res.data.data).toString(),
						type: "danger",
					});
					btnAdd.current.click();
					resetAlert();
				}
			});
		}
	};

	const handleNavLeft = (id) => {
		setLoading(true);
		toLeft({ id: id }).then((res) => {
			setLoading(false);
			if (res.status === 202) {
				setData(res.data.f_banners);
				setAlert({
					state: true,
					content: "Priority data has changed",
					type: "success",
				});
				resetAlert();
			} else {
				if (res.status == 401) {
					fnSetLoginState(0);
				}
				setAlert({
					state: true,
					content: Object.values(res.data.data).toString(),
					type: "danger",
				});
				resetAlert();
			}
		});
	};

	const handleNavRight = (id) => {
		setLoading(true);
		toRight({ id: id }).then((res) => {
			setLoading(false);
			if (res.status === 202) {
				setData(res.data.f_banners);
				setAlert({
					state: true,
					content: "Priority data has changed",
					type: "success",
				});
				resetAlert();
			} else {
				if (res.status == 401) {
					fnSetLoginState(0);
				}
				setAlert({
					state: true,
					content: Object.values(res.data.data).toString(),
					type: "danger",
				});
				resetAlert();
			}
		});
	};

	const handleDel = (id) => {
		setLoading(true);
		delData({ id: id }).then((res) => {
			setLoading(false);
			if (res.status === 202) {
				setData(res.data.f_banners);
				setAlert({
					state: true,
					content: "Data has removed",
					type: "success",
				});
				resetAlert();
			} else {
				if (res.status == 401) {
					fnSetLoginState(0);
				}
				setAlert({
					state: true,
					content: Object.values(res.data.data).toString(),
					type: "danger",
				});
				resetAlert();
			}
		});
	};

	useEffect(() => {
		fnSetActive("front-banners");
		if (showData === null) {
			setLoading(true);
			loadData().then((res) => {
				setLoading(false);
				if (res.status === 200) {
					setData(res.data.f_banners);
				} else {
					if (res.status == 401) {
						fnSetLoginState(2);
					}
					setData([]);
				}
			});
		}
	}, [showData]);

	return (
		<>
			{/* --- Modal popup ---- */}
			<div
				className="modal fade"
				id="exampleModalToggle"
				aria-hidden="true"
				aria-labelledby="exampleModalToggleLabel"
				tabindex="-1"
			>
				<div
					className={`modal-dialog modal-dialog-centered ${styles2.PopUpAdd}`}
				>
					<div className="modal-content">
						<form onSubmit={handleSubmit}>
							<div className="modal-header">
								<h1 className="modal-title fs-5" id="exampleModalToggleLabel">
									Add Banner
								</h1>
								<button
									type="button"
									className="btn-close"
									data-bs-dismiss="modal"
									aria-label="Close"
									ref={closePopUp}
								></button>
							</div>
							<div
								className="modal-body d-flex flex-column"
								style={{ gap: "10px" }}
							>
								{alert.state ? (
									<div className={`alert alert-${alert.type}`} role="alert">
										{alert.content}
									</div>
								) : (
									<></>
								)}
								<InputImage
									refData={catImgForm}
									refDelBtn={delPreview}
									style={{
										height: "160px",
										width: "100%",
										margin: "auto",
									}}
									required={false}
								/>
								<div className="row">
									<div className="col-md-6">
										<input
											className="form-control mt-3"
											type="text"
											id=""
											placeholder="Banner Name"
											ref={catNameForm}
											required
										/>
									</div>
									<div className="col-md-6">
										<input
											className="form-control mt-3"
											type="url"
											id=""
											placeholder="URL direction"
											ref={urlForm}
											required
										/>
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<button className="btn btn-primary w-100" type="submit">
									Save Data
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			{/* -------------------- */}
			<div className={`row ps-4 pe-4 pt-2 pb-2 ${styles.MainContainer}`}>
				<div className="col-12 mb-3">
					<h5>Front Banners</h5>
				</div>
				{alert.state ? (
					<div className={`alert alert-${alert.type}`} role="alert">
						{alert.content}
					</div>
				) : (
					<></>
				)}
				<div style={{ display: loading ? "unset" : "none" }}>
					<Loading />
				</div>
				<div
					className="col-12 mb-3"
					style={{ display: loading ? "none" : "unset" }}
				>
					<div className="row">
						<div className="col-12 p-2">
							<div
								className={`p-3 ${styles.AddBtn} ${styles2.AddBtn2}`}
								data-bs-target="#exampleModalToggle"
								data-bs-toggle="modal"
								ref={btnAdd}
							>
								<BiPlusCircle />
								<div className={`${styles.TextBtn}`}>Add Banner</div>
							</div>
						</div>
						{showData !== null &&
							showData.map((data) => (
								<div className="col-12 p-2 bg-white mb-2 mt-2 rounded-3">
									<div
										className={`mt-auto ps-3 pe-3 w-100 bg-white ${styles.Navigator} ${styles2.Navigator2}`}
									>
										<div className="pt-2 pb-2">{data.name}</div>
									</div>
									<a href={data.url}>
										<div
											className={`${styles.ContentData} ${styles2.ContentData2} rounded-3`}
											style={{
												backgroundImage: `url('${process.env.REACT_APP_BACKEND_URL}${data.photo}')`,
											}}
										></div>
									</a>
									<div
										className={`mt-auto ps-3 pe-3 w-100 bg-white ${styles.Navigator} ${styles2.Navigator2}`}
									>
										<div className="d-flex">
											<button
												className="btn ms-auto fs-5"
												onClick={() => {
													handleNavLeft(data.id);
												}}
											>
												<BiArrowToTop />
											</button>
											<button
												className="btn text-danger fs-5"
												onClick={() => {
													handleDel(data.id);
												}}
											>
												<BiTrash />
											</button>
											<button
												className="btn me-auto fs-5"
												onClick={() => {
													handleNavRight(data.id);
												}}
											>
												<BiArrowToBottom />
											</button>
										</div>
									</div>
								</div>
							))}
					</div>
				</div>
			</div>
		</>
	);
};

export default FrontBanner;
