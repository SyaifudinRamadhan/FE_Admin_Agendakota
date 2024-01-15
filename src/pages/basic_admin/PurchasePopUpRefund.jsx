import React, { useRef, useState, useEffect } from "react";
import styles from "./styles/Topics.module.css";
import styles2 from "./styles/Users.module.css";
import styles3 from "./styles/Purchases.module.css";
import Navbar from "../../partials/Navbar";
import {
	BiCalendar,
	BiDownload,
	BiEdit,
	BiPlusCircle,
	BiSave,
	BiShow,
	BiTrash,
	BiX,
} from "react-icons/bi";
import Loading from "../../components/Loading";
import xlsx from "json-as-xlsx";

const dummyLoad = () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(true);
		}, 3000);
	});
};

const PopUpContentRefund = ({
	eventName,
	organization,
	endDate,
	startDate,
	category,
	refunds,
	handleChangeState = () => {},
}) => {
	const [refundsData, setRefundData] = useState(refunds);
	const inputSearch = useRef();
	const filter = useRef();

	const handleFilter = (e) => {
		let key = e.target.value;
		let keySearch = inputSearch.current.value.toLowerCase();
		if (key === "finished") {
			setRefundData(
				refunds.filter(
					(refund) =>
						refund.finish == true &&
						(refund.ticket.name.toLowerCase().includes(keySearch) ||
							refund.user.name.toLowerCase().includes(keySearch) ||
							refund.user.email.toLowerCase().includes(keySearch))
				)
			);
		} else if (key === "un-finished") {
			setRefundData(
				refunds.filter(
					(refund) =>
						refund.finish == false &&
						(refund.ticket.name.toLowerCase().includes(keySearch) ||
							refund.user.name.toLowerCase().includes(keySearch) ||
							refund.user.email.toLowerCase().includes(keySearch))
				)
			);
		} else if (key === "approved") {
			setRefundData(
				refunds.filter(
					(refund) =>
						refund.approve_admin == true &&
						(refund.ticket.name.toLowerCase().includes(keySearch) ||
							refund.user.name.toLowerCase().includes(keySearch) ||
							refund.user.email.toLowerCase().includes(keySearch))
				)
			);
		} else if (key === "un-approved") {
			setRefundData(
				refunds.filter(
					(refund) =>
						refund.approve_admin == false &&
						(refund.ticket.name.toLowerCase().includes(keySearch) ||
							refund.user.name.toLowerCase().includes(keySearch) ||
							refund.user.email.toLowerCase().includes(keySearch))
				)
			);
		} else {
			setRefundData(
				refunds.filter(
					(refund) =>
						refund.ticket.name.toLowerCase().includes(keySearch) ||
						refund.user.name.toLowerCase().includes(keySearch) ||
						refund.user.email.toLowerCase().includes(keySearch)
				)
			);
		}
	};

	const handleSearch = (e) => {
		let key = e.target.value.toLowerCase();
		let filterKey = filter.current.value;
		let result = null;

		if (filterKey === "finished") {
			result = refunds.filter((refund) => refund.finish == true);
		} else if (filterKey === "un-finished") {
			result = refunds.filter((refund) => refund.finish == false);
		} else if (filterKey === "approved") {
			result = refunds.filter((refund) => refund.approve_admin == true);
		} else if (filterKey === "un-approved") {
			result = refunds.filter((refund) => refund.approve_admin == false);
		} else {
			result = refunds;
		}

		setRefundData(
			result.filter(
				(refund) =>
					refund.ticket.name.toLowerCase().includes(key) ||
					refund.user.name.toLowerCase().includes(key) ||
					refund.user.email.toLowerCase().includes(key)
			)
		);
	};

	const handleDownloadTable = () => {
		let content = [];
		Object.values(
			Object.groupBy(refundsData, (refund) => [
				refund.user_id,
				refund.ticket.id,
			])
		).forEach((data) => {
			console.log(data);
			content.push({
				username: data[0].user.name,
				email: data[0].user.email,
				ticket: data[0].ticket.name,
				visit_date: data[0].visit_date,
				price: data[0].purchase
					? data[0].purchase.amount
					: "Money has finissh transfer",
				qty: data.length,
				total: data[0].purchase
					? parseInt(data[0].purchase.amount) * data.length
					: "Money has finissh transfer",
				bank_acc: data[0].account_number,
				phone: data[0].phone_number,
				message: data[0].message,
				state_org: data[0].approve_org ? "approved" : "unapproved",
				state_admin: data[0].approve_admin ? "approved" : "unapproved",
				finish_state: data[0].finish ? "finished" : "unfinish",
			});
		});
		let data = [
			{
				sheet: "Refund Report",
				columns: [
					{ label: "Username", value: "username" },
					{ label: "Email", value: "email" },
					{ label: "Ticket", value: "ticket" },
					{ label: "Visit Date", value: "visit_date" },
					{ label: "Price", value: "price" },
					{ label: "Quantity", value: "qty" },
					{ label: "Total", value: "total" },
					{ label: "Bank Account", value: "bank_acc" },
					{ label: "Phone", value: "phone" },
					{ label: "Message", value: "message" },
					{ label: "Approval Status By The Organizer", value: "state_org" },
					{ label: "Approval Status By The Admin", value: "state_admin" },
					{ label: "Transfer Status", value: "finish_state" },
				],
				content: content,
			},
		];
		let settings = {
			fileName: "Refund_Report", // Name of the resulting spreadsheet
			extraLength: 10, // A bigger number means that columns will be wider
			writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
			writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
			RTL: false, // Display the columns from right-to-left (the default value is false)
		};
		xlsx(data, settings);
	};

	return (
		<div>
			<label className={`${styles2.FormLabel}`}>Event / Activites</label>
			<input
				type="text"
				name=""
				id=""
				className="form-control mb-3"
				value={eventName}
			/>
			<label className={`${styles2.FormLabel}`}>Organization</label>
			<input
				type="text"
				name=""
				id=""
				className="form-control mb-3"
				value={organization}
			/>
			<label className={`${styles2.FormLabel}`}>Start</label>
			<input
				type="text"
				name=""
				id=""
				className="form-control mb-3"
				value={startDate}
			/>
			<label className={`${styles2.FormLabel}`}>End</label>
			<input
				type="text"
				name=""
				id=""
				className="form-control mb-3"
				value={endDate}
			/>
			<label className={`${styles2.FormLabel}`}>Category</label>
			<input
				type="text"
				name=""
				id=""
				className="form-control mb-3"
				value={category}
			/>
			<div className="w-100">
				<div className="alert alert-info" role="alert">
					<h5>INFORMASI :</h5>
					<p>
						{/* * Untuk melakukan konfirmasi pengajuan refund disetujui oleh admin,
						silahkan klik tombol Approve. Kemudian untuk transfer pengembalian
						dana, dilakukan secara manual ke rekening user. Kemudian setelah
						transfer dilakukan silahkan klik tombol set finish, untuk pencatatan
						sistem. Gunakan filter dan search form untuk melakukan pencarian
						data. */}
						* Untuk melakukan konfirmasi pengajuan refund disetujui oleh admin,
						silahkan klik tombol Approve. Kemudian untuk transfer pengembalian
						dana, dilakukan secara otomatis ke rekening user. Gunakan filter dan
						search form untuk melakukan pencarian data.
					</p>
					<p>
						* Klik tombol download tabel berikut untuk mendownload data di tabel
						yang ditampilkan saat ini
					</p>
					<button className="btn btn-success" onClick={handleDownloadTable}>
						<BiDownload /> Download Tabel
					</button>
				</div>
			</div>
			<div className="row mt-3">
				<div className="col-md-6">
					<label className={`${styles2.FormLabel}`}>Filter Table</label>
					<select
						id=""
						className="form-control"
						onChange={handleFilter}
						ref={filter}
					>
						<option value="all">All Data</option>
						{/* <option value="finished">Finished</option>
						<option value="un-finished">Un Finished</option> */}
						<option value="approved">Approved</option>
						<option value="un-approved">Un Approved</option>
					</select>
				</div>
				<div className="col-md-6">
					<label className={`${styles2.FormLabel}`}>Search Form</label>
					<input
						type="text"
						id=""
						className="form-control"
						placeholder="Search ticket or email or username"
						onInput={handleSearch}
						ref={inputSearch}
					/>
				</div>
			</div>
			<div className="w-100" style={{ overflow: "auto", maxHeight: "300px" }}>
				<table className="table table-striped mt-3">
					<thead>
						<tr>
							<th style={{ whiteSpace: "nowrap" }}>Username</th>
							<th style={{ whiteSpace: "nowrap" }}>Email</th>
							<th style={{ whiteSpace: "nowrap" }}>Ticket</th>
							<th style={{ whiteSpace: "nowrap" }}>Visit Date</th>
							<th style={{ whiteSpace: "nowrap" }}>Price</th>
							<th style={{ whiteSpace: "nowrap" }}>Qty</th>
							<th style={{ whiteSpace: "nowrap" }}>Total</th>
							<th style={{ whiteSpace: "nowrap" }}>Bank Account</th>
							<th style={{ whiteSpace: "nowrap" }}>Phone</th>
							<th style={{ whiteSpace: "nowrap" }}>Message</th>
							<th style={{ whiteSpace: "nowrap" }}>Approve Org</th>
							<th style={{ whiteSpace: "nowrap" }}>Action</th>
						</tr>
					</thead>
					<tbody>
						{console.log(refundsData)}
						{Object.values(
							Object.groupBy(refundsData, (refund) => [
								refund.user_id,
								refund.ticket_id,
								refund.approve_org,
								refund.approve_admin,
							])
						).map((data) => {
							return (
								<tr>
									<td>{data[0].user.name}</td>
									<td>{data[0].user.email}</td>
									<td>{data[0].ticket.name}</td>
									<td>{data[0].visit_date}</td>
									<td>
										{data[0].purchase ? data[0].purchase.amount : "Transfered"}
									</td>
									<td>{data.length}</td>
									<td>
										{data[0].purchase
											? parseInt(data[0].purchase.amount) * data.length
											: "Transfered"}
									</td>
									<td>{data[0].account_number}</td>
									<td>{data[0].phone_number}</td>
									<td>{data[0].message}</td>
									<td>
										{data[0].approve_org ? (
											<span className="badge text-bg-success">Approved</span>
										) : (
											<span className="badge text-bg-secondary">UnApprove</span>
										)}
									</td>
									<td>
										<div
											className="d-flex"
											style={{ flexDirection: "column", gap: "5px" }}
										>
											{data[0].approve_admin ? (
												<span className="badge text-bg-success">Finished</span>
											) : (
												<>
													<button
														className="btn btn-warning"
														onClick={() => {
															handleChangeState(
																data.map((refund) => refund.id),
																true,
																data[0].ticket.id,
																data[0].event_id,
																refunds
															);
														}}
													>
														Approve
													</button>
													<button
														className="btn btn-danger"
														onClick={() => {
															handleChangeState(
																data.map((refund) => refund.id),
																false,
																data[0].ticket.id,
																data[0].event_id,
																refunds
															);
														}}
													>
														Reject
													</button>
												</>
											)}
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<div className="w-100 text-center">
				{refundsData.length === 0 ? (
					<div className="mt-2 mb-2">Data not found</div>
				) : (
					""
				)}
			</div>
		</div>
	);
};

export default PopUpContentRefund;
