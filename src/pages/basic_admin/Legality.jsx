import React, { useRef, useState, useEffect } from "react";
import styles from "./styles/Topics.module.css";
import styles2 from "./styles/Users.module.css";
import Navbar from "../../partials/Navbar";
import {
	BiCheckCircle,
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
import { redirect } from "react-router-dom";
import LegalityPopUpDetail from "./LegalityPopUpDetail";
import axios from "axios";

const dummyLoad = () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(true);
		}, 3000);
	});
};

const loadData = async () => {
	try {
		let orgs = await axios.get(
			process.env.REACT_APP_BACKEND_URL + "/api/admin/legality-datas",
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

const changeState = async ({ legalityId, status }) => {
	try {
		await axios.post(
			process.env.REACT_APP_BACKEND_URL + "/api/admin/legality-data/update",
			{
				id: legalityId,
				status: status,
				_method: "PUT",
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

const deleteData = async ({ legalityId }) => {
	try {
		await axios.post(
			process.env.REACT_APP_BACKEND_URL + "/api/admin/legality-data/delete",
			{
				id: legalityId,
				_method: "DELETE",
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

const legalityData = {
	verified: [
		{
			id: "9a26ca30-4579-48fa-99fb-7d487ac702da",
			user_id: "9a26b9cb-1e74-4cad-a23a-2b9ec5b93aa6",
			type: "test2",
			name: "Agendakota",
			slug: "test-update",
			photo: "https://i1.sndcdn.com/avatars-000225426854-qk8agf-t500x500.jpg",
			banner: "/images/JumboBackground.png",
			interest: "-",
			email: "-",
			linkedin: "-",
			instagram: "-",
			twitter: "-",
			whatsapp: "-",
			website: "-",
			desc: "lorem ipsum dolor sit amet",
			deleted: 0,
			created_at: "2023-09-17T01:25:15.000000Z",
			updated_at: "2023-09-17T01:30:44.000000Z",
			legality_data: {
				org_id: "9a26ca30-4579-48fa-99fb-7d487ac702da",
				type_legality: "comapany",
				tax_id_number: "gtdsgf7437374gr48374",
				tax_image: "/images/tax.jpg",
				company_name: "PT. Cipta Wisata Medika",
				address: "Suarabaya",
				business_entity: "PT",
				pic_name: "Syamsul Qomar",
				pic_nic: "643764857364736",
				pic_nic_image: "/images/nic.jpg",
				company_phone: "0882783374764",
				status: false,
			},
		},
	],
	unverified: [
		{
			id: "9a26ca30-4579-48fa-99fb-7d487ac702da",
			user_id: "9a26b9cb-1e74-4cad-a23a-2b9ec5b93aa6",
			type: "test2",
			name: "Agendakota",
			slug: "test-update",
			photo: "https://i1.sndcdn.com/avatars-000225426854-qk8agf-t500x500.jpg",
			banner: "/images/JumboBackground.png",
			interest: "-",
			email: "-",
			linkedin: "-",
			instagram: "-",
			twitter: "-",
			whatsapp: "-",
			website: "-",
			desc: "lorem ipsum dolor sit amet",
			deleted: 0,
			created_at: "2023-09-17T01:25:15.000000Z",
			updated_at: "2023-09-17T01:30:44.000000Z",
			legality_data: {
				org_id: "9a26ca30-4579-48fa-99fb-7d487ac702da",
				type_legality: "comapany",
				tax_id_number: "gtdsgf7437374gr48374",
				tax_image: "/images/tax.jpg",
				company_name: "PT. Cipta Wisata Medika",
				address: "Suarabaya",
				business_entity: "PT",
				pic_name: "Syamsul Qomar",
				pic_nic: "643764857364736",
				pic_nic_image: "/images/nic.jpg",
				company_phone: "0882783374764",
				status: true,
			},
		},
	],
};

const Legality = ({ fnSetActive = () => {}, fnSetLoginState = () => {} }) => {
	const closePopUp = useRef();
	const tableContent = useRef();
	const dataTable = useRef();
	const dataTable2 = useRef();

	const [isLoading, setLoading] = useState(false);
	const [alert, setAlert] = useState({
		state: false,
		content: "",
		type: "",
	});
	const [sectionState, setSection] = useState("verified");
	const [showDataVerified, setDataVerified] = useState(null);
	const [showDataUnverified, setDataUnverified] = useState(null);
	const [detailValue, setDetailValue] = useState(null);

	const resetAlert = () => {
		setTimeout(() => {
			setAlert({ state: false, content: "", type: "" });
		}, 3000);
	};

	const handleUpdate = (id, status) => {
		setLoading(true);
		changeState({ legalityId: id, status: status }).then((res) => {
			if (res.status === 200) {
				setDataVerified(res.data.verified);
				setDataUnverified(res.data.unverified);
				setAlert({
					state: true,
					content: "Legality status has changed",
					type: "success",
				});
			} else {
				if (res.status === 401) {
					fnSetLoginState(0);
					setAlert({
						state: true,
						content: Object.values(res.data.data).toString(),
						type: "danger",
					});
				}
			}
			resetAlert();
			setLoading(false);
		});
	};

	const handleDelete = (id) => {
		setLoading(false);
		deleteData({ legalityId: id }).then((res) => {
			if (res.status === 200) {
				setDataVerified(res.data.verified);
				setDataUnverified(res.data.unverified);
				setAlert({
					state: true,
					content: "Legality status has changed",
					type: "success",
				});
			} else {
				if (res.status === 401) {
					fnSetLoginState(0);
					setAlert({
						state: true,
						content: Object.values(res.data.data).toString(),
						type: "danger",
					});
				}
			}
			resetAlert();
			setLoading(false);
		});
	};

	const handleView = (org) => {
		setDetailValue(org);
	};

	const handelCancel = () => {
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

	const handleSearchVerified = (e) => {
		let key = e.target.value.toLowerCase();
		mainSearch(dataTable.current, key);
	};

	const handleSearchUnverified = (e) => {
		let key = e.target.value.toLowerCase();
		mainSearch(dataTable2.current, key);
	};

	useEffect(() => {
		handleHeightContent();
		window.addEventListener("resize", handleHeightContent);
		fnSetActive("legalities");
	});

	useEffect(() => {
		if (showDataUnverified === null && showDataVerified === null) {
			setLoading(true);
			loadData().then((res) => {
				console.log(res);
				if (res.status === 200) {
					setDataVerified(res.data.verified);
					setDataUnverified(res.data.unverified);
				} else {
					if (res.status === 401) {
						fnSetLoginState(2);
					}
					setDataVerified([]);
					setDataUnverified([]);
				}
				setLoading(false);
			});
		}
	}, [showDataUnverified, showDataVerified]);

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
				<div
					className={`modal-dialog modal-dialog-centered ${styles2.PopUpAdd}`}
				>
					<div className="modal-content">
						<div>
							<div className="row m-0">
								<div className="col-12 d-flex pt-4 ps-3 pe-3 pb-1">
									<h5>Legality Data</h5>
									<button
										type="button"
										className={`btn-close ms-auto`}
										data-bs-dismiss="modal"
										aria-label="Close"
										ref={closePopUp}
										onClick={handelCancel}
									></button>
								</div>

								<div className="col-12 p-3 pb-1 bg-white rounded-3 mt-2">
									{detailValue !== null ? (
										<LegalityPopUpDetail detailValue={detailValue} />
									) : (
										<></>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className={`row ps-4 pe-4 pt-2 pb-2 ${styles.MainContainer}`}>
				<div className="col-12 mb-3 d-flex">
					<h5>Legality Data</h5>
					<div
						className="p-2 rounded-3 ms-auto"
						style={{ backgroundColor: "#ddd" }}
					>
						<button
							className={`btn ${sectionState === "verified" ? "bg-white" : ""}`}
							onClick={() => {
								setSection("verified");
							}}
						>
							Verified
						</button>
						<button
							className={`btn ${
								sectionState === "unverified" ? "bg-white" : ""
							} position-relative`}
							onClick={() => setSection("unverified")}
						>
							Un-Verified
							{showDataUnverified &&
								(showDataUnverified.length > 0 ? (
									<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
										{showDataUnverified.length}
										<span className="visually-hidden">
											Waiting legality data
										</span>
									</span>
								) : (
									<></>
								))}
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
							className={`${sectionState === "verified" ? "" : "d-none"}`}
						>
							<div className="col-12 mb-3">
								<input
									type="text"
									className="form-control"
									style={{ maxWidth: "400px" }}
									placeholder="Search with organization name or username"
									onInput={handleSearchVerified}
								/>
							</div>
							<div className="col-12 p-3 bg-white rounded-3">
								<table className="table table-striped rounded-3">
									<thead>
										<tr>
											<th scope="col" style={{ width: "60%" }}>
												Organization
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
												<th scope="col" style={{ width: "60%" }}></th>
												<th scope="col" className="text-center"></th>
											</tr>
										</thead>
										<tbody ref={dataTable}>
											{showDataVerified &&
												showDataVerified.map((org) => {
													return (
														<tr>
															<td>{org.name}</td>
															<td>
																<div className="d-flex w-100">
																	<button
																		className="btn btn-success ms-auto"
																		data-bs-target="#exampleModalToggle"
																		data-bs-toggle="modal"
																		onClick={() => {
																			handleView(org);
																		}}
																	>
																		<BiShow /> View
																	</button>
																	<button
																		className="btn btn-warning ms-2"
																		onClick={() => {
																			handleUpdate(org.legality_data.id, false);
																		}}
																	>
																		<BiReset /> Un Approve
																	</button>
																	<button
																		className="btn btn-danger ms-2 me-auto"
																		onClick={() => {
																			handleDelete(org.legality_data.id);
																		}}
																	>
																		<BiTrash />
																	</button>
																</div>
															</td>
														</tr>
													);
												})}
										</tbody>
									</table>
								</div>
							</div>
						</section>
						<section
							className={`${sectionState === "unverified" ? "" : "d-none"}`}
						>
							<div className="col-12 mb-3">
								<input
									type="text"
									className="form-control"
									style={{ maxWidth: "400px" }}
									placeholder="Search with organization name or username"
									onInput={handleSearchUnverified}
								/>
							</div>
							<div className="col-12 p-3 bg-white rounded-3">
								<table className="table table-striped rounded-3">
									<thead>
										<tr>
											<th scope="col" style={{ width: "60%" }}>
												Organization
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
												<th scope="col" style={{ width: "60%" }}></th>
												<th scope="col" className="text-center"></th>
											</tr>
										</thead>
										<tbody ref={dataTable2}>
											{showDataUnverified &&
												showDataUnverified.map((org) => {
													return (
														<tr>
															<td>{org.name}</td>
															<td>
																<div className="d-flex w-100">
																	<button
																		className="btn btn-success ms-auto"
																		data-bs-target="#exampleModalToggle"
																		data-bs-toggle="modal"
																		onClick={() => {
																			handleView(org);
																		}}
																	>
																		<BiShow /> View
																	</button>
																	<button
																		className="btn btn-warning ms-2"
																		onClick={() => {
																			handleUpdate(org.legality_data.id, true);
																		}}
																	>
																		<BiCheckCircle /> Approve
																	</button>
																	<button
																		className="btn btn-danger ms-2 me-auto"
																		onClick={() => {
																			handleDelete(org.legality_data.id);
																		}}
																	>
																		<BiTrash />
																	</button>
																</div>
															</td>
														</tr>
													);
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

export default Legality;
