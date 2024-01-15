import React, { useRef, useState, useEffect } from "react";
import styles from "./styles/Topics.module.css";
import styles2 from "./styles/Users.module.css";
import Navbar from "../../partials/Navbar";
import {
	BiEdit,
	BiPlusCircle,
	BiSave,
	BiShow,
	BiTrash,
	BiX,
} from "react-icons/bi";
import Loading from "../../components/Loading";
import InputImage from "../../components/InputImage";
import axios from "axios";

const dummyLoad = () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(true);
		}, 3000);
	});
};

const createAdmin = async ({ username, email, passsword }) => {
	try {
		let user = await axios.post(
			process.env.REACT_APP_BACKEND_URL + "/api/register",
			{
				f_name: username,
				l_name: username,
				name: username,
				email: email,
				password: passsword,
				phone: "-",
				linkedin: "-",
				instagram: "-",
				twitter: "-",
				whatsapp: "-",
				for_admin: true,
			},
			{
				headers: {
					Authorization: localStorage.getItem("access_token"),
					"Content-Type": "multipart/form-data",
					"x-api-key": process.env.REACT_APP_BACKEND_KEY,
				},
			}
		);
		await axios.post(
			process.env.REACT_APP_BACKEND_URL + "/api/admin/admin/create",
			{
				user_id: user.data.data.id,
			},
			{
				headers: {
					Authorization: "Bearer " + localStorage.getItem("access_token"),
					"x-api-key": process.env.REACT_APP_BACKEND_KEY,
				},
			}
		);
		return {
			data: user.data,
			status: user.status,
		};
	} catch (error) {
		console.log(error);
		if (error.response.status === 401) {
			window.location.reload();
		}
		return {
			data: error.response,
			status: error.response.status,
		};
	}
};

const loadData = async () => {
	try {
		let data = await axios.get(
			process.env.REACT_APP_BACKEND_URL + "/api/admin/admins",
			{
				headers: {
					Authorization: "Bearer " + localStorage.getItem("access_token"),
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

const getDetail = async ({ userId }) => {
	try {
		let data = await axios.get(
			process.env.REACT_APP_BACKEND_URL +
				"/api/admin/user/profile?user_id=" +
				userId,
			{
				headers: {
					Authorization: "Bearer " + localStorage.getItem("access_token"),
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

const updateProfile = async ({
	userId,
	f_name,
	l_name,
	name,
	email,
	photo,
	phone,
	linkedin,
	instagram,
	twitter,
	whatsapp,
}) => {
	try {
		await axios.post(
			process.env.REACT_APP_BACKEND_URL + "/api/admin/user/update",
			{
				_method: "PUT",
				user_id: userId,
				f_name: f_name,
				l_name: l_name,
				name: name,
				email: email,
				photo: photo,
				phone: phone,
				linkedin: linkedin,
				instagram: instagram,
				twitter: twitter,
				whatsapp: whatsapp,
			},
			{
				headers: {
					Authorization: "Bearer " + localStorage.getItem("access_token"),
					"Content-Type": "multipart/form-data",
					"x-api-key": process.env.REACT_APP_BACKEND_KEY,
				},
			}
		);
		return getDetail({ userId: userId });
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

const updatePassword = async ({ userId, newPass, confirmPass }) => {
	try {
		await axios.post(
			process.env.REACT_APP_BACKEND_URL + "/api/admin/user/update-password",
			{
				new_password: newPass,
				confirm_password: confirmPass,
				_method: "PUT",
				user_id: userId,
			},
			{
				headers: {
					Authorization: "Bearer " + localStorage.getItem("access_token"),
					"x-api-key": process.env.REACT_APP_BACKEND_KEY,
				},
			}
		);
		return getDetail({ userId: userId });
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

const deleteUser = async ({ userId }) => {
	try {
		let res = await axios.post(
			process.env.REACT_APP_BACKEND_URL + "/api/admin/user/delete",
			{
				user_id: userId,
				is_hard: true,
				_method: "DELETE",
			},
			{
				headers: {
					Authorization: "Bearer " + localStorage.getItem("access_token"),
					"x-api-key": process.env.REACT_APP_BACKEND_KEY,
				},
			}
		);
		console.log(res);
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

const Admins = ({ fnSetActive = () => {}, fnSetLoginState = () => {} }) => {
	const closePopUp = useRef();
	const closePopUpHid = useRef();
	const progOpenPopUp = useRef();
	const tableContent = useRef();

	const [isLoading, setLoading] = useState(false);
	const [alert, setAlert] = useState({
		state: false,
		content: "",
		type: "",
	});
	const [popUpState, setPopUpState] = useState("view");
	const [popUpEditPass, setPopUpeditPassState] = useState(false);
	const [defImagePp, setImagePp] = useState(null);
	const [showData, setData] = useState(null);
	const [selectedData, setSelectData] = useState(null);
	const [showPassState, setShowPass] = useState(false);

	const resetAlert = () => {
		setTimeout(() => {
			setAlert({ state: false, content: "", type: "" });
		}, 3000);
	};

	const fieldProfile = {
		fName: useRef(null),
		lName: useRef(null),
		name: useRef(null),
		email: useRef(null),
		passsword: useRef(null),
		confirmPass: useRef(null),
		photo: useRef(null),
		phone: useRef(null),
		linkedin: useRef(null),
		instagram: useRef(null),
		twitter: useRef(null),
		whatsapp: useRef(null),
	};

	const resetFormPassOnly = () => {
		try {
			fieldProfile.passsword.current.value = null;
			fieldProfile.confirmPass.current.value = null;
			setPopUpeditPassState(false);
		} catch (error) {
			console.log(error);
		}
	};

	const resetForm = () => {
		setImagePp(null);
		fieldProfile.email.current.value = null;
		fieldProfile.fName.current.value = null;
		fieldProfile.instagram.current.value = null;
		fieldProfile.lName.current.value = null;
		fieldProfile.linkedin.current.value = null;
		fieldProfile.name.current.value = null;
		fieldProfile.phone.current.value = null;
		fieldProfile.twitter.current.value = null;
		fieldProfile.whatsapp.current.value = null;
		fieldProfile.photo.current.files = null;
		fieldProfile.photo.current.value = null;
		setSelectData(null);
		resetFormPassOnly();
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (popUpState === "add") {
			return handleAdd(e);
		} else if (popUpState === "edit") {
			return handleUpdateProfile(e);
		}
	};

	const handleAdd = (e) => {
		e.preventDefault();
		if (
			!fieldProfile.name.current.value ||
			fieldProfile.name.current.value === "" ||
			!fieldProfile.email.current.value ||
			fieldProfile.email.current.value === "" ||
			!fieldProfile.passsword.current.value ||
			fieldProfile.passsword.current.value === ""
		) {
			setAlert({
				state: true,
				content: "All filed admin data must be filled",
				type: "danger",
			});
			resetAlert();
		} else {
			closePopUpHid.current.click();
			setLoading(true);
			createAdmin({
				username: fieldProfile.name.current.value,
				email: fieldProfile.email.current.value,
				passsword: fieldProfile.passsword.current.value,
			}).then((res) => {
				if (res.status === 201) {
					setData([...showData, res.data.data]);
					setAlert({
						state: true,
						content: "New admin has registered",
						type: "success",
					});
					closePopUp.current.click();
					resetForm();
				} else {
					if (res.status == 401) {
						fnSetLoginState(0);
					}
					setAlert({
						state: true,
						content: Object.values(res.data.data).toString(),
						type: "danger",
					});
					console.log(progOpenPopUp.current);
					progOpenPopUp.current.click();
				}
				setLoading(false);
				resetAlert();
			});
		}
	};

	const handleUpdateProfile = (e) => {
		e.preventDefault();
		if (
			!fieldProfile.email.current.value ||
			fieldProfile.email.current.value === "" ||
			!fieldProfile.fName.current.value ||
			fieldProfile.fName.current.value === "" ||
			!fieldProfile.instagram.current.value ||
			fieldProfile.instagram.current.value === "" ||
			!fieldProfile.lName.current.value ||
			fieldProfile.lName.current.value === "" ||
			!fieldProfile.linkedin.current.value ||
			fieldProfile.linkedin.current.value === "" ||
			!fieldProfile.name.current.value ||
			fieldProfile.name.current.value === "" ||
			!fieldProfile.phone.current.value ||
			fieldProfile.phone.current.value === "" ||
			!fieldProfile.twitter.current.value ||
			fieldProfile.twitter.current.value === "" ||
			!fieldProfile.whatsapp.current.value ||
			fieldProfile.whatsapp.current.value === ""
		) {
			setAlert({
				state: "true",
				content: "All fields are required to be filled in",
				type: "danger",
			});
			resetAlert();
		} else {
			setLoading(true);
			closePopUpHid.current.click();
			updateProfile({
				userId: selectedData,
				f_name: fieldProfile.fName.current.value,
				l_name: fieldProfile.lName.current.value,
				name: fieldProfile.name.current.value,
				email: fieldProfile.email.current.value,
				photo:
					fieldProfile.photo.current.files.length > 0
						? fieldProfile.photo.current.files[0]
						: null,
				phone: fieldProfile.phone.current.value,
				linkedin: fieldProfile.linkedin.current.value,
				instagram: fieldProfile.instagram.current.value,
				twitter: fieldProfile.twitter.current.value,
				whatsapp: fieldProfile.whatsapp.current.value,
			}).then((res) => {
				if (res.status === 200) {
					let index = 0;
					showData.forEach((data) => {
						if (data.id === selectedData) {
							showData[index] = res.data.user;
						}
						index++;
					});
					setAlert({
						state: true,
						content: "Profile has updated",
						type: "success",
					});
				} else {
					if (res.status == 401) {
						fnSetLoginState(0);
					}
					setAlert({
						state: true,
						content: Object.values(res.data.data).toString(),
						type: "danger",
					});
				}
				setLoading(false);
				progOpenPopUp.current.click();
				resetAlert();
			});
		}
	};

	const handleUpdatePasssword = () => {
		if (
			!fieldProfile.passsword.current.value ||
			fieldProfile.passsword.current.value === "" ||
			!fieldProfile.confirmPass.current.value ||
			fieldProfile.confirmPass.current.value === ""
		) {
			setAlert({
				state: true,
				content: "All field for password form must be filled",
				type: "danger",
			});
			resetAlert();
		} else {
			setLoading(true);
			closePopUpHid.current.click();
			updatePassword({
				userId: selectedData,
				newPass: fieldProfile.passsword.current.value,
				confirmPass: fieldProfile.confirmPass.current.value,
			}).then((res) => {
				if (res.status === 200) {
					let i = 0;
					showData.forEach((data) => {
						if (data.id === selectedData) {
							showData[i] = res.data.user;
						}
						i++;
					});
					setAlert({
						state: true,
						content: "Password has updated",
						type: "success",
					});
					resetFormPassOnly();
					setPopUpeditPassState(false);
					setPopUpState("view");
				} else {
					if (res.status == 401) {
						fnSetLoginState(0);
					}
					setAlert({
						state: true,
						content: Object.values(res.data.data).toString(),
						type: "danger",
					});
				}
				setLoading(false);
				progOpenPopUp.current.click();
				resetAlert();
			});
		}
	};

	const handleDelete = (userId) => {
		setLoading(true);
		deleteUser({ userId: userId }).then((res) => {
			if (res.status === 200) {
				setData(
					res.data.admins.map((admin) => {
						return admin.user;
					})
				);
				setAlert({
					state: true,
					content: "User data has removed",
					type: "success",
				});
			} else {
				if (res.status == 401) {
					fnSetLoginState(0);
				}
				setAlert({
					state: true,
					content: Object.values(res.data.data).toString(),
					type: "danger",
				});
			}
			setLoading(false);
			resetAlert();
		});
	};

	const handleView = (data) => {
		setPopUpState("view");
		setPopUpeditPassState(false);
		setImagePp(process.env.REACT_APP_BACKEND_URL + data.photo);
		fieldProfile.email.current.value = data.email;
		fieldProfile.fName.current.value = data.f_name;
		fieldProfile.instagram.current.value = data.instagram;
		fieldProfile.lName.current.value = data.l_name;
		fieldProfile.linkedin.current.value = data.linkedin;
		fieldProfile.name.current.value = data.name;
		fieldProfile.phone.current.value = data.phone;
		fieldProfile.twitter.current.value = data.twitter;
		fieldProfile.whatsapp.current.value = data.whatsapp;
		setSelectData(data.id);
	};

	const handleShowPass = () => {
		setShowPass(!showPassState);
	};

	const handleOpenEdit = () => {
		setPopUpState("edit");
	};

	const handleOpenAdd = () => {
		setPopUpState("add");
		setImagePp(null);
	};

	const handleCancel = () => {
		if (popUpState !== "add") {
			resetForm();
		}
	};

	const handleHeightContent = () => {
		try {
			let height = window.innerHeight - 365;
			tableContent.current.style.maxHeight = height + "px";
			tableContent.current.style.overflow = "auto";
			console.log(height);
			console.log(tableContent.current.style.overflow);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		handleHeightContent();
		window.addEventListener("resize", handleHeightContent);
		fnSetActive("admins");
	});

	useEffect(() => {
		if (showData === null) {
			setLoading(true);
			loadData().then((res) => {
				if (res.status === 200) {
					setData(res.data.admins.map((admin) => admin.user));
					console.log(res.data.admins.map((admin) => admin.user));
				} else {
					if (res.status == 401) {
						fnSetLoginState(2);
					}
					setData([]);
				}
				setLoading(false);
			});
		}
	}, [showData]);

	return (
		<>
			<div
				className="modal fade"
				id="exampleModalToggle"
				aria-hidden="true"
				aria-labelledby="exampleModalToggleLabel"
				tabindex="-1"
				data-bs-backdrop="static"
				data-bs-keyboard="false"
			>
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<form onSubmit={handleSubmit}>
							<div className="row m-0">
								<div className="col-12 d-flex pt-4 ps-3 pe-3 pb-1">
									<h5>Admin Profile</h5>
									{popUpState === "edit" || popUpState === "add" ? (
										<button
											className="btn btn-outline-danger rounded-pill ms-auto"
											type="submit"
										>
											<BiSave /> Save
										</button>
									) : (
										<></>
									)}
									<button
										type="button"
										className={`btn-close ms-auto ${
											popUpState === "view" ? "" : "d-none"
										}`}
										data-bs-dismiss="modal"
										aria-label="Close"
										ref={closePopUp}
										onClick={handleCancel}
									></button>
									<button
										type="button"
										className={`btn-close ms-auto d-none`}
										data-bs-dismiss="modal"
										aria-label="Close"
										ref={closePopUpHid}
									></button>
								</div>
								<div className="col-12 p-3 pb-1 bg-white rounded-3 mt-2">
									{popUpState === "view" ? (
										<div
											class="alert alert-warning d-flex"
											role="alert"
											onClick={handleOpenEdit}
										>
											<div className="my-auto">
												Click this button to edit data
											</div>
											<button
												className="btn btn-warning ms-auto pt-0 pb-0"
												type="button"
											>
												<BiEdit /> Edit
											</button>
										</div>
									) : (
										<></>
									)}
								</div>
								<div className="col-12 p-3 pb-1 bg-white rounded-3 mt-2">
									<div className="row">
										<div className="col-12">
											{alert.state ? (
												<div
													className={`alert alert-${alert.type}`}
													role="alert"
												>
													{alert.content}
												</div>
											) : (
												<></>
											)}
										</div>
										<div
											className={`col-md-6 d-flex ${
												popUpState === "add" ? "d-none" : ""
											}`}
										>
											<InputImage
												refData={fieldProfile.photo}
												defaultFile={defImagePp}
												style={{
													width: "unset",
													aspectRatio: 1 / 1,
													margin: "auto",
												}}
												required={false}
											/>
										</div>
										<div
											className={`${
												popUpState === "add" ? "col-12" : "col-md-6"
											}`}
										>
											<label className={`${styles2.FormLabel}`}>
												Email address
											</label>
											<input
												type="email"
												className="form-control mb-3"
												ref={fieldProfile.email}
											/>
											<label
												className={`${styles2.FormLabel} ${
													popUpState === "add" ? "d-none" : ""
												}`}
											>
												First name
											</label>
											<input
												type="text"
												name=""
												id=""
												className={`form-control mb-3 ${
													popUpState === "add" ? "d-none" : ""
												}`}
												ref={fieldProfile.fName}
											/>
											<label
												className={`${styles2.FormLabel} ${
													popUpState === "add" ? "d-none" : ""
												}`}
											>
												Last name
											</label>
											<input
												type="text"
												name=""
												id=""
												className={`form-control mb-3 ${
													popUpState === "add" ? "d-none" : ""
												}`}
												ref={fieldProfile.lName}
											/>
											<label className={`${styles2.FormLabel}`}>Username</label>
											<input
												type="text"
												name=""
												id=""
												className="form-control"
												ref={fieldProfile.name}
											/>
										</div>
										<div
											className={`col-12 mt-3 ${
												popUpState === "add" ? "d-none" : ""
											}`}
										>
											<label className={`${styles2.FormLabel}`}>Whatsapp</label>
											<input
												type="text"
												name=""
												id=""
												className={`form-control`}
												ref={fieldProfile.whatsapp}
											/>
										</div>
										<div
											className={`col-12 mt-3 ${
												popUpState === "add" ? "d-none" : ""
											}`}
										>
											<label className={`${styles2.FormLabel}`}>LinkedIn</label>
											<input
												type="text"
												name=""
												id=""
												className={`form-control`}
												ref={fieldProfile.linkedin}
											/>
										</div>
										<div
											className={`col-12 mt-3 ${
												popUpState === "add" ? "d-none" : ""
											}`}
										>
											<label className={`${styles2.FormLabel}`}>Twitter</label>
											<input
												type="text"
												name=""
												id=""
												className={`form-control`}
												ref={fieldProfile.twitter}
											/>
										</div>
										<div
											className={`col-12 mt-3 ${
												popUpState === "add" ? "d-none" : ""
											}`}
										>
											<label className={`${styles2.FormLabel}`}>
												Instagram
											</label>
											<input
												type="text"
												name=""
												id=""
												className={`form-control`}
												ref={fieldProfile.instagram}
											/>
										</div>
										<div
											className={`col-12 mt-3 mb-4 ${
												popUpState === "add" ? "d-none" : ""
											}`}
										>
											<label className={`${styles2.FormLabel}`}>
												Phone number
											</label>
											<input
												type="text"
												name=""
												id=""
												className={`form-control`}
												ref={fieldProfile.phone}
											/>
										</div>
									</div>
									<div className="row mt-3">
										{popUpState === "edit" || popUpState === "add" ? (
											<>
												{!popUpEditPass && popUpState !== "add" ? (
													<div className="col-12">
														<label className={`${styles2.FormLabel}`}>
															Password
														</label>
														<div className="p-2 rounded-3 border border-secondary-subtle">
															<button
																className="btn btn-primary w-100"
																onClick={() => setPopUpeditPassState(true)}
															>
																Change Password
															</button>
														</div>
													</div>
												) : (
													<></>
												)}
												{popUpEditPass || popUpState === "add" ? (
													<>
														<div className="col-12">
															<label className={`${styles2.FormLabel}`}>
																New Passsword
															</label>
															<input
																type={`${showPassState ? "text" : "password"}`}
																className="form-control"
																ref={fieldProfile.passsword}
															/>
														</div>
														<div className="col-12 mt-3">
															<label className={`${styles2.FormLabel}`}>
																Confirm Passsword
															</label>
															<input
																type={`${showPassState ? "text" : "password"}`}
																className="form-control"
																ref={fieldProfile.confirmPass}
															/>
														</div>
														<div className="col-12 mt-3">
															<div class="form-check ms-2">
																<input
																	class="form-check-input"
																	type="checkbox"
																	value=""
																	id="flexCheckDefault"
																	checked={showPassState}
																	onChange={handleShowPass}
																/>
																<label
																	class="form-check-label"
																	for="flexCheckDefault"
																>
																	Show Password
																</label>
															</div>
														</div>
														{console.log(popUpEditPass)}
														{popUpEditPass ? (
															<div className="col-12 mt-3">
																<button
																	className={`btn btn-primary w-100 ${
																		popUpEditPass ? "" : "d-none"
																	}`}
																	onClick={handleUpdatePasssword}
																>
																	Change Password
																</button>
															</div>
														) : (
															<></>
														)}
													</>
												) : (
													<></>
												)}
												<div className="col-12 mt-3 mb-3">
													<button
														className="btn btn-outline-danger w-100"
														type="button"
														data-bs-dismiss="modal"
														aria-label="Close"
														onClick={handleCancel}
													>
														Cancel
													</button>
												</div>
											</>
										) : (
											<></>
										)}
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
			<div className={`row ps-4 pe-4 pt-2 pb-2 ${styles.MainContainer}`}>
				<div className="col-12 mb-3 d-flex">
					<h5>Admins</h5>
				</div>
				<button
					className="btn btn-primary w-100 rounded-pill text-white d-none"
					data-bs-target="#exampleModalToggle"
					data-bs-toggle="modal"
					ref={progOpenPopUp}
				></button>
				{isLoading ? (
					<Loading />
				) : (
					<>
						{alert.state ? (
							<div className={`alert alert-${alert.type}`} role="alert">
								{alert.content}
							</div>
						) : (
							<></>
						)}

						<div className="col-12 p-3 bg-white rounded-3">
							<table className="table table-striped rounded-3">
								<thead>
									<tr>
										<th scope="col" style={{ width: "40%" }}>
											Username
										</th>
										<th scope="col" style={{ width: "40%" }}>
											Email
										</th>
										<th scope="col" className="text-center">
											Action
										</th>
									</tr>
								</thead>
							</table>
							<div ref={tableContent}>
								<table className="table table-striped rounded-3">
									<thead>
										<tr>
											<th scope="col" style={{ width: "40%" }}></th>
											<th scope="col" style={{ width: "40%" }}></th>
											<th scope="col" className="text-center"></th>
										</tr>
									</thead>
									<tbody>
										{showData &&
											showData.map((data) => {
												return (
													<tr>
														<td>{data.name}</td>
														<td>{data.email}</td>
														<td className="d-flex">
															<button
																className="btn btn-warning ms-auto"
																data-bs-target="#exampleModalToggle"
																data-bs-toggle="modal"
																onClick={() => {
																	handleView(data);
																}}
															>
																<BiShow /> View
															</button>
															<button
																className="btn btn-danger ms-2 me-auto"
																onClick={() => handleDelete(data.id)}
															>
																<BiTrash />
															</button>
														</td>
													</tr>
												);
											})}
									</tbody>
								</table>
							</div>
						</div>
						<div className="col-12 p-3 bg-white rounded-3 mt-2">
							<button
								className="btn btn-primary w-100 rounded-pill text-white"
								data-bs-target="#exampleModalToggle"
								data-bs-toggle="modal"
								onClick={handleOpenAdd}
							>
								<BiPlusCircle /> Add Admin
							</button>
						</div>
					</>
				)}
			</div>
		</>
	);
};

export default Admins;
