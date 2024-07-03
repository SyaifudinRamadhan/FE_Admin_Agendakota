import React, { useEffect, useState } from "react";
import styles from "./styles/RefundCancel.module.css";
import axios from "axios";
import Loading from "../../components/Loading";
import { BiError, BiChevronLeft, BiRefresh } from "react-icons/bi";

const handleSuccess = (res) => {
  return {
    data: res.data,
    status: res.status,
  };
};

const handleError = (error) => {
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
};

const considerationRefund = async ({ trxId, approved, manualOp = 0 }) => {
  try {
    let res = await axios.post(
      process.env.REACT_APP_BACKEND_URL + "/api/admin/refund/change-state",
      {
        pay_id: trxId,
        approved: approved,
        set_finish: manualOp,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "x-api-key": process.env.REACT_APP_BACKEND_KEY,
        },
      }
    );
    return handleSuccess(res);
  } catch (error) {
    return handleError(error);
  }
};

const deleteTicket = async ({ ticketId, orgId, eventId }) => {
  try {
    let res = await axios.post(
      process.env.REACT_APP_BACKEND_URL +
        `/api/admin/org/${orgId}/event/${eventId}/manage/ticket/delete`,
      {
        ticket_id: ticketId,
        _method: "DELETE",
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "x-api-key": process.env.REACT_APP_BACKEND_KEY,
        },
      }
    );
    return handleSuccess(res);
  } catch (error) {
    return handleError(error);
  }
};

const rollbackTicket = async ({ ticketId, orgId, eventId }) => {
  try {
    let res = await axios.post(
      process.env.REACT_APP_BACKEND_URL +
        `/api/admin/org/${orgId}/event/${eventId}/manage/ticket/rollback`,
      {
        ticket_id: ticketId,
        _method: "PUT",
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "x-api-key": process.env.REACT_APP_BACKEND_KEY,
        },
      }
    );
    return handleSuccess(res);
  } catch (error) {
    return handleError(error);
  }
};

const loadData = async () => {
  try {
    let res = await axios.get(
      process.env.REACT_APP_BACKEND_URL + "/api/admin/refund-ticket-manager",
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "x-api-key": process.env.REACT_APP_BACKEND_KEY,
        },
      }
    );
    return handleSuccess(res);
  } catch (error) {
    return handleError(error);
  }
};

const ViewAll = ({ data, fnOpenDetail = () => {} }) => {
  return (
    <table className="table table-striped mt-3">
      <thead>
        <tr>
          <th scope="col">Event ID</th>
          <th scope="col">Event Name</th>
          <th scope="col">Status</th>
          <th scope="col">Available Withdraw</th>
          <th scope="col">Has Refund</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((data) => {
          return (
            <tr>
              <td>{data.id}</td>
              <td>{data.name}</td>
              <td>
                {data.deleted === 0
                  ? "Canceled/Deleted"
                  : data.is_publish === 1
                  ? "Draft"
                  : data.is_publish === 2
                  ? "Active"
                  : data.is_publish >= 3
                  ? "Ended"
                  : "Undefined"}
              </td>
              <td>{data.available_withdraw}</td>
              <td>{data.available_refund}</td>
              <td>
                <button
                  className="btn btn-warning"
                  onClick={() => {
                    fnOpenDetail(data);
                  }}
                >
                  View
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const ViewDetail = ({
  data,
  fnRemoveTicket = () => {},
  fnRollbackTicket = () => {},
  fnConsiderationRefund = () => {},
  fnReloadPage = () => {},
}) => {
  const [numberFormat, setNumFormat] = useState(Intl.NumberFormat("id-ID"));

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    window.alert("Email address has copied !");
  };

  const handleCopyAllEmail = () => {
    let strEmail = Object.values(data.user_trxs).reduce(
      (current, acc) =>
        current === ""
          ? (current = acc.user.email)
          : current + (", " + acc.user.email),
      ""
    );
    navigator.clipboard.writeText(strEmail);
    window.alert("All email address has copied !");
  };

  return (
    <div className="row ps-4 pe-4 pt-2 pb-2">
      <button
        className={`btn btn-primary rounded-pill d-flex gap-2 position-fixed ${styles.ReloadBtn}`}
        onClick={fnReloadPage}
      >
        <BiRefresh
          style={{ width: "25px", height: "25px" }}
          className="my-auto"
        />
        <span className="my-auto">Reload Data</span>
      </button>
      <div className={`col-12 ${styles.GroupBox} mb-3`}>
        <h6>Resume</h6>
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th scope="col">Available Withdraw</th>
              <th scope="col">Total Nominal Refund</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rp. {numberFormat.format(data.available_withdraw)},-</td>
              <td>Rp. {numberFormat.format(data.available_refund)},-</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={`col-12 ${styles.GroupBox} mb-3`}>
        <h6>Tickets</h6>
        <div
          className="overflow-y-auto"
          style={{ height: "calc(100% - 25px)" }}
        >
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Price</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.tickets.map((ticket) => {
                return (
                  <tr>
                    <td>{ticket.name}</td>
                    <td>
                      {ticket.type_price === 1
                        ? "Free"
                        : ticket.type_price === 3
                        ? "Custom (Min. 10.000)"
                        : "Rp." + numberFormat.format(ticket.price) + ",-"}
                    </td>
                    <td>
                      {ticket.deleted === 0 ? (
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            fnRemoveTicket(ticket.id, data.org_id, data.id);
                          }}
                        >
                          Delete
                        </button>
                      ) : (
                        <button
                          className="btn btn-warning"
                          onClick={() => {
                            fnRollbackTicket(ticket.id, data.org_id, data.id);
                          }}
                        >
                          Rollback
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className={`col-12 mb-3 ${styles.GroupBox}`}>
        <h6>Refund Datas</h6>
        <div
          className="overflow-y-auto"
          style={{ height: "calc(100% - 25px)" }}
        >
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th scope="col">From TRX ID</th>
                <th scope="col">Count Refund</th>
                <th scope="col">Total Nominal</th>
                <th scope="col">Transfer Mode</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(data.refund_datas).map((dataRf) => {
                return (
                  <tr>
                    <td>{dataRf[0].transaction_id}</td>
                    <td>{dataRf.length}</td>
                    <td>
                      Rp.{" "}
                      {numberFormat.format(
                        dataRf.reduce((current, acc) => {
                          // console.log(current, acc.refund_data);
                          return current + acc.refund_data.nominal;
                        }, 0)
                      )}
                      ,-
                    </td>
                    <td>
                      <span
                        class={`badge text-bg-${
                          dataRf[0].refund_data.mode === "auto"
                            ? "success"
                            : "warning"
                        }`}
                      >
                        {dataRf[0].refund_data.mode}
                      </span>
                    </td>
                    {dataRf.reduce(
                      (current, acc) =>
                        current && acc.refund_data.approve_admin === 1,
                      true
                    ) ? (
                      <td>
                        <span class="badge text-bg-success">Approved</span>
                      </td>
                    ) : (
                      <td className="gap-3">
                        <button
                          className="btn btn-outline-primary me-2 mt-2"
                          disabled={dataRf.reduce(
                            (current, acc) =>
                              current && acc.refund_data.approve_admin === 1,
                            true
                          )}
                          onClick={() => {
                            let disallow = dataRf.reduce(
                              (current, acc) =>
                                current && acc.refund_data.approve_admin === 1,
                              true
                            );
                            if (!disallow) {
                              fnConsiderationRefund(
                                dataRf[0].transaction_id,
                                data.id,
                                true,
                                1
                              );
                            }
                          }}
                        >
                          SetFinish
                        </button>
                        <button
                          className="btn btn-success me-2 mt-2"
                          disabled={dataRf.reduce(
                            (current, acc) =>
                              current && acc.refund_data.approve_admin === 1,
                            true
                          )}
                          onClick={() => {
                            let disallow = dataRf.reduce(
                              (current, acc) =>
                                current && acc.refund_data.approve_admin === 1,
                              true
                            );
                            if (!disallow) {
                              fnConsiderationRefund(
                                dataRf[0].transaction_id,
                                data.id,
                                true,
                                0
                              );
                            }
                          }}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger me-2 mt-2"
                          disabled={dataRf.reduce(
                            (current, acc) =>
                              current && acc.refund_data.approve_admin === 1,
                            true
                          )}
                          onClick={() => {
                            let disallow = dataRf.reduce(
                              (current, acc) =>
                                current && acc.refund_data.approve_admin === 1,
                              true
                            );
                            if (!disallow) {
                              fnConsiderationRefund(
                                dataRf[0].transaction_id,
                                data.id,
                                false,
                                0
                              );
                            }
                          }}
                        >
                          Un-Approve
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {data.manual_refunds.length > 0 ? (
        <div className={`col-12 mb-3 ${styles.GroupBox}`}>
          <h6>Manual Refund Datas</h6>
          <div
            className="overflow-y-auto"
            style={{ height: "calc(100% - 25px)" }}
          >
            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th scope="col">Email</th>
                  <th scope="col">Count Refund</th>
                  <th scope="col">Total Nominal</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(
                  data.manual_refunds.reduce((current, acc) => {
                    if (current[acc.user.email]) {
                      current[acc.user.email].push(acc);
                    } else {
                      current[acc.user.email] = [acc];
                    }
                    return current;
                  }, [])
                ).map((dataRf) => {
                  return (
                    <tr>
                      <td>{dataRf[0].user.email}</td>
                      <td>{dataRf.length}</td>
                      <td>
                        Rp.{" "}
                        {numberFormat.format(
                          dataRf.reduce((current, acc) => {
                            // console.log(current, acc.refund_data);
                            return current + acc.nominal;
                          }, 0)
                        )}
                        ,-
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className={`col-12 mb-3 ${styles.GroupBox}`}>
        <div className="d-flex mb-2">
          <h6 className="me-2">User Success Transactions</h6>
          <button
            className="btn btn-outline-primary ms-auto"
            onClick={handleCopyAllEmail}
          >
            Copy All Email
          </button>
        </div>
        <div
          className="overflow-y-auto"
          style={{ height: "calc(100% - 45px)" }}
        >
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">Nominal</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(data.user_trxs).map((userTrx) => {
                return (
                  <tr>
                    <td>{userTrx.user.name}</td>
                    <td>{userTrx.user.email}</td>
                    <td>Rp. {numberFormat.format(userTrx.nominal)},-</td>
                    <td>
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => {
                          handleCopyEmail(userTrx.user.email);
                        }}
                      >
                        Copy Email
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const RefundCancelMng = ({
  fnSetActive = () => {},
  fnSetLoginState = () => {},
  loginState,
}) => {
  // =========== State Control ==================
  const [loading, setLoading] = useState(true);
  const [pageMode, setPageMode] = useState({
    name: "all",
    data: null,
  });
  const [pausedProcess, setPausedProcess] = useState({
    name: "",
    data: null,
    state: false,
  });

  // =========== View Data ======================
  const [events, setEvents] = useState(null);

  // =========== Form Data ======================

  const handleOpenDetail = (data) => {
    setPageMode({
      name: "detail",
      data: data,
    });
  };

  const handleReloadPage = (eventId) => {
    setLoading(true);
    loadData().then((res) => {
      if (res.status === 200) {
        setEvents(res.data.events);
        res.data.events.forEach((event) => {
          if (event.id === eventId) {
            handleOpenDetail(event);
            window.alert("Reload success !");
          }
        });
      } else if (res.status === 401) {
        fnSetLoginState(0);
        setPausedProcess({
          name: "reload",
          data: eventId,
          state: true,
        });
      } else {
        window.alert("Failed access server. Try Again later !");
      }
      setLoading(false);
    });
  };

  const handleConsRefund = (trxId, eventId, approved, manualOp) => {
    setLoading(true);
    considerationRefund({ trxId: trxId, approved, manualOp }).then((res) => {
      if (res.status === 202) {
        window.alert(res.data.message.join(", "));
        handleReloadPage(eventId);
      } else if (res.status === 401) {
        fnSetLoginState(0);
        setPausedProcess({
          name: "consideration",
          data: { trxId, eventId, approved, manualOp },
          state: true,
        });
        setLoading(false);
      } else {
        window.alert(
          res.status === 404 ? res.data.data.error : "Failed access server !"
        );
        setLoading(false);
      }
    });
  };

  const handleDelTicket = (ticketId, orgId, eventId) => {
    setLoading(true);
    deleteTicket({ ticketId, orgId, eventId }).then((res) => {
      if (res.status === 202) {
        window.alert("Success deleted ticket !");
        handleReloadPage(eventId);
      } else if (res.status === 401) {
        fnSetLoginState(0);
        setPausedProcess({
          name: "delete-ticket",
          data: { ticketId, orgId, eventId },
          state: true,
        });
        setLoading(false);
      } else {
        window.alert(
          res.status === 404
            ? "Ticket data not found !"
            : "Failed access server !"
        );
        setLoading(false);
      }
    });
  };

  const handleRollbackTicket = (ticketId, orgId, eventId) => {
    setLoading(true);
    rollbackTicket({ ticketId, orgId, eventId }).then((res) => {
      if (res.status === 202) {
        window.alert("Success rollback ticket !");
        handleReloadPage(eventId);
      } else if (res.status === 401) {
        fnSetLoginState(0);
        setPausedProcess({
          name: "rollback-ticket",
          data: { ticketId, orgId, eventId },
          state: true,
        });
        setLoading(false);
      } else {
        window.alert(
          res.status === 404
            ? "Ticket data not found !"
            : "Failed access server !"
        );
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    if (!events && loginState) {
      fnSetActive("refund-cancel-manager");
      setLoading(true);
      loadData().then((res) => {
        if (res.status === 200) {
          setEvents(res.data.events);
        } else if (res.status === 401) {
          fnSetLoginState(0);
        } else if (res.status === 404) {
          setEvents([]);
        }
        setLoading(false);
      });
    }
  }, [loginState, events]);

  useEffect(() => {
    if (loginState && pausedProcess.state) {
      if (pausedProcess.name === "reload") {
        handleReloadPage(pausedProcess.data);
      } else if (pausedProcess.name === "consideration") {
        handleConsRefund(
          pausedProcess.data.trxId,
          pausedProcess.data.eventId,
          pausedProcess.data.approved,
          pausedProcess.data.manualOp
        );
      } else if (pausedProcess.name === "delete-ticket") {
        handleDelTicket(
          pausedProcess.data.ticketId,
          pausedProcess.data.orgId,
          pausedProcess.data.eventId
        );
      } else if (pausedProcess.name === "rollback-ticket") {
        handleRollbackTicket(
          pausedProcess.data.ticketId,
          pausedProcess.data.orgId,
          pausedProcess.data.eventId
        );
      }
      setPausedProcess({
        name: "",
        data: null,
        state: false,
      });
    }
  }, [loginState && pausedProcess]);

  return (
    <div className="row ps-4 pe-4 pt-2 pb-2">
      <div className="col-12 mb-3">
        {pageMode.name === "all" ? (
          <h5>Refund & Cancel Event Manager</h5>
        ) : (
          <div className="d-flex gap-2">
            <BiChevronLeft
              style={{ width: "25px", height: "25px" }}
              className="my-auto pointer"
              onClick={() => {
                setPageMode({ name: "all", data: null });
              }}
            />
            <h5
              className="my-auto mb-0 pointer"
              onClick={() => {
                setPageMode({ name: "all", data: null });
              }}
            >
              Refund & Cancel Event Manager
            </h5>
          </div>
        )}
      </div>
      <div className="col-12">
        {loading ? (
          <div className="mt-5">
            <Loading />
          </div>
        ) : !events ? (
          <div className={styles.ErrorPage}>
            <div>
              <BiError />
              <h5>Terjadi Kesalahan ! Silahkan Muat Ulang Halaman !</h5>
            </div>
          </div>
        ) : pageMode.name === "all" ? (
          <ViewAll data={events} fnOpenDetail={handleOpenDetail} />
        ) : (
          <ViewDetail
            data={pageMode.data}
            fnReloadPage={() => {
              handleReloadPage(pageMode.data.id);
            }}
            fnRemoveTicket={handleDelTicket}
            fnConsiderationRefund={handleConsRefund}
            fnRollbackTicket={handleRollbackTicket}
          />
        )}
      </div>
    </div>
  );
};

export default RefundCancelMng;
