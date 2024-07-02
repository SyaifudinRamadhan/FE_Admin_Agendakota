import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./basic_admin/Dashboard";
import Categories from "./basic_admin/Categories";
import Topics from "./basic_admin/Topics";
import Cities from "./basic_admin/Cities";
import FrontBanners from "./basic_admin/FrontBanners";
import Spotlights from "./basic_admin/Spotlights";
import ActivityTopics from "./basic_admin/ActivityTopics";
import SpecialDays from "./basic_admin/SpecialDays";
import SelectedEvents from "./basic_admin/SelectedEvents";
import Users from "./basic_admin/Users";
import Admins from "./basic_admin/Admins";
import Purchases from "./basic_admin/Purchases";
import SelectedActivities from "./basic_admin/SelectedActivities";
import Organization from "./basic_admin/Organization";
import Legality from "./basic_admin/Legality";
import Withdraws from "./basic_admin/Withdraws";
import Events from "./basic_admin/Events";
import Middleware from "../partials/Middleware";
import Navbar from "../partials/Navbar";
import LoginPopUp from "./styles/LoginPopUp.module.css";
import LoginPopUpEl from "./LoginPopUp";
import { Alert } from "react-bootstrap";
import Logout from "./Logout";
import OrgType from "./basic_admin/OrgType";
import CommisionSetup from "./basic_admin/CommisionSetup";
import RefundSetup from "./basic_admin/RefundSetup";
import RefundCancelMng from "./basic_admin/RefundCancelMng";

const PageRoutes = () => {
	const [activeMenu, setActiveMenu] = useState("login");
	const [profileIcon, setProfileIcon] = useState(
		JSON.parse(localStorage.getItem("profile"))
	);
	const [loggedOn, setLoginState] = useState(1);

	return (
		<BrowserRouter>
			<Routes>
				{/* Basic Route */}
				<Route
					path="/login"
					element={
						<Login fnSetUserData={setProfileIcon} fnSetActive={setActiveMenu} fnSetLoginState={setLoginState} />
					}
				/>
			</Routes>
			<Navbar
				active={activeMenu}
				profileIcon={
					profileIcon === null
						? "/icons/profile-user.png"
						: process.env.REACT_APP_BACKEND_URL + profileIcon.photo
				}
				setProfileIcon={setProfileIcon}
				navDisplay={`${activeMenu === "login" ? "none" : ""}`}
				loginState={loggedOn}
				setLoginState={setLoginState}
			>
				<Routes>
						<Route
							path="/"
							element={
								<Dashboard
									fnSetActive={setActiveMenu}
									fnSetLoginState={setLoginState}
								/>
							}
						/>
						<Route
							path="/categories"
							element={
								<Categories
									fnSetActive={setActiveMenu}
									fnSetLoginState={setLoginState}
								/>
							}
						/>
						<Route
							path="/topics"
							element={
								<Topics
									fnSetActive={setActiveMenu}
									fnSetLoginState={setLoginState}
								/>
							}
						/>
						<Route
							path="/activity-topics"
							element={
								<ActivityTopics
									fnSetActive={setActiveMenu}
									fnSetLoginState={setLoginState}
								/>
							}
						/>
						<Route 
							path="/org-types"
							element={<OrgType 
								fnSetActive={setActiveMenu}
								fnSetLoginState={setLoginState} 
								/>
							}
						/>
						<Route
							path="/cities"
							element={
								<Cities
									fnSetActive={setActiveMenu}
									fnSetLoginState={setLoginState}
								/>
							}
						/>
						<Route
							path="/front-banners"
							element={
								<FrontBanners
									fnSetActive={setActiveMenu}
									fnSetLoginState={setLoginState}
								/>
							}
						/>
						<Route
							path="/spotlights"
							element={
								<Spotlights
									fnSetActive={setActiveMenu}
									fnSetLoginState={setLoginState}
								/>
							}
						/>
						<Route
							path="/special-days"
							element={
								<SpecialDays
									fnSetActive={setActiveMenu}
									fnSetLoginState={setLoginState}
								/>
							}
						/>
						<Route
							path="/selecteds"
							element={
								<SelectedEvents
									fnSetActive={setActiveMenu}
									fnSetLoginState={setLoginState}
								/>
							}
						/>
						<Route
							path="/selected-activities"
							element={
								<SelectedActivities
									fnSetActive={setActiveMenu}
									fnSetLoginState={setLoginState}
								/>
							}
						/>
						<Route
							path="/users"
							element={
								<Users
									fnSetActive={setActiveMenu}
									fnSetLoginState={setLoginState}
								/>
							}
						/>
						<Route
							path="/admins"
							element={
								<Admins
									fnSetActive={setActiveMenu}
									fnSetLoginState={setLoginState}
								/>
							}
						/>
						<Route
							path="/purchases"
							element={
								<Purchases
									fnSetActive={setActiveMenu}
									fnSetLoginState={setLoginState}
								/>
							}
						/>
						<Route
							path="/organizations"
							element={
								<Organization
									fnSetActive={setActiveMenu}
									fnSetLoginState={setLoginState}
								/>
							}
						/>
						<Route
							path="/legalities"
							element={
								<Legality
									fnSetActive={setActiveMenu}
									fnSetLoginState={setLoginState}
								/>
							}
						/>
						<Route
							path="/withdraws"
							element={
								<Withdraws
									fnSetActive={setActiveMenu}
									fnSetLoginState={setLoginState}
								/>
							}
						/>
						<Route
							path="/events"
							element={
								<Events
									fnSetActive={setActiveMenu}
									fnSetLoginState={setLoginState}
									loginState={loggedOn}
								/>
							}
						/>
						<Route
							path="/commision-setup"
							element={
								<CommisionSetup fnSetActive={setActiveMenu}
								fnSetLoginState={setLoginState}
								loginState={loggedOn} />
							}
						/>
						<Route
							path="/refund-setup"
							element={
								<RefundSetup fnSetActive={setActiveMenu}
								fnSetLoginState={setLoginState}
								loginState={loggedOn} />
							}
						 />
						 <Route
							path="/refund-cancel-manager"
							element={
								<RefundCancelMng fnSetActive={setActiveMenu}
								fnSetLoginState={setLoginState}
								loginState={loggedOn} />
							}
						 />
						<Route path="/logout" element={<Logout />} />
					</Routes>
			</Navbar>
		</BrowserRouter>
	);
};

export default PageRoutes;
