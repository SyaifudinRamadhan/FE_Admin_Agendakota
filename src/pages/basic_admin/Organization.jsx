import React, { useRef, useState, useEffect } from "react";
import styles from "./styles/Topics.module.css";
import styles2 from "./styles/Users.module.css";
import Navbar from "../../partials/Navbar";
import {
	BiEdit,
	BiPlusCircle,
	BiReset,
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

const loadData = async () => {
	// Out key organizations
	try {
		let orgs = await axios.get(
			process.env.REACT_APP_BACKEND_URL + "/api/admin/organizations",
			{
				headers: {
					Authorization: "Bearer " + localStorage.getItem("access_token"),
					"x-api-key": process.env.REACT_APP_BACKEND_KEY,
				},
			}
		);
		return {
			data: orgs.data,
			status: orgs.status,
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

const getDetail = async ({ orgId }) => {
	// Out key organization
	try {
		let org = await axios.get(
			process.env.REACT_APP_BACKEND_URL +
				"/api/admin/organization/detail?org_id=" +
				orgId,
			{
				headers: {
					Authorization: "Bearer " + localStorage.getItem("access_token"),
					"x-api-key": process.env.REACT_APP_BACKEND_KEY,
				},
			}
		);
		return {
			data: org.data,
			status: org.status,
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

const updateOrg = async ({
	orgId,
	fData,
	type,
	name,
	photo,
	banner,
	email,
	desc,
}) => {
	// Output key organization
	try {
		await axios.post(
			process.env.REACT_APP_BACKEND_URL + "/api/admin/organization/update",
			{
				_method: "PUT",
				org_id: orgId,
				type: type,
				name: name,
				photo: photo.files.length === 0 ? null : photo.files[0],
				banner: banner.files.length === 0 ? null : banner.files[0],
				interest: fData.interest,
				email: email,
				linkedin: fData.linkedin,
				instagram: fData.instagram,
				twitter: fData.twitter,
				whatsapp: fData.whatsapp,
				website: fData.website,
				desc: desc,
			},
			{
				headers: {
					Authorization: "Bearer " + localStorage.getItem("access_token"),
					"x-api-key": process.env.REACT_APP_BACKEND_KEY,
					"Content-Type": "multipart/form-data",
				},
			}
		);
		return getDetail({ orgId: orgId });
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

const deleteOrg = async ({ orgId }) => {
	// Out key organizations
	console.log(orgId);
	try {
		await axios.post(
			process.env.REACT_APP_BACKEND_URL + "/api/admin/organization/delete",
			{
				_method: "DELETE",
				org_id: orgId,
			},
			{
				headers: {
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

const getBack = async ({ orgId }) => {
	// Out key organizations
	try {
		await axios.post(
			process.env.REACT_APP_BACKEND_URL + "/api/admin/organization/get-back",
			{
				org_id: orgId,
			},
			{
				headers: {
					Authorization: "Bearer " + localStorage.getItem("access_token"),
					"x-api-key": process.env.REACT_APP_BACKEND_KEY,
				},
			}
		);
		return getDetail({ orgId: orgId });
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

const Organization = ({
	fnSetActive = () => {},
	fnSetLoginState = () => {},
}) => {
	const closePopUp = useRef();
	const progOpenPopUp = useRef();
	const tableContent = useRef();
	const dataTable = useRef();
	const dataTable2 = useRef();

	const [isLoading, setLoading] = useState(false);
	const [alert, setAlert] = useState({
		state: false,
		content: "",
		type: "",
	});
	const [popUpState, setPopUpState] = useState("view");
	const [defImagePp, setImagePp] = useState(null);
	const [defImgBanner, setBanner] = useState(null);
	const [sectionState, setSection] = useState("registered");
	const [showData, setData] = useState(null);

	const resetAlert = () => {
		setTimeout(() => {
			setAlert({ state: false, content: "", type: "" });
		}, 3000);
	};

	const [detailValue, setDetailValue] = useState(null);

	const fieldProfile = {
		type: useRef(null),
		name: useRef(null),
		photo: useRef(null),
		banner: useRef(null),
		email: useRef(null),
		desc: useRef(null),
	};

	const handleUpdate = (e) => {
		e.preventDefault();
		if (
			!fieldProfile.name.current.value ||
			fieldProfile.name.current.value === "" ||
			!fieldProfile.email.current.value ||
			fieldProfile.email.current.value === "" ||
			!fieldProfile.type.current.value ||
			fieldProfile.type.current.value === "" ||
			!fieldProfile.desc.current.value ||
			fieldProfile.desc.current.value === ""
		) {
			setAlert({
				state: true,
				content: "All filed is required",
				type: "danger",
			});
			resetAlert();
		} else {
			closePopUp.current.click();
			setLoading(true);
			updateOrg({
				orgId: detailValue.id,
				fData: detailValue,
				type: fieldProfile.type.current.value,
				name: fieldProfile.name.current.value,
				email: fieldProfile.email.current.value,
				desc: fieldProfile.desc.current.value,
				photo: fieldProfile.photo.current,
				banner: fieldProfile.banner.current,
			}).then((res) => {
				if (res.status === 200) {
					handleView(res.data.organization);
					let i = 0;
					showData.forEach((data) => {
						if (data.id === detailValue.id) {
							showData[i] = res.data.organization;
						}
					});
					setAlert({
						state: true,
						content: "Organization data has updated",
						type: "success",
					});
				} else {
					if (res.status === 401) {
						fnSetLoginState(0);
					}
					handleView(detailValue);
					setAlert({
						state: true,
						content: Object.values(res.data.data).toString(),
						type: "danger",
					});
				}
				progOpenPopUp.current.click();
				setLoading(false);
				resetAlert();
			});
		}
	};

	const handleDelete = (orgId) => {
		setLoading(true);
		deleteOrg({ orgId: orgId }).then((res) => {
			if (res.status === 200) {
				let i = 0;
				setData(res.data.organizations);
				setAlert({
					state: true,
					content: "Organization data has updated",
					type: "success",
				});
			} else {
				if (res.status === 401) {
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

	const handleGetBack = (orgId) => {
		setLoading(true);
		getBack({ orgId: orgId }).then((res) => {
			if (res.status === 200) {
				let i = 0;
				showData.forEach((data) => {
					if (data.id === orgId) {
						showData[i] = res.data.organization;
					}
				});
				setAlert({
					state: true,
					content: "Organization data has updated",
					type: "success",
				});
			} else {
				if (res.status === 401) {
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

	const handleView = (org) => {
		setPopUpState("view");
		setImagePp(process.env.REACT_APP_BACKEND_URL + org.photo);
		setBanner(process.env.REACT_APP_BACKEND_URL + org.banner);
		setDetailValue(org);
	};

	const handleOpenEdit = () => {
		setPopUpState("edit");
	};

	const handleCancel = () => {
		setImagePp(null);
		setBanner(null);
		setDetailValue(null);
	};

	const handleHeightContent = () => {
		try {
			let height = window.innerHeight - 365;
			tableContent.current.style.maxHeight = height + "px";
			tableContent.current.style.overflow = "auto";
		} catch (error) {
			console.log(error);
		}
	};

	const mainSearch = (dataTable, key) => {
		let trs = dataTable.getElementsByTagName("tr");
		for (let i = 0; i < trs.length; i++) {
			let show = false;
			let tds = trs[i].getElementsByTagName("td");
			for (let j = 0; j < tds.length; j++) {
				if (tds[j].innerHTML.toLowerCase().includes(key)) {
					show = true;
				}
			}
			trs[i].style.display = show ? "table-row" : "none";
		}
	};

	const handleSearchReg = (e) => {
		let key = e.target.value.toLowerCase();
		mainSearch(dataTable.current, key);
	};

	const handleSearchDel = (e) => {
		let key = e.target.value.toLowerCase();
		mainSearch(dataTable2.current, key);
	};

	useEffect(() => {
		handleHeightContent();
		window.addEventListener("resize", handleHeightContent);
		fnSetActive("organizations");
	});

	useEffect(() => {
		if (showData === null) {
			setLoading(true);
			loadData().then((res) => {
				if (res.status === 200) {
					setData(res.data.organizations);
				} else {
					console.log(res);
					if (res.status === 401) {
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
			{console.log(showData)}
			<button
				className="btn btn-warning ms-auto d-none"
				data-bs-target="#exampleModalToggle"
				data-bs-toggle="modal"
				ref={progOpenPopUp}
			></button>
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
						<form onSubmit={handleUpdate}>
							<div className="row m-0">
								<div className="col-12 d-flex pt-4 ps-3 pe-3 pb-1">
									<h5>Organization Data</h5>
									{popUpState === "edit" ? (
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
									{detailValue !== null ? (
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
											<div className="col-md-6 d-flex">
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
											<div className="col-md-6">
												<label className={`${styles2.FormLabel}`}>
													Type Organization
												</label>
												<input
													type="text"
													className="form-control mb-3"
													ref={fieldProfile.type}
													defaultValue={detailValue.type}
												/>
												<label className={`${styles2.FormLabel}`}>
													Organization Name
												</label>
												<input
													type="text"
													name=""
													id=""
													className="form-control mb-3"
													ref={fieldProfile.name}
													defaultValue={detailValue.name}
												/>
												<label className={`${styles2.FormLabel}`}>Email</label>
												<input
													type="email"
													name=""
													id=""
													className="form-control mb-3"
													ref={fieldProfile.email}
													defaultValue={detailValue.email}
												/>
												<label className={`${styles2.FormLabel}`}>
													Description
												</label>
												<textarea
													cols="30"
													rows="3"
													ref={fieldProfile.desc}
													defaultValue={detailValue.desc}
													className="form-control mb-3"
												></textarea>
											</div>
											<div className="col-12 mb-4 mt-1">
												<label className="mb-3">Banner Profile : </label>
												<InputImage
													defaultFile={defImgBanner}
													refData={fieldProfile.banner}
													style={{
														width: "100%",
														height: "unset",
														aspectRatio: "5 / 2",
													}}
													required={false}
												/>
											</div>
										</div>
									) : (
										<></>
									)}
									{popUpState === "edit" ? (
										<>
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
						</form>
					</div>
				</div>
			</div>

			<div className={`row ps-4 pe-4 pt-2 pb-2 ${styles.MainContainer}`}>
				<div className="col-12 mb-3 d-flex">
					<h5>Organizations</h5>
					<div
						className="p-2 rounded-3 ms-auto"
						style={{ backgroundColor: "#ddd" }}
					>
						<button
							className={`btn ${
								sectionState === "registered" ? "bg-white" : ""
							}`}
							onClick={() => {
								setSection("registered");
							}}
						>
							Registered
						</button>
						<button
							className={`btn ${sectionState === "removed" ? "bg-white" : ""}`}
							onClick={() => setSection("removed")}
						>
							Removed
						</button>
					</div>
				</div>
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
						<section
							className={`${sectionState === "registered" ? "" : "d-none"}`}
						>
							<div className="col-12 mb-3">
								<input
									type="text"
									className="form-control"
									style={{ maxWidth: "400px" }}
									placeholder="Search with organization name or username"
									onInput={handleSearchReg}
								/>
							</div>
							<div className="col-12 p-3 bg-white rounded-3">
								<table className="table table-striped rounded-3">
									<thead>
										<tr>
											<th scope="col" style={{ width: "40%" }}>
												Organization
											</th>
											<th scope="col" style={{ width: "40%" }}>
												Username
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
										<tbody ref={dataTable}>
											{showData &&
												showData.map((org) => {
													if (org.deleted === 0) {
														return (
															<tr>
																<td>{org.name}</td>
																<td>{org.user.name}</td>
																<td>
																	<div className="d-flex w-100">
																		<button
																			className="btn btn-warning ms-auto"
																			data-bs-target="#exampleModalToggle"
																			data-bs-toggle="modal"
																			onClick={() => {
																				handleView(org);
																			}}
																		>
																			<BiShow /> View
																		</button>
																		<button
																			className="btn btn-danger ms-2 me-auto"
																			onClick={() => {
																				handleDelete(org.id);
																			}}
																		>
																			<BiTrash />
																		</button>
																	</div>
																</td>
															</tr>
														);
													}
												})}
										</tbody>
									</table>
								</div>
							</div>
						</section>
						<section
							className={`${sectionState === "removed" ? "" : "d-none"}`}
						>
							<div className="col-12 mb-3">
								<input
									type="text"
									className="form-control"
									style={{ maxWidth: "400px" }}
									placeholder="Search with organization name or username"
									onInput={handleSearchDel}
								/>
							</div>
							<div className="col-12 p-3 bg-white rounded-3">
								<table className="table table-striped rounded-3">
									<thead>
										<tr>
											<th scope="col" style={{ width: "40%" }}>
												Organization
											</th>
											<th scope="col" style={{ width: "40%" }}>
												Username
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
										<tbody ref={dataTable2}>
											{showData &&
												showData.map((org) => {
													if (org.deleted === 1) {
														return (
															<tr>
																<td>{org.name}</td>
																<td>{org.user.name}</td>
																<td>
																	<div className="d-flex w-100">
																		<button
																			className="btn btn-warning mx-auto"
																			onClick={() => {
																				handleGetBack(org.id);
																			}}
																		>
																			<BiReset /> Restore
																		</button>
																	</div>
																</td>
															</tr>
														);
													}
												})}
										</tbody>
									</table>
								</div>
							</div>
						</section>
					</>
				)}
			</div>
		</>
	);
};

export default Organization;
