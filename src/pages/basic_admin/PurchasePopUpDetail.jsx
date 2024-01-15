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
	BiShow,
	BiTrash,
	BiX,
} from "react-icons/bi";
import Loading from "../../components/Loading";

const dummyLoad = () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(true);
		}, 3000);
	});
};

const PopUpContentDetail = ({
	orderId,
	email,
	tokenTrx,
	username,
	price,
	purchases,
}) => {
	return (
		<div>
			<label className={`${styles2.FormLabel}`}>Order ID</label>
			<input
				readOnly
				type="text"
				className="form-control mb-3"
				value={orderId}
			/>
			<label className={`${styles2.FormLabel}`}>Transaction Token</label>
			<input
				readOnly
				type="text"
				className="form-control mb-3"
				value={tokenTrx}
			/>
			<label className={`${styles2.FormLabel}`}>Email address</label>
			<input
				readOnly
				type="email"
				className="form-control mb-3"
				value={email}
			/>
			<label className={`${styles2.FormLabel}`}>Username</label>
			<input
				readOnly
				type="email"
				className="form-control mb-3"
				value={username}
			/>
			<label className={`${styles2.FormLabel}`}>Price</label>
			<input
				readOnly
				type="email"
				className="form-control mb-3"
				value={price}
			/>
			<div className="w-100" style={{ overflow: "auto", maxHeight: "300px" }}>
				<table className="table table-striped mt-3">
					<thead>
						<tr>
							<th>Ticket</th>
							<th>Event</th>
							<th>Start Event</th>
							<th>End Event</th>
							<th>Visit Date</th>
							<th>Price</th>
							<th>Qty</th>
						</tr>
					</thead>
					<tbody>
						{Object.values(
							Object.groupBy(purchases, ({ ticket_id }) => ticket_id)
						).map((pchGroup, keyGroup) => {
							return (
								<tr>
									<td>{pchGroup[0].ticket.name}</td>
									<td>{pchGroup[0].event.name}</td>
									<td>{pchGroup[0].event.start_date}</td>
									<td>{pchGroup[0].event.end_date}</td>
									<td>{"-"}</td>
									<td>{pchGroup[0].ticket.price}</td>
									<td>{pchGroup.length}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default PopUpContentDetail;
