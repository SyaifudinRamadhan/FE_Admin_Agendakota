import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/Categories.module.css";
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
			process.env.REACT_APP_BACKEND_URL + "/api/categories",
			{
				headers: {
					"x-api-key": process.env.REACT_APP_BACKEND_KEY,
				},
			}
		);
		console.log(data);
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

const addData = async ({ name, file }) => {
	try {
		let res = await axios.post(
			process.env.REACT_APP_BACKEND_URL + "/api/admin/category/create",
			{
				name: name,
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
		console.log(res);
		return await loadData();
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
		let data = await axios.post(
			process.env.REACT_APP_BACKEND_URL + "/api/admin/category/delete",
			{
				cat_id: id,
				_method: "DELETE",
			},
			{
				headers: {
					Authorization: "Bearer " + localStorage.getItem("access_token"),
					"x-api-key": process.env.REACT_APP_BACKEND_KEY,
				},
			}
		);
		console.log(data);
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

const toLeft = async ({ id }) => {
	try {
		let data = await axios.post(
			process.env.REACT_APP_BACKEND_URL + "/api/admin/category/set-prio-plus",
			{
				cat_id: id,
			},
			{
				headers: {
					Authorization: "Bearer " + localStorage.getItem("access_token"),
					"x-api-key": process.env.REACT_APP_BACKEND_KEY,
				},
			}
		);
		console.log(data);
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

const toRight = async ({ id }) => {
	try {
		let data = await axios.post(
			process.env.REACT_APP_BACKEND_URL + "/api/admin/category/set-prio-min",
			{
				cat_id: id,
			},
			{
				headers: {
					Authorization: "Bearer " + localStorage.getItem("access_token"),
					"x-api-key": process.env.REACT_APP_BACKEND_KEY,
				},
			}
		);
		console.log(data);
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

const Categories = ({ fnSetActive = () => {}, fnSetLoginState = () => {} }) => {
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
				name: catNameForm.current.value,
				file: catImgForm.current,
			}).then((res) => {
				if (res.status === 200) {
					setData(res.data.categories);
					setLoading(false);
					resetForm();
					setAlert({
						state: true,
						content: "Data category has added",
						type: "success",
					});
					resetAlert();
				} else {
					// console.log(btnAdd.current);
					console.log(res);
					setLoading(false);
					if (res.status == 401) {
						fnSetLoginState(0);
					}
					setAlert({
						state: true,
						content: Object.values(res.data.data).toString(),
						type: "danger",
					});
					// console.log(btnAdd.current);
					btnAdd.current.click();
					resetAlert();
				}
			});
		}
	};

	const handleNavRight = (id) => {
		setLoading(true);
		toRight({ id: id }).then((res) => {
			if (res.status === 202) {
				setData(res.data.data);
				setLoading(false);
				setAlert({
					state: true,
					content: "Priority data has changed",
					type: "success",
				});
				resetAlert();
			} else {
				// console.log(btnAdd.current);
				setLoading(false);
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

	const handleNavLeft = (id) => {
		setLoading(true);
		toLeft({ id: id }).then((res) => {
			if (res.status === 202) {
				setData(res.data.data);
				setLoading(false);
				setAlert({
					state: true,
					content: "Priority data has changed",
					type: "success",
				});
				resetAlert();
			} else {
				// console.log(btnAdd.current);
				setLoading(false);
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
			if (res.status === 202) {
				setData(res.data.categories);
				setLoading(false);
				setAlert({
					state: true,
					content: "Data has removed",
					type: "success",
				});
				resetAlert();
			} else {
				// console.log(btnAdd.current);
				setLoading(false);
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
		if (showData === null) {
			setLoading(true);
			loadData().then((res) => {
				setLoading(false);
				if (res.status === 200) {
					setData(res.data.categories);
				} else {
					if (res.status == 401) {
						fnSetLoginState(2);
					}
					setData([]);
				}
			});
		}
		fnSetActive("categories");
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
									Add Category
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
									placeholder="Category Name"
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
					<h5>Event Categories</h5>
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
								className={`p-3 ${styles.AddBtn}`}
								data-bs-target="#exampleModalToggle"
								data-bs-toggle="modal"
								ref={btnAdd}
							>
								<BiPlusCircle />
								<div className={`${styles.TextBtn}`}>Add Category</div>
							</div>
						</div>
						{showData !== null &&
							showData.map((cat) =>
								cat.name !== "Attraction" &&
								cat.name !== "Tour Travel (recurring)" &&
								cat.name !== "Daily Activities" ? (
									<div className="col-md-3 p-2">
										<div
											className={`${styles.ContentData} rounded-3`}
											style={{
												backgroundImage: `url('${
													process.env.REACT_APP_BACKEND_URL + cat.photo
												}')`,
											}}
										>
											<div
												className={`h-100 w-100 d-flex ${styles.Navigator}`}
												style={{ flexDirection: "column" }}
											>
												<div className="mt-3 mb-auto fw-bold w-100 text-center p-3 pt-0">
													{cat.name}
												</div>
												<div className={`d-flex w-100`}>
													<button
														className="btn text-white ms-auto fs-5"
														onClick={() => {
															handleNavLeft(cat.id);
														}}
													>
														<BiArrowToLeft />
													</button>
													<button
														className="btn text-white fs-5"
														onClick={() => {
															handleDel(cat.id);
														}}
													>
														<BiTrash />
													</button>
													<button
														className="btn text-white me-auto fs-5"
														onClick={() => {
															handleNavRight(cat.id);
														}}
													>
														<BiArrowToRight />
													</button>
												</div>
											</div>
										</div>
									</div>
								) : (
									<></>
								)
							)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Categories;
