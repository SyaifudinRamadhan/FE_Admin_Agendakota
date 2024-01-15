import React, { useEffect } from "react";
import styles from "./styles/Dashboard.module.css";
import Navbar from "../../partials/Navbar";
import { BiAlarm, BiCalendar, BiMoney } from "react-icons/bi";

const Dashboard = ({ fnSetActive = () => {}, fnSetLoginState = () => {} }) => {
	useEffect(() => {
		fnSetActive("dashboard");
	});
	return (
		<>
			<div className={`row ps-4 pe-4 pt-2 pb-2 ${styles.MainContainer}`}>
				<div className="col-12 mb-3">
					<h5>Overview</h5>
				</div>
				<div className="col-md-3 p-2">
					<div className="row rounded-3 bg-white text-dark text-center p-3 m-0">
						<div className="col-12 text-center text-warning">
							<div
								className={`${styles.IconCardBox} rounded-circle`}
								style={{ backgroundColor: "#ffecd5c2" }}
							>
								<BiCalendar className={`${styles.IconCard}`} />
							</div>
						</div>
						<div className={`col-12 fw-bolder ${styles.TitleCard}`}>
							23 Events
							<div className={`${styles.Desc}`}>Registered</div>
						</div>
					</div>
				</div>
				<div className="col-md-3 p-2">
					<div className="row rounded-3 bg-white text-dark text-center p-3 m-0">
						<div className="col-12 text-center text-danger">
							<div
								className={`${styles.IconCardBox} rounded-circle`}
								style={{ backgroundColor: "#ffeaea" }}
							>
								<BiAlarm className={`${styles.IconCard}`} />
							</div>
						</div>
						<div className={`col-12 fw-bolder ${styles.TitleCard}`}>
							23 Ticket
							<div className={`${styles.Desc}`}>Refund App</div>
						</div>
					</div>
				</div>
				<div className="col-md-3 p-2">
					<div className="row rounded-3 bg-white text-dark text-center p-3 m-0">
						<div className="col-12 text-center text-primary">
							<div
								className={`${styles.IconCardBox} rounded-circle`}
								style={{ backgroundColor: "#e6efff" }}
							>
								<BiMoney className={`${styles.IconCard}`} />
							</div>
						</div>
						<div className={`col-12 fw-bolder ${styles.TitleCard}`}>
							Rp. 25 JT
							<div className={`${styles.Desc}`}>Gross Income</div>
						</div>
					</div>
				</div>
				<div className="col-md-3 p-2">
					<div className="row rounded-3 bg-white text-dark text-center p-3 m-0">
						<div className="col-12 text-center text-success">
							<div
								className={`${styles.IconCardBox} rounded-circle`}
								style={{ backgroundColor: "#e3ffdf" }}
							>
								<BiMoney className={`${styles.IconCard}`} />
							</div>
						</div>
						<div className={`col-12 fw-bolder ${styles.TitleCard}`}>
							Rp. 2 JT
							<div className={`${styles.Desc}`}>Neet Income</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Dashboard;
