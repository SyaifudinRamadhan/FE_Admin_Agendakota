import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/Categories.module.css";
import styles2 from "./styles/Cities.module.css";
import Navbar from "../../partials/Navbar";
import {
	BiArrowBack,
	BiArrowFromLeft,
	BiArrowToLeft,
	BiArrowToRight,
	BiPlusCircle,
	BiRightArrow,
	BiTrash,
} from "react-icons/bi";
import InputImage from "../../components/InputImage";
import Loading from "../../components/Loading";
import axios from "axios";

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
			process.env.REACT_APP_BACKEND_URL + "/api/cities",
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

const addData = async ({ city, file }) => {
	try {
		await axios.post(
			process.env.REACT_APP_BACKEND_URL + "/api/admin/city/create",
			{
				name: city,
				photo: file.files[0],
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
			process.env.REACT_APP_BACKEND_URL + "/api/admin/city/set-prio-plus",
			{
				city_id: id,
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
			process.env.REACT_APP_BACKEND_URL + "/api/admin/city/set-prio-min",
			{
				city_id: id,
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
			process.env.REACT_APP_BACKEND_URL + "/api/admin/city/delete",
			{
				city_id: id,
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

const Cities = ({ fnSetActive = () => {}, fnSetLoginState = () => {} }) => {
	const catImgForm = useRef();
	const catNameForm = useRef();
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
		delPreview.current.click();
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (
			!catImgForm.current.value ||
			catImgForm.current.value === "" ||
			!catNameForm.current.value ||
			catNameForm.current.value === ""
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
				city: catNameForm.current.value,
				file: catImgForm.current,
			}).then((res) => {
				setLoading(false);
				if (res.status === 200) {
					setData(res.data.cities);
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

	const handleLeft = (id) => {
		setLoading(true);
		toLeft({ id: id }).then((res) => {
			setLoading(false);
			if (res.status === 202) {
				setData(res.data.cities);
				setAlert({
					state: true,
					content: "Priority data has changed",
					type: "success",
				});
				resetAlert();
			} else {
				console.log(res);
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

	const handleRight = (id) => {
		setLoading(true);
		toRight({ id: id }).then((res) => {
			setLoading(false);
			if (res.status === 202) {
				setData(res.data.cities);
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
				setData(res.data.cities);
				setAlert({
					state: true,
					content: "Data has deleted",
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
		fnSetActive("cities");
		if (showData === null) {
			setLoading(true);
			loadData().then((res) => {
				setLoading(false);
				if (res.status === 200) {
					setData(res.data.cities);
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
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<form onSubmit={handleSubmit}>
							<div className="modal-header">
								<h1 className="modal-title fs-5" id="exampleModalToggleLabel">
									Add City
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
										aspectRatio: 1,
										height: "250px",
										width: "250px",
										margin: "auto",
									}}
									required={false}
								/>
								<input
									className="form-control mt-3"
									type="text"
									id=""
									placeholder="City Name"
									ref={catNameForm}
									required
								/>
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
					<h5>Cities</h5>
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
						<div className="col-md-3 p-2">
							<div
								className={`p-3 ${styles.AddBtn} ${styles2.AddBtn2}`}
								data-bs-target="#exampleModalToggle"
								data-bs-toggle="modal"
								ref={btnAdd}
							>
								<BiPlusCircle />
								<div className={`${styles.TextBtn}`}>Add City</div>
							</div>
						</div>
						{showData !== null &&
							showData.map((data) => {
								return (
									<div className="col-md-3 p-2">
										<div
											className={`${styles.ContentData} ${styles2.ContentData2} rounded-3`}
											style={{
												backgroundImage: `url('${process.env.REACT_APP_BACKEND_URL}${data.photo}')`,
											}}
										>
											<div className={`${styles2.CityName}`}>
												<div className="m-auto">{data.name}</div>
											</div>
											<div
												className={`d-flex mt-auto w-100 ${styles.Navigator} ${styles2.Navigator2}`}
											>
												<button
													className="btn text-white ms-auto fs-5"
													onClick={() => {
														handleLeft(data.id);
													}}
												>
													<BiArrowToLeft />
												</button>
												<button
													className="btn text-white fs-5"
													onClick={() => {
														handleDel(data.id);
													}}
												>
													<BiTrash />
												</button>
												<button
													className="btn text-white me-auto fs-5"
													onClick={() => {
														handleRight(data.id);
													}}
												>
													<BiArrowToRight />
												</button>
											</div>
										</div>
									</div>
								);
							})}
					</div>
				</div>
			</div>
		</>
	);
};

export default Cities;
