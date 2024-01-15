import React, { useRef, useState, useEffect } from "react";
import styles from "./styles/Topics.module.css";
import styles2 from "./styles/Users.module.css";
import styles3 from "./styles/Purchases.module.css";
import Navbar from "../../partials/Navbar";
import {
	BiCalendar,
	BiEdit,
	BiPlusCircle,
	BiSave,
	BiSearch,
	BiShow,
	BiTrash,
	BiX,
} from "react-icons/bi";
import Loading from "../../components/Loading";
import PopUpContentDetail from "./PurchasePopUpDetail";
import PopUpContentRefund from "./PurchasePopUpRefund";
import axios from "axios";

const dummyLoad = () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(true);
		}, 3000);
	});
};

const loadPchs = async () => {
	// purchases (out key)
	try {
		let data = await axios.get(
			process.env.REACT_APP_BACKEND_URL + "/api/admin/purchases",
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

const loadRefunds = async () => {
	// refund_datas (out key)
	try {
		let data = await axios.get(
			process.env.REACT_APP_BACKEND_URL + "/api/admin/refunds",
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

const refundDetail = async ({ refundId }) => {
	// refund_data (out key)
	try {
		let data = await axios.get(
			process.env.REACT_APP_BACKEND_URL + "/api/admin/refund",
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

const changeRefundState = async ({ refundIds, state, ticketId }) => {
	// refund_datas (out key)
	console.log(refundIds);
	try {
		let data = await axios.post(
			process.env.REACT_APP_BACKEND_URL + "/api/admin/refund/change-state",
			{
				refund_ids: refundIds,
				approved: state,
				ticket_id: ticketId,
			},
			{
				headers: {
					Authorization: "Bearer " + localStorage.getItem("access_token"),
					"x-api-key": process.env.REACT_APP_BACKEND_KEY,
				},
			}
		);
		console.log(data);
		return loadRefunds();
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

const Purchases = ({ fnSetActive = () => {}, fnSetLoginState = () => {} }) => {
	const tableContent1 = useRef();
	const tableContent2 = useRef();
	const dataTable = useRef();
	const dataTable2 = useRef();
	const closePopUp = useRef();
	const progOpenPopUp = useRef();

	const [isLoading, setLoading] = useState(false);
	const [alert, setAlert] = useState({
		state: false,
		content: "",
		type: "",
	});
	const [sectionState, setSectionState] = useState(1);
	const [popUpContent, setPopUpContent] = useState(<></>);
	const [popUpTitle, setPopUpTitle] = useState("");
	const [showDataPurchase, setDataPurchase] = useState(null);
	const [showDataRefund, setDataRefund] = useState(null);
	const [notifyRefund, setNotifyRefund] = useState(0);
	// const [selectedRefundGroup, setSelectRefundGroup] = useState(null);

	const resetAlert = () => {
		setTimeout(() => {
			setAlert({ state: false, content: "", type: "" });
		}, 3000);
	};

	const handleChangeStateRefund = (
		refundIds,
		state,
		ticketId,
		eventId,
		firstData
	) => {
		setLoading(true);
		closePopUp.current.click();
		console.log(refundIds, state, ticketId);
		changeRefundState({
			refundIds: refundIds,
			state: state,
			ticketId: ticketId,
		}).then((res) => {
			if (res.status === 200) {
				setDataRefund(res.data.refund_datas);
				setAlert({
					state: true,
					content: "Refund data status has updated",
					type: "success",
				});
				hanldeViewRefund(
					res.data.refund_datas.filter((refund) => refund.event_id === eventId)
				);
			} else {
				if (res.status == 401) {
					fnSetLoginState(0);
				}
				setAlert({
					state: true,
					content: Object.values(res.data.data).toString(),
					type: "danger",
				});
				hanldeViewRefund(firstData);
			}
			setLoading(false);
			progOpenPopUp.current.click();
			resetAlert();
		});
	};

	const handleView = (pchGroup) => {
		setPopUpTitle("Transaction Detail");
		setPopUpContent(
			<PopUpContentDetail
				orderId={pchGroup[0].payment.order_id}
				email={pchGroup[0].user.email}
				tokenTrx={pchGroup[0].payment.token_trx}
				username={pchGroup[0].user.name}
				price={pchGroup[0].payment.price}
				purchases={pchGroup}
			/>
		);
	};

	const hanldeViewRefund = (refund) => {
		setPopUpTitle("Refund Datas");
		setPopUpContent(
			<PopUpContentRefund
				eventName={refund[0].event.name}
				organization="Testing"
				endDate={refund[0].event.end_date}
				startDate={refund[0].event.start_date}
				category={refund[0].event.category}
				refunds={refund}
				handleChangeState={handleChangeStateRefund}
			/>
		);
	};

	const handleHeightContent = () => {
		try {
			let height = window.innerHeight - 365;
			tableContent1.current.style.maxHeight = height + "px";
			tableContent2.current.style.maxHeight = height + "px";
		} catch (error) {
			console.log(error);
		}
	};

	const handleSearchMain = (key, refTarget) => {
		let trs = refTarget.current.getElementsByTagName("tr");
		for (let i = 0; i < trs.length; i++) {
			let tds = trs[i].getElementsByTagName("td");
			let show = false;
			for (let j = 0; j < tds.length; j++) {
				if (tds[j].innerHTML.toLowerCase().includes(key)) {
					show = true;
				}
			}
			trs[i].style.display = show ? "table-row" : "none";
		}
	};

	const handleSearchPch = (e) => {
		let key = e.target.value.toLowerCase();
		handleSearchMain(key, dataTable);
	};

	const handleSearchRefund = (e) => {
		let key = e.target.value.toLowerCase();
		handleSearchMain(key, dataTable2);
	};

	useEffect(() => {
		handleHeightContent();
		window.addEventListener("resize", handleHeightContent);
		fnSetActive("purchases");
	});

	useEffect(() => {
		if (showDataPurchase === null && showDataRefund === null) {
			setLoading(true);
			loadPchs().then((res) => {
				console.log(res);
				res.status === 200
					? setDataPurchase(res.data.purchases)
					: setDataPurchase([]);
				loadRefunds().then((res2) => {
					console.log(res2);
					setLoading(false);
					res2.status === 200
						? setDataRefund(res2.data.refund_datas)
						: setDataRefund([]);
					if (res2.status == 401) {
						fnSetLoginState(2);
					}
				});
			});
		}
	}, [showDataPurchase, showDataRefund]);

	useEffect(() => {
		if (showDataRefund) {
			let numNotify = 0;
			showDataRefund.forEach((data) => {
				if (!data.approve_admin) {
					numNotify += 1;
				}
			});
			setNotifyRefund(numNotify);
		}
	}, [showDataRefund]);

	return (
		<>
			{/* {console.log(showDataPurchase, showDataRefund)} */}
			<button
				className="btn btn-warning m-auto d-none"
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
				<div
					className={`modal-dialog modal-dialog-centered ${styles3.PopUpAdd}`}
				>
					<div className="modal-content">
						<div className="row m-0">
							<div className="col-12 d-flex pt-4 ps-3 pe-3 pb-1">
								<h5>{popUpTitle}</h5>
								<button
									type="button"
									className={`btn-close ms-auto`}
									data-bs-dismiss="modal"
									aria-label="Close"
									ref={closePopUp}
									onClick={() => {
										setPopUpContent(null);
									}}
								></button>
							</div>
							<div className="col-12 pt-2 ps-3 pe-3 pb-1">
								{alert.state ? (
									<div className={`alert alert-${alert.type}`} role="alert">
										{alert.content}
									</div>
								) : (
									<></>
								)}
							</div>
							<div className="col-12 pt-2 ps-3 pe-3 pb-1">{popUpContent}</div>
						</div>
					</div>
				</div>
			</div>
			<div className={`row ps-4 pe-4 pt-2 pb-2 ${styles.MainContainer}`}>
				<div className="col-12 mb-3 d-flex">
					<h5>Purchases</h5>
					<div
						className={`rounded-3 p-2 d-flex g-2 ms-auto ${styles3.TooglerBox}`}
					>
						<button
							className={`btn ${sectionState === 1 ? "bg-white" : ""}`}
							onClick={() => setSectionState(1)}
						>
							Transactions
						</button>
						<button
							className={`btn ${
								sectionState === 2 ? "bg-white" : ""
							} position-relative`}
							onClick={() => setSectionState(2)}
						>
							Refunds
							{notifyRefund > 0 ? (
								<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
									{notifyRefund}
									<span className="visually-hidden">Waiting Refund</span>
								</span>
							) : (
								<></>
							)}
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
						<div className={`row mt-3 ${sectionState === 1 ? "" : "d-none"}`}>
							<div
								className={`col-12 p-3 bg-white rounded-3 ${styles3.TableBox}`}
							>
								<div className="d-flex">
									<input
										type="text"
										className="form-control"
										style={{ maxWidth: "300px" }}
										placeholder="Search with email or name"
										onInput={handleSearchPch}
									/>
									<button
										className="btn"
										style={{ backgroundColor: "#eaeaea" }}
									>
										<BiSearch className="ms-auto my-auto" />
									</button>
								</div>
								<table
									className={`table table-striped rounded-3 w-100 table-wrap ${styles3.Table} ${styles3.TableM1000}`}
								>
									<thead className="top-thead">
										<tr>
											<th scope="col" style={{ width: "18%" }}>
												Order ID
											</th>
											<th scope="col" style={{ width: "18%" }}>
												Trx Token
											</th>
											<th scope="col" style={{ width: "10%" }}>
												Price
											</th>
											<th scope="col" style={{ width: "16.6%" }}>
												Username
											</th>
											<th scope="col" style={{ width: "16.6%" }}>
												Email
											</th>
											<th scope="col" className="text-center">
												Action
											</th>
										</tr>
									</thead>
								</table>
								<div ref={tableContent1}>
									<table
										className={`table table-striped rounded-3 w-100 table-wrap ${styles3.Table} ${styles3.TableM1000}`}
									>
										<thead>
											<tr className="top-thead-inner-1">
												<th scope="col" style={{ width: "18%" }}>
													Order ID
												</th>
												<th scope="col" style={{ width: "18%" }}>
													Trx Token
												</th>
												<th scope="col" style={{ width: "10%" }}>
													Price
												</th>
												<th scope="col" style={{ width: "16.6%" }}>
													Username
												</th>
												<th scope="col" style={{ width: "16.6%" }}>
													Email
												</th>
												<th scope="col" className="text-center">
													Action
												</th>
											</tr>
											<tr className="top-thead-inner-2">
												<th scope="col" style={{ width: "18%" }}></th>
												<th scope="col" style={{ width: "18%" }}></th>
												<th scope="col" style={{ width: "10%" }}></th>
												<th scope="col" style={{ width: "16.6%" }}></th>
												<th scope="col" style={{ width: "16.6%" }}></th>
												<th scope="col" className="text-center"></th>
											</tr>
										</thead>
										<tbody ref={dataTable}>
											{showDataPurchase &&
												Object.values(
													Object.groupBy(
														showDataPurchase,
														({ payment }) => payment.id
													)
												).map((pchGroup) => {
													return (
														<tr>
															<td>{pchGroup[0].payment.order_id}</td>
															<td>{pchGroup[0].payment.token_trx}</td>
															<td>
																Rp. {pchGroup[0].payment.price}
																,00
															</td>
															<td>{pchGroup[0].user.name}</td>
															<td>{pchGroup[0].user.email}</td>
															<td>
																<div className="d-flex">
																	<button
																		className="btn btn-warning m-auto"
																		data-bs-target="#exampleModalToggle"
																		data-bs-toggle="modal"
																		onClick={() => {
																			handleView(pchGroup);
																		}}
																	>
																		View
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
						</div>
						<div className={`row ${sectionState === 2 ? "" : "d-none"}`}>
							<div
								className={`col-12 p-3 bg-white rounded-3 ${styles3.TableBox}`}
							>
								<div className="d-flex">
									<input
										type="text"
										className="form-control"
										style={{ maxWidth: "300px" }}
										placeholder="Search with event name or date"
										onInput={handleSearchRefund}
									/>
									<button
										className="btn"
										style={{ backgroundColor: "#eaeaea" }}
									>
										<BiSearch className="ms-auto my-auto" />
									</button>
								</div>
								<table
									className={`table table-striped rounded-3 w-100 table-wrap ${styles3.Table} ${styles3.TableM743}`}
								>
									<thead className="top-thead">
										<tr>
											<th scope="col" style={{ width: "50%" }}>
												Event
											</th>
											<th scope="col" style={{ width: "15%" }}>
												Start
											</th>
											<th scope="col" style={{ width: "15%" }}>
												End
											</th>
											<th scope="col" className="text-center">
												Action
											</th>
										</tr>
									</thead>
								</table>
								<div ref={tableContent2}>
									<table
										className={`table table-striped rounded-3 w-100 table-wrap ${styles3.Table} ${styles3.TableM743}`}
									>
										<thead>
											<tr className="top-thead-inner-1">
												<th scope="col" style={{ width: "50%" }}>
													Event
												</th>
												<th scope="col" style={{ width: "15%" }}>
													Start
												</th>
												<th scope="col" style={{ width: "15%" }}>
													End
												</th>
												<th scope="col" className="text-center">
													Action
												</th>
											</tr>
											<tr className="top-thead-inner-2">
												<th scope="col" style={{ width: "50%" }}></th>
												<th scope="col" style={{ width: "15%" }}></th>
												<th scope="col" style={{ width: "15%" }}></th>
												<th scope="col" className="text-center"></th>
											</tr>
										</thead>
										<tbody ref={dataTable2}>
											{showDataRefund &&
												Object.values(
													Object.groupBy(
														showDataRefund,
														({ event }) => event.id
													)
												).map((data, index) => {
													let notify = 0;
													data.forEach((refund) => {
														if (!refund.approve_admin) {
															notify += 1;
														}
													});
													return (
														<tr>
															<td className="position-relative">
																{data[0].event.name}
																{notify > 0 ? (
																	<span className="badge bg-danger ms-2">
																		{notify}
																	</span>
																) : (
																	<></>
																)}
															</td>
															<td>{data[0].event.start_date}</td>
															<td>{data[0].event.end_date}</td>
															<td>
																<div className="d-flex">
																	<button
																		className="btn btn-warning m-auto"
																		data-bs-target="#exampleModalToggle"
																		data-bs-toggle="modal"
																		onClick={() => {
																			// setSelectRefundGroup(data[0].event.id);
																			hanldeViewRefund(data);
																		}}
																	>
																		Detail
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
						</div>
					</>
				)}
			</div>
		</>
	);
};

export default Purchases;
