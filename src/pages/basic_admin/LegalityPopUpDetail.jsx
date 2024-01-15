import React from "react";
import InputImage from "../../components/InputImage";

const LegalityPopUpDetail = ({ detailValue }) => {
	return (
		<div className="row">
			<div className="col-12 mt-2 mb-3">
				<p className="fw-bold">Company Type</p>
				<div className="d-flex">
					<button
						className={`btn`}
						style={{
							backgroundColor: `${
								detailValue.legality_data.type_legality === "company"
									? "#ddd"
									: "rgba(221, 0, 100, 0.07)"
							}`,
							border: `1px solid ${
								detailValue.legality_data.type_legality === "company"
									? "#ddd"
									: "#DD0064"
							}`,
							color: "#000",
						}}
					>
						Personal
					</button>
					<button
						className={`btn ms-2`}
						style={{
							backgroundColor: `${
								detailValue.legality_data.type_legality !== "company"
									? "#ddd"
									: "rgba(221, 0, 100, 0.07)"
							}`,
							border: `1px solid ${
								detailValue.legality_data.type_legality !== "company"
									? "#ddd"
									: "#DD0064"
							}`,
							color: "#000",
						}}
					>
						Company
					</button>
				</div>
			</div>
			<div className="col-12 mb-3">
				<div className="row">
					<div className="col-md-6">
						<p className="fw-bold">Company Name</p>
						<input
							type="text"
							placeholder="Write the company name"
							className="form-control"
							value={detailValue.legality_data.company_name}
							readOnly
						/>
					</div>
					{detailValue.legality_data.type_legality === "company" ? (
						<div className="col-md-6">
							<p className="fw-bold">Bussiness Entity</p>
							<input
								type="text"
								placeholder="Write the company entity"
								className="form-control"
								value={detailValue.legality_data.business_entity}
								readOnly
							/>
						</div>
					) : (
						<></>
					)}
				</div>
			</div>
			<div className="col-12 mb-3">
				<p className="fw-bold">PIC Name</p>
				<input
					type="text"
					placeholder="Write the company name"
					className="form-control"
					value={detailValue.legality_data.pic_name}
					readOnly
				/>
			</div>
			<div className="col-12 mb-3">
				<div className="row">
					<div className="col-md-4">
						<p className="fw-bold">PIC NIC (KTP)</p>
						<div
							className="pointer"
							onClick={() => {
								window
									.open(
										process.env.REACT_APP_BACKEND_URL +
											detailValue.legality_data.pic_nic_image,
										"_blank"
									)
									.focus();
							}}
						>
							<InputImage
								style={{
									height: "unset",
									aspectRatio: "16 / 9",
								}}
								hiddenDelete={true}
								defaultFile={
									process.env.REACT_APP_BACKEND_URL +
									detailValue.legality_data.pic_nic_image
								}
							/>
						</div>
					</div>
					<div className="col-md-4">
						<p className="fw-bold">Tax (NPWP)</p>
						<div
							className="pointer"
							onClick={() => {
								window
									.open(
										process.env.REACT_APP_BACKEND_URL +
											detailValue.legality_data.tax_image,
										"_blank"
									)
									.focus();
							}}
						>
							<InputImage
								style={{
									height: "unset",
									aspectRatio: "16 / 9",
								}}
								hiddenDelete={true}
								defaultFile={
									process.env.REACT_APP_BACKEND_URL +
									detailValue.legality_data.tax_image
								}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="col-12 mb-3">
				<p className="fw-bold">NIC Number (NIK)</p>
				<input
					type="text"
					placeholder="write NIC Nummber"
					className="form-control"
					value={detailValue.legality_data.pic_nic}
					readOnly
				/>
			</div>
			<div className="col-12 mb-4">
				<p className="fw-bold">Tax Number</p>
				<input
					type="text"
					placeholder="Write Tax ID number (npwp)"
					className="form-control"
					value={detailValue.legality_data.tax_id_number}
					readOnly
				/>
			</div>
		</div>
	);
};

export default LegalityPopUpDetail;
