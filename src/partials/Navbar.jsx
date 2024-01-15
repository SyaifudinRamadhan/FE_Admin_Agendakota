import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/Navbar.module.css";
import {
	BiPowerOff,
	BiUser,
	BiLayout,
	BiListMinus,
	BiSolidCity,
	BiPhotoAlbum,
	BiImageAdd,
	BiHighlight,
	BiCalendar,
	BiSelection,
	BiUserPlus,
	BiCart,
	BiMoney,
	BiGroup,
	BiCertification,
	BiCalendarEvent,
	BiHome,
	BiCreditCard,
	BiListUl,
	BiSelectMultiple,
} from "react-icons/bi";
import axios from "axios";

const loadDataLegality = async () => {
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

const loadDataWd = async () => {
	// Out key (withdraws)
	try {
		let wds = await axios.get(
			process.env.REACT_APP_BACKEND_URL + "/api/admin/withdraws",
			{
				headers: {
					Authorization: "Bearer " + localStorage.getItem("access_token"),
					"x-api-key": process.env.REACT_APP_BACKEND_KEY,
				},
			}
		);
		return {
			data: wds.data,
			status: wds.status,
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

const Navbar = ({ children, active, profileIcon, navDisplay = "" }) => {
	const [profileMenu, setProfileMenuState] = useState(false);
	const [notifyRefund, setNotifyRefund] = useState(0);
	const [notifyWd, setNotifyWd] = useState(0);
	const [notifyLegality, setNotifyLegality] = useState(0);
	const sidebar = useRef();
	const content = useRef();

	const resizeContent = () => {
		if (sidebar.current) {
			let sidebarWd = sidebar.current.clientWidth;
			let height = window.innerHeight - 72;
			content.current.style.width = `calc(100% - ${sidebarWd}px)`;
			content.current.style.maxHeight = height + "px";
			content.current.style.overflowY = "auto";
		}
	};

	const resizeSidebar = () => {
		if (sidebar.current) {
			let height = window.innerHeight - 72;
			sidebar.current.style.maxHeight = height + "px";
		}
	};

	useEffect(() => {
		resizeContent();
		resizeSidebar();
		document.addEventListener("click", (evt) => {
			let target = document.getElementById("profileBtn");
			let els = evt.target;
			if (target != els) {
				setProfileMenuState(false);
			}
		});
		window.addEventListener("resize", () => {
			console.log("resize");
			resizeContent();
			resizeSidebar();
		});

		loadDataLegality().then((res) => {
			if (res.status === 200) {
				setNotifyLegality(res.data.unverified.length);
			}
		});

		loadDataWd().then((res) => {
			if (res.status === 200) {
				let notify = 0;
				res.data.withdraws.forEach((data) => {
					if (data.status == 0) {
						notify += 1;
					}
				});
				setNotifyWd(notify);
			}
		});

		loadRefunds().then((res) => {
			if (res.status === 200) {
				let numNotify = 0;
				res.data.refund_datas.forEach((data) => {
					if (!data.approve_admin) {
						numNotify += 1;
					}
				});
				setNotifyRefund(numNotify);
			}
		});
	});

	return (
		<>
			<nav
				className="navbar navbar-expand-lg bg-body-tertiary position-fixed w-100"
				style={{ top: 0, zIndex: 5, display: navDisplay }}
			>
				<div className="container-fluid ps-4 pe-4">
					<a className="navbar-brand fs-6" href="#">
						<img src="/images/logo.png" className={`${styles.Logo}`} /> &nbsp;
						&nbsp;| &nbsp; Admin
					</a>
					<button
						className={`${styles.NavbarToggler} navbar-toggler`}
						type="button"
						aria-expanded="false"
						aria-label="Toggle navigation"
						data-bs-toggle="offcanvas"
						data-bs-target="#offcanvasResponsive"
						aria-controls="offcanvasResponsive"
					>
						<span className="navbar-toggler-icon"></span>
					</button>
					<div
						className={`collapse navbar-collapse ${styles.NavbarCollapse}`}
						id="navbarNavDropdown"
					>
						<ul className="navbar-nav ms-auto">
							<li className="nav-item">
								<a
									className="nav-link active"
									aria-current="page"
									href="#"
									onClick={() => setProfileMenuState(!profileMenu)}
								>
									<div className={`rounded-circle ${styles.IconProfile}`}>
										<img
											id="profileBtn"
											src={profileIcon}
											className="rounded-3"
											alt=""
											srcset=""
										/>
									</div>
								</a>
							</li>
						</ul>
					</div>

					{profileMenu ? (
						<div className={`${styles.Profile}`}>
							{/* <a href="/profile" className="text-decoration-none text-dark">
								<div
									className={`${styles.ProfileItem} ${
										active === "profile" ? styles.ItemSideNavActive : ""
									}`}
								>
									<BiUser />
									Profile
								</div>
							</a> */}
							<a href="/logout">
								<div
									className={`${styles.ProfileItem} bg-danger rounded-pill text-white`}
								>
									<BiPowerOff />
									Logout
								</div>
							</a>
						</div>
					) : (
						<></>
					)}

					<div
						className={`${styles.OffCanvas} offcanvas-lg offcanvas-end`}
						tabindex="-1"
						id="offcanvasResponsive"
						aria-labelledby="offcanvasResponsiveLabel"
					>
						<div className="offcanvas-header">
							<h5 className="offcanvas-title" id="offcanvasResponsiveLabel">
								Navigasi
							</h5>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="offcanvas"
								data-bs-target="#offcanvasResponsive"
								aria-label="Close"
							></button>
						</div>
						<div className={`${styles.OffCanvasBody} offcanvas-body`}>
							<div className={`rounded-circle ${styles.ItemSideNav}`}>
								<div className={`${styles.IconProfile} `}>
									<img
										src={profileIcon}
										className="rounded-3"
										alt=""
										srcset=""
									/>
								</div>

								<div className={`ms-4 mt-auto mb-auto`}>Syaifudin Ramadhan</div>
							</div>
							<hr className="mb-3" />
							<div className={`${styles.ItemSideNav} p-0 bg-white mt-4 mb-2`}>
								<div className={`fs-6 text-secondary`}>Basic Menu</div>
							</div>
							<a href="/" className="text-decoration-none text-black">
								<div
									className={`${styles.ItemSideNav} ${
										active === "dashboard" ? styles.ItemSideNavActive : ""
									}`}
								>
									<BiHome />
									Dashboard
								</div>
							</a>
							<a href="/categories" className="text-decoration-none text-black">
								<div
									className={`${styles.ItemSideNav} ${
										active === "categories" ? styles.ItemSideNavActive : ""
									}`}
								>
									<BiLayout />
									Event Categories
								</div>
							</a>
							<a href="/topics" className="text-decoration-none text-black">
								<div
									className={`${styles.ItemSideNav} ${
										active === "topics" ? styles.ItemSideNavActive : ""
									}`}
								>
									<BiListMinus />
									Event Topics
								</div>
							</a>
							<a
								href="/activity-topics"
								className="text-decoration-none text-black"
							>
								<div
									className={`${styles.ItemSideNav} ${
										active === "activity-topics" ? styles.ItemSideNavActive : ""
									}`}
								>
									<BiListUl />
									Activity Topics
								</div>
							</a>
							<a href="/cities" className="text-decoration-none text-black">
								<div
									className={`${styles.ItemSideNav} ${
										active === "cities" ? styles.ItemSideNavActive : ""
									}`}
								>
									<BiSolidCity />
									Cities
								</div>
							</a>
							<a
								href="/front-banners"
								className="text-decoration-none text-black"
							>
								<div
									className={`${styles.ItemSideNav} ${
										active === "front-banners" ? styles.ItemSideNavActive : ""
									}`}
								>
									<BiImageAdd />
									Front Banners
								</div>
							</a>
							<a href="/spotlights" className="text-decoration-none text-black">
								<div
									className={`${styles.ItemSideNav} ${
										active === "spotlights" ? styles.ItemSideNavActive : ""
									}`}
								>
									<BiHighlight />
									Event Spotlights
								</div>
							</a>
							<a
								href="/special-days"
								className="text-decoration-none text-black"
							>
								<div
									className={`${styles.ItemSideNav} ${
										active === "special-days" ? styles.ItemSideNavActive : ""
									}`}
								>
									<BiCalendar />
									Special Day Events
								</div>
							</a>
							<a href="/selecteds" className="text-decoration-none text-black">
								<div
									className={`${styles.ItemSideNav} ${
										active === "selecteds" ? styles.ItemSideNavActive : ""
									}`}
								>
									<BiSelection />
									Selected Events
								</div>
							</a>
							<a
								href="/selected-activities"
								className="text-decoration-none text-black"
							>
								<div
									className={`${styles.ItemSideNav} ${
										active === "selected-activities"
											? styles.ItemSideNavActive
											: ""
									}`}
								>
									<BiSelectMultiple />
									Selected Activities
								</div>
							</a>
							<hr />
							<div className={`${styles.ItemSideNav} p-0 bg-white mt-4 mb-2`}>
								<div className={`fs-6 text-secondary`}>Manage User</div>
							</div>
							<a href="/users" className="text-decoration-none text-black">
								<div
									className={`${styles.ItemSideNav} ${
										active === "users" ? styles.ItemSideNavActive : ""
									}`}
								>
									<BiUser />
									Users
								</div>
							</a>
							<a href="/admins" className="text-decoration-none text-black">
								<div
									className={`${styles.ItemSideNav} ${
										active === "admins" ? styles.ItemSideNavActive : ""
									}`}
								>
									<BiUserPlus />
									Admins
								</div>
							</a>
							<a href="/purchases" className="text-decoration-none text-black">
								<div
									className={`${styles.ItemSideNav} ${
										active === "purchases" ? styles.ItemSideNavActive : ""
									} position-relative`}
								>
									<BiCart />
									Purchases
									{notifyRefund > 0 ? (
										<span class="badge ms-2 bg-danger">
											{notifyRefund}
											{/* <span class="visually-hidden">Waiting legality data</span> */}
										</span>
									) : (
										<></>
									)}
								</div>
							</a>
							{/* <a href="/payments" className="text-decoration-none text-black">
								<div
									className={`${styles.ItemSideNav} ${
										active === "payments" ? styles.ItemSideNavActive : ""
									}`}
								>
									<BiMoney />
									Payments
								</div>
							</a> */}
							<hr />
							<div className={`${styles.ItemSideNav} p-0 bg-white mt-4 mb-2`}>
								<div className={`fs-6 text-secondary`}>Manage Organization</div>
							</div>
							<a
								href="/organizations"
								className="text-decoration-none text-black"
							>
								<div
									className={`${styles.ItemSideNav} ${
										active === "organizations" ? styles.ItemSideNavActive : ""
									}`}
								>
									<BiGroup />
									Organizations
								</div>
							</a>
							<a href="/legalities" className="text-decoration-none text-black">
								<div
									className={`${styles.ItemSideNav} ${
										active === "legalities" ? styles.ItemSideNavActive : ""
									} position-relative`}
								>
									<BiCertification />
									Legality Data
									{notifyLegality > 0 ? (
										<span class="badge ms-2 bg-danger">
											{notifyLegality}
											{/* <span class="visually-hidden">Waiting legality data</span> */}
										</span>
									) : (
										<></>
									)}
								</div>
							</a>
							<a href="/withdraws" className="text-decoration-none text-black">
								<div
									className={`${styles.ItemSideNav} ${
										active === "withdraws" ? styles.ItemSideNavActive : ""
									} position-relative`}
								>
									<BiCreditCard />
									Withdraws
									{notifyWd > 0 ? (
										<span class="badge ms-2 bg-danger">
											{notifyWd}
											{/* <span class="visually-hidden">Waiting legality data</span> */}
										</span>
									) : (
										<></>
									)}
								</div>
							</a>
							<hr />
							<div className={`${styles.ItemSideNav} p-0 bg-white mt-4 mb-2`}>
								<div className={`fs-6 text-secondary`}>Manage Event</div>
							</div>
							<a href="/events" className="text-decoration-none text-black">
								<div
									className={`${styles.ItemSideNav} ${
										active === "events" ? styles.ItemSideNavActive : ""
									}`}
								>
									<BiCalendarEvent />
									Events
								</div>
							</a>
							<hr />
							{/* <a href="/profile" className="text-decoration-none text-black">
								<div
									className={`${styles.ItemSideNav} ${
										active === "profile" ? styles.ItemSideNavActive : ""
									}`}
								>
									<BiUser />
									Profile
								</div>
							</a> */}
							<a href="/logout" className="text-decoration-none text-black">
								<button className="btn btn-danger w-100 p-0 text-center d-flex">
									<div className={`${styles.ItemSideNav} ms-auto me-auto`}>
										<BiPowerOff />
										Logout
									</div>
								</button>
							</a>
						</div>
					</div>
				</div>
			</nav>
			<div
				className={`${styles.MainContainer}`}
				style={{ display: navDisplay }}
			>
				<div ref={sidebar} className={`${styles.Sidebar}`}>
					<div className={`${styles.ItemSideNav} p-0 bg-white mt-2 mb-2`}>
						<div className={`fs-6 text-secondary`}>Basic Menu</div>
					</div>
					<a href="/" className="text-decoration-none text-black">
						<div
							className={`${styles.ItemSideNav} ${
								active === "dashboard" ? styles.ItemSideNavActive : ""
							}`}
						>
							<BiHome />
							Dashboard
						</div>
					</a>
					<a href="/categories" className="text-decoration-none text-black">
						<div
							className={`${styles.ItemSideNav} ${
								active === "categories" ? styles.ItemSideNavActive : ""
							}`}
						>
							<BiLayout />
							Event Categories
						</div>
					</a>
					<a href="/topics" className="text-decoration-none text-black">
						<div
							className={`${styles.ItemSideNav} ${
								active === "topics" ? styles.ItemSideNavActive : ""
							}`}
						>
							<BiListMinus />
							Event Topics
						</div>
					</a>
					<a
						href="/activity-topics"
						className="text-decoration-none text-black"
					>
						<div
							className={`${styles.ItemSideNav} ${
								active === "activity-topics" ? styles.ItemSideNavActive : ""
							}`}
						>
							<BiListUl />
							Activity Topics
						</div>
					</a>
					<a href="/cities" className="text-decoration-none text-black">
						<div
							className={`${styles.ItemSideNav} ${
								active === "cities" ? styles.ItemSideNavActive : ""
							}`}
						>
							<BiSolidCity />
							Cities
						</div>
					</a>
					<a href="/front-banners" className="text-decoration-none text-black">
						<div
							className={`${styles.ItemSideNav} ${
								active === "front-banners" ? styles.ItemSideNavActive : ""
							}`}
						>
							<BiImageAdd />
							Front Banners
						</div>
					</a>
					<a href="/spotlights" className="text-decoration-none text-black">
						<div
							className={`${styles.ItemSideNav} ${
								active === "spotlights" ? styles.ItemSideNavActive : ""
							}`}
						>
							<BiHighlight />
							Event Spotlights
						</div>
					</a>
					<a href="/special-days" className="text-decoration-none text-black">
						<div
							className={`${styles.ItemSideNav} ${
								active === "special-days" ? styles.ItemSideNavActive : ""
							}`}
						>
							<BiCalendar />
							Special Day Events
						</div>
					</a>
					<a href="/selecteds" className="text-decoration-none text-black">
						<div
							className={`${styles.ItemSideNav} ${
								active === "selecteds" ? styles.ItemSideNavActive : ""
							}`}
						>
							<BiSelection />
							Selected Events
						</div>
					</a>
					<a
						href="/selected-activities"
						className="text-decoration-none text-black"
					>
						<div
							className={`${styles.ItemSideNav} ${
								active === "selected-activities" ? styles.ItemSideNavActive : ""
							}`}
						>
							<BiSelectMultiple />
							Selected Activities
						</div>
					</a>
					<hr />
					<div className={`${styles.ItemSideNav} p-0 bg-white mt-4 mb-2`}>
						<div className={`fs-6 text-secondary`}>Manage User</div>
					</div>
					<a href="/users" className="text-decoration-none text-black">
						<div
							className={`${styles.ItemSideNav} ${
								active === "users" ? styles.ItemSideNavActive : ""
							}`}
						>
							<BiUser />
							Users
						</div>
					</a>
					<a href="/admins" className="text-decoration-none text-black">
						<div
							className={`${styles.ItemSideNav} ${
								active === "admins" ? styles.ItemSideNavActive : ""
							}`}
						>
							<BiUserPlus />
							Admins
						</div>
					</a>
					<a href="/purchases" className="text-decoration-none text-black">
						<div
							className={`${styles.ItemSideNav} ${
								active === "purchases" ? styles.ItemSideNavActive : ""
							} position-relative`}
						>
							<BiCart />
							Purchases
							{notifyRefund > 0 ? (
								<span class="badge ms-2 bg-danger">
									{notifyRefund}
									{/* <span class="visually-hidden">Waiting legality data</span> */}
								</span>
							) : (
								<></>
							)}
						</div>
					</a>
					{/* <a href="/payments" className="text-decoration-none text-black">
						<div
							className={`${styles.ItemSideNav} ${
								active === "payments" ? styles.ItemSideNavActive : ""
							}`}
						>
							<BiMoney />
							Payments
						</div>
					</a> */}
					<hr />
					<div className={`${styles.ItemSideNav} p-0 bg-white mt-4 mb-2`}>
						<div className={`fs-6 text-secondary`}>Manage Organization</div>
					</div>
					<a href="/organizations" className="text-decoration-none text-black">
						<div
							className={`${styles.ItemSideNav} ${
								active === "organizations" ? styles.ItemSideNavActive : ""
							}`}
						>
							<BiGroup />
							Organizations
						</div>
					</a>
					<a href="/legalities" className="text-decoration-none text-black">
						<div
							className={`${styles.ItemSideNav} ${
								active === "legalities" ? styles.ItemSideNavActive : ""
							} position-relative`}
						>
							<BiCertification />
							Legality Data
							{notifyLegality > 0 ? (
								<span class="badge ms-2 bg-danger">
									{notifyLegality}
									{/* <span class="visually-hidden">Waiting legality data</span> */}
								</span>
							) : (
								<></>
							)}
						</div>
					</a>
					<a href="/withdraws" className="text-decoration-none text-black">
						<div
							className={`${styles.ItemSideNav} ${
								active === "withdraws" ? styles.ItemSideNavActive : ""
							} position-relative`}
						>
							<BiCreditCard />
							Withdraws
							{notifyWd > 0 ? (
								<span class="badge ms-2 bg-danger">
									{notifyWd}
									{/* <span class="visually-hidden">Waiting legality data</span> */}
								</span>
							) : (
								<></>
							)}
						</div>
					</a>
					<hr />
					<div className={`${styles.ItemSideNav} p-0 bg-white mt-4 mb-2`}>
						<div className={`fs-6 text-secondary`}>Manage Event</div>
					</div>
					<a href="/events" className="text-decoration-none text-black">
						<div
							className={`${styles.ItemSideNav} ${
								active === "events" ? styles.ItemSideNavActive : ""
							}`}
						>
							<BiCalendarEvent />
							Events
						</div>
					</a>
				</div>
				<div ref={content} className={`${styles.Content}`}>
					{children}
				</div>
			</div>
		</>
	);
};

export default Navbar;
