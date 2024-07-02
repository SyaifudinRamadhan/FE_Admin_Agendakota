import React, { useEffect, useRef, useState } from "react";
import style from "./styles/CommisionSetup.module.css";
import { BiInfoCircle, BiError } from "react-icons/bi";
import axios from "axios";
import Loading from "../../components/Loading";

const loadData = async () => {
  try {
    let data = await axios.get(
      process.env.REACT_APP_BACKEND_URL + "/api/commision-price",
      {
        headers: {
          "x-api-key": process.env.REACT_APP_BACKEND_KEY,
        },
      }
    );
    return {
      data: data.data,
      status: data.status,
    };
  } catch (error) {
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

const updateData = async ({
  ticket_commision,
  admin_fee_trx,
  admin_fee_wd,
  mul_pay_gate_fee,
  tax_fee,
}) => {
  try {
    await axios.post(
      process.env.REACT_APP_BACKEND_URL + "/api/admin/commision-price/update",
      {
        ticket_commision,
        admin_fee_trx,
        admin_fee_wd,
        mul_pay_gate_fee,
        tax_fee,
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

const CommisionSetup = ({
  fnSetActive = () => {},
  fnSetLoginState = () => {},
  loginState,
}) => {
  // ============= Control State ======================
  const [settingData, setSettingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pauseProcess, setPauseProcess] = useState({
    name: "",
    data: null,
    state: false,
  });

  // ============= Form Data ==========================
  const commision = useRef();
  const adminFeeTrx = useRef();
  const adminFeeWd = useRef();
  const multiplier = useRef();
  const taxPercentage = useRef();

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (
      !commision.current ||
      commision.current.value === "" ||
      !adminFeeTrx.current ||
      adminFeeTrx.current.value === "" ||
      !adminFeeWd.current ||
      adminFeeWd.current.value === "" ||
      !multiplier.current ||
      multiplier.current.value === "" ||
      !taxPercentage.current ||
      taxPercentage.current.value === ""
    ) {
      window.alert("All setup field are required to be filled in");
    } else {
      let data = {
        ticket_commision: commision.current.value / 100,
        admin_fee_trx: adminFeeTrx.current.value,
        admin_fee_wd: adminFeeWd.current.value,
        mul_pay_gate_fee: multiplier.current.value,
        tax_fee: taxPercentage.current.value / 100,
      };
      setLoading(true);
      updateData(data).then((res) => {
        if (res.status === 200) {
          window.alert("Data updated successfully !");
          setSettingData(res.data.profit_setting);
        } else if (res.status === 401) {
          fnSetLoginState(0);
          setPauseProcess({
            name: "update",
            data: data,
            state: true,
          });
        } else {
          window.alert("Data updated failed !");
        }
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    if (loading && !settingData) {
      fnSetActive("commision-setup");
      loadData().then((res) => {
        if (res.status === 200) {
          setSettingData(res.data.profit_setting);
        }
        setLoading(false);
      });
    }
  }, [loading, settingData]);

  useEffect(() => {
    if (pauseProcess.state && loginState) {
      setLoading(true);
      updateData({
        ticket_commision: pauseProcess.data.ticket_commision,
        admin_fee_trx: pauseProcess.data.admin_fee_trx,
        admin_fee_wd: pauseProcess.data.admin_fee_wd,
        mul_pay_gate_fee: pauseProcess.data.mul_pay_gate_fee,
        tax_fee: pauseProcess.data.tax_fee,
      }).then((res) => {
        if (res.status === 200) {
          window.alert("Data updated successfully !");
          setSettingData(res.data.profit_setting);
        } else {
          window.alert("Data updated failed !");
        }
        setLoading(false);
      });
    }
  }, [pauseProcess, loginState]);

  return (
    <div className="row ps-4 pe-4 pt-2 pb-2">
      <div className="col-12 mb-3">
        <h5>Commision Setup</h5>
      </div>
      <div className={`col-12 mb-3 p-3 bg-secondary-subtle rounded-4`}>
        <div className="d-flex gap-3">
          <div className="d-flex">
            <BiInfoCircle
              style={{ margin: "auto", width: "25px", height: "25px" }}
            />
          </div>
          <div className="">
            <p>
              This page is a setting for the profit value that will be obtained
              by Agendakota.id. The arrangements include :
            </p>
            <ol>
              <li>
                Ticket commission when the organizer makes a withdrawal (in
                percentage),{" "}
              </li>
              <li>Transaction fees charged to users when buying tickets, </li>
              <li>Admin fees for transfer withdrawals, </li>
              <li>
                <span>
                  <a href="https://www.xendit.co/id/biaya/">
                    Payment gateway platform fee
                  </a>{" "}
                  &nbsp; multiplier when users buy tickets (the aim is to
                  anticipate losses when there are refunds from users ),{" "}
                </span>
              </li>
              <li>
                And the amount of value added tax (PPN) that the user pays when
                purchasing a ticket.
              </li>
            </ol>
          </div>
        </div>
      </div>
      <div className={`col-12 mb-3 p-3 bg-secondary-subtle rounded-4`}>
        <div className="d-flex gap-3">
          <div className="d-flex">
            <BiInfoCircle
              style={{ margin: "auto", width: "25px", height: "25px" }}
            />
          </div>
          <div className="">
            <b>Ticket Transaction Formulas :</b>
            <p className="mb-0">
              <span>
                Total Selected Tickets + Admin Fee Transaction + (Total Selected
                Tickets x PPN) + (Mulltiply Payment Gateway Fee x &nbsp;
                <a href="https://www.xendit.co/id/biaya/">
                  Payment Gateway Fee
                </a>
                )
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className={`col-12 mb-3 p-3 bg-secondary-subtle rounded-4`}>
        <div className="d-flex gap-3">
          <div className="d-flex">
            <BiInfoCircle
              style={{ margin: "auto", width: "25px", height: "25px" }}
            />
          </div>
          <div className="">
            <b>Withdraw Formulas :</b>
            <p className="mb-0">
              (Result of Seeling Tickets - (Result of Seeling Tickets x Ticket
              Commision)) - Admin Fee Withdraw
            </p>
          </div>
        </div>
      </div>
      <div className="col-12 mb-3">
        {loading ? (
          <div className="mt-5">
            <Loading />
          </div>
        ) : !settingData ? (
          <>
            <div className={style.ErrorPage}>
              <div>
                <BiError />
                <h5>Terjadi Kesalahan ! Silahkan Muat Ulang Halaman !</h5>
              </div>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label for="commision" className="form-label">
                Ticket Commision Percentage (Ex: 3)
              </label>
              <input
                type="number"
                className="form-control"
                id="commision"
                aria-describedby="emailHelp"
                ref={commision}
                defaultValue={settingData.ticket_commision * 100}
              />
            </div>
            <div className="mb-3">
              <label for="admin-fee-trx" className="form-label">
                Admin Fee Transaction (In Rupiah. ex: 3000)
              </label>
              <input
                type="number"
                ref={adminFeeTrx}
                className="form-control"
                id="admin-fee-trx"
                defaultValue={settingData.admin_fee_trx}
              />
            </div>
            <div className="mb-3">
              <label for="admin-fee-wd" className="form-label">
                Admin Fee Withdraw (In Rupiah. ex: 3000)
              </label>
              <input
                type="number"
                ref={adminFeeWd}
                className="form-control"
                id="admin-fee-wd"
                defaultValue={settingData.admin_fee_wd}
              />
            </div>
            <div className="mb-3">
              <label for="mul-pay-gate-fee" className="form-label">
                Mulltiply Payment Gateway Fee (ex: 2)
              </label>
              <input
                type="number"
                className="form-control"
                id="mul-pay-gate-fee"
                ref={multiplier}
                defaultValue={settingData.mul_pay_gate_fee}
              />
            </div>
            <div className="mb-3">
              <label for="tax-percentage" className="form-label">
                Tax Percentage (PPN)
              </label>
              <input
                type="number"
                ref={taxPercentage}
                className="form-control"
                id="tax-percentage"
                defaultValue={settingData.tax_fee * 100}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Simpan
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CommisionSetup;
