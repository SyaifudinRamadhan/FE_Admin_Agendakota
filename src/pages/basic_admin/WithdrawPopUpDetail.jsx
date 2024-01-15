import React from "react";

const WithdrawPopUPDetail = ({ data, fnChangeState = () => {} }) => {
	return (
		<div className="row">
			<div className="col-12 mt-2 mb-2">
				<div className="row">
					<div className="col-md-6">
						<p className="fw-bold">Event</p>
						<input
							type="text"
							className="form-control"
							value={data.event.name}
							readOnly
						/>
					</div>
					<div className="col-md-6">
						<p className="fw-bold">Organization</p>
						<input
							type="text"
							className="form-control"
							value={data.organization.name}
							readOnly
						/>
					</div>
				</div>
			</div>
			<div className="col-12 mb-2 mt-2">
				<div className="row">
					<div className="col-md-6">
						<p className="fw-bold">Bank Name</p>
						<input
							type="text"
							className="form-control"
							value={data.bank.bank_name}
							readOnly
						/>
					</div>
					<div className="col-md-6">
						<p className="fw-bold">Bank Account</p>
						<input
							type="text"
							className="form-control"
							value={data.bank.acc_number}
							readOnly
						/>
					</div>
					<div className="col-md-6">
						<p className="fw-bold">Account Name</p>
						<input
							type="text"
							className="form-control"
							value={data.bank.acc_name}
							readOnly
						/>
					</div>
					<div className="col-md-6">
						<p className="fw-bold">Account Status</p>
						<input
							type="text"
							className="form-control"
							value={
								data.bank.status == 1 && data.bank.deleted == 0
									? "Active"
									: "In-Active"
							}
							readOnly
						/>
					</div>
				</div>
			</div>
			<div className="col-12 mb-2 mt-2">
				<div className="row">
					<div className="col-md-6">
						<p className="fw-bold">Nominal</p>
						<input
							type="text"
							className="form-control"
							value={data.nominal}
							readOnly
						/>
					</div>
					<div className="col-md-6">
						<p className="fw-vold">Status</p>
						<div
							className={`badge ${
								data.status == 1
									? "bg-success"
									: data.status == 0
									? "bg-warning text-dark"
									: "bg-damger"
							}`}
						>
							{data.status == 1
								? "Accepted"
								: data.status == 0
								? "Waiting"
								: "Rejected"}
						</div>
					</div>
				</div>
			</div>
			{/* <div className="col-12 mb-2 mt-2">
				<div className="alert alert-warning">
					Use action button's bellow to change status the withdraw. After click
					"Accept" button, please immediately transfer moeney to account target
					with manually. And after it, please click button "Set Finish" to
					finishing record data about this withdraw. If you want pospondne
					transfer, you can find the finshed withdraw record (only for the
					status is accepted but finish status still not set) in tab verified.
					Please immediately cick button "Set Finish" after transfered.
				</div>
			</div> */}
			<div className="col-12 mb-2 mt-2">
				<p className="fw-bold">Action</p>
				{data.status == 0 ? (
					<div className="row mb-4">
						<div className="col-6">
							<button
								className="btn btn-danger w-100"
								onClick={() => {
									fnChangeState(data.id, -1);
								}}
							>
								Reject
							</button>
						</div>
						<div className="col-6">
							<button
								className="btn btn-success w-100"
								onClick={() => {
									fnChangeState(data.id, 1);
								}}
							>
								Accept
							</button>
						</div>
					</div>
				) : (
					<h5 className="m-auto text-center">Status Has Changed</h5>
				)}
				{data.status == 1 ? (
					<>
						<p className="fw-bold position-relative">Transfer Status</p>
						<div className="row">
							<div className="col-12 mb-5">
								{data.finish == 0 ? (
									<button className="btn btn-warning w-100 btn-disabled me-auto">
										On Process
									</button>
								) : (
									<button
										className="btn btn-warning w-100 btn-disabled me-auto"
										disabled
									>
										Finished
									</button>
								)}
							</div>
						</div>
					</>
				) : (
					<></>
				)}
			</div>
		</div>
	);
};

export default WithdrawPopUPDetail;
