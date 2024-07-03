import React, { useRef, useState, useEffect } from "react";
import styles from "./styles/Topics.module.css";
import styles2 from "./styles/Users.module.css";
import styles3 from "./styles/Purchases.module.css";
import Navbar from "../../partials/Navbar";
import {
  BiArrowBack,
  BiCalendar,
  BiEdit,
  BiLeftArrow,
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
import LegalityPopUpDetail from "./LegalityPopUpDetail";
import WithdrawPopUPDetail from "./WithdrawPopUpDetail";
import axios from "axios";

const dummyLoad = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 3000);
  });
};

const loadData = async () => {
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

const getDetail = async ({ wdId }) => {
  // Out key (withdraw)
  try {
    let wd = await axios.get(
      process.env.REACT_APP_BACKEND_URL +
        "/api/admin/withdraw/detail?wd_id=" +
        wdId,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "x-api-key": process.env.REACT_APP_BACKEND_KEY,
        },
      }
    );
    return {
      data: wd.data,
      status: wd.status,
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

const changeState = async ({ wdId, state, manualOp = 0 }) => {
  // out key (withdraw)
  try {
    await axios.post(
      process.env.REACT_APP_BACKEND_URL + "/api/admin/withdraw/change-state",
      {
        _method: "PUT",
        wd_id: wdId,
        state: state,
        set_finish: manualOp,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "x-api-key": process.env.REACT_APP_BACKEND_KEY,
        },
      }
    );
    return getDetail({ wdId: wdId });
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

const deleteWd = async ({ wdId }) => {
  // Out key (withdraws)
  try {
    await axios.post(
      process.env.REACT_APP_BACKEND_URL + "/api/admin/withdraw/delete",
      {
        _method: "DELETE",
        wd_id: wdId,
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

const Withdraws = ({ fnSetActive = () => {}, fnSetLoginState = () => {} }) => {
  const tableContent1 = useRef();
  const tableContent2 = useRef();
  const closePopUp = useRef();
  const progOpenPopUp = useRef();
  const dataTable = useRef();
  const dataTable2 = useRef();

  const [isLoading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    state: false,
    content: "",
    type: "",
  });
  const [sectionState, setSectionState] = useState(1);
  const [popUpTitle, setPopUpTitle] = useState("Withdraw Detail");
  const [showData, setData] = useState(null);
  const [modeView, setMode] = useState("wd-detail");
  const [detailValue, setDetailValue] = useState(null);
  const [wdWaiting, setNotifyWdWaiting] = useState(0);

  const resetAlert = () => {
    setTimeout(() => {
      setAlert({ state: false, content: "", type: "" });
    }, 3000);
  };

  const handleView = (wd) => {
    setDetailValue(wd);
  };

  const handleChangeState = (withdrawId, state, manualOp) => {
    // state -1 (reject) 0 (pending) 1 (acc)
    setLoading(true);
    closePopUp.current.click();
    let i = 0;
    changeState({ wdId: withdrawId, state: state, manualOp }).then((res) => {
      if (res.status === 200) {
        showData.forEach((wd) => {
          if (wd.id === withdrawId) {
            showData[i] = res.data.withdraw;
          }
          i++;
        });
        handleView(res.data.withdraw);
        setAlert({
          state: true,
          content: "Withdraw status succeesfully updated",
          type: "success",
        });
      } else {
        if (res.status === 401) {
          fnSetLoginState(0);
        }
        showData.forEach((wd) => {
          if (wd.id === withdrawId) {
            handleView(wd);
          }
          i++;
        });
        setAlert({
          state: true,
          content: Object.values(res.data.data).toString(),
          type: "danger",
        });
      }
      resetAlert();
      setLoading(false);
      progOpenPopUp.current.click();
    });
  };

  const handleHeightContent = () => {
    try {
      let height = window.innerHeight - 365;
      tableContent1.current.style.maxHeight = height + "px";
      tableContent2.current.style.maxHeight = height + "px";
    } catch (error) {
      console.log(error);
    }
    // tableContent.current.style.overflow = "auto";
    // console.log(height);
    // console.log(tableContent.current.style.overflow);
  };

  const mainSearch = (dataTable, key) => {
    let trs = dataTable.getElementsByTagName("tr");
    for (let i = 0; i < trs.length; i++) {
      let show = false;
      let tds = trs[i].getElementsByTagName("td");
      for (let j = 0; j < tds.length; j++) {
        if (tds[j].innerHTML.toLowerCase().includes(key)) {
          show = true;
        }
      }
      trs[i].style.display = show ? "table-row" : "none";
    }
  };

  const handleSearchWdWait = (e) => {
    let key = e.target.value.toLowerCase();
    mainSearch(dataTable.current, key);
  };

  const handleSearchWdAcc = (e) => {
    let key = e.target.value.toLowerCase();
    mainSearch(dataTable2.current, key);
  };

  useEffect(() => {
    handleHeightContent();
    window.addEventListener("resize", handleHeightContent);
    fnSetActive("withdraws");
  });

  useEffect(() => {
    if (showData === null) {
      setLoading(true);
      loadData().then((res) => {
        if (res.status === 200) {
          setData(res.data.withdraws);
        } else {
          if (res.status === 401) {
            fnSetLoginState(2);
          }
          setData([]);
        }
        setLoading(false);
      });
    } else {
      let notify = 0;
      showData.forEach((data) => {
        if (data.status == 0) {
          notify += 1;
        }
      });
      setNotifyWdWaiting(notify);
    }
  }, [showData]);

  return (
    <>
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
                {modeView === "legality" ? (
                  <BiArrowBack
                    className="me-2 pointer "
                    style={{ width: "20px", height: "20px", marginTop: "2px" }}
                    onClick={() => {
                      setMode("wd-detail");
                      setPopUpTitle("Withdraw Detail");
                    }}
                  />
                ) : (
                  <></>
                )}
                <h5>{popUpTitle}</h5>
                <button
                  type="button"
                  className={`btn-close ms-auto`}
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  ref={closePopUp}
                  onClick={() => {
                    handleView(null);
                  }}
                ></button>
              </div>
              {detailValue !== null ? (
                <div className="col-12 pt-2 ps-3 pe-3 pb-1">
                  {modeView === "wd-detail" ? (
                    <div className="row">
                      <div className="col-12 mb-3 mt-2">
                        <div
                          className={`alert ${
                            detailValue.legality_data.status
                              ? "alert-success"
                              : "alert-danger"
                          }`}
                          role="alert"
                          onClick={() => {
                            setMode("legality");
                            setPopUpTitle("Legality Data");
                          }}
                        >
                          <div className="row">
                            <div className="col-8 d-flex">
                              <p className="my-auto">
                                {!detailValue.legality_data.status ? (
                                  <b>Legality is still not Approved</b>
                                ) : (
                                  <b>Legality has been Approved</b>
                                )}{" "}
                                | Click this button to view legality data
                              </p>
                            </div>
                            <div className="col-4 d-flex">
                              <button className="btn btn-warning ms-auto position-relative">
                                legality
                                <span
                                  className={`position-absolute top-0 start-100 translate-middle p-2 ${
                                    detailValue.legality_data.status
                                      ? "bg-success"
                                      : "bg-danger"
                                  } border border-light rounded-circle`}
                                ></span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  {alert.state ? (
                    <div className={`alert alert-${alert.type}`} role="alert">
                      {alert.content}
                    </div>
                  ) : (
                    <></>
                  )}
                  {modeView === "legality" ? (
                    <LegalityPopUpDetail detailValue={detailValue} />
                  ) : (
                    <WithdrawPopUPDetail
                      data={detailValue}
                      fnChangeState={handleChangeState}
                    />
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={`row ps-4 pe-4 pt-2 pb-2 ${styles.MainContainer}`}>
        <div className="col-12 mb-3 d-flex">
          <h5>Withdraws</h5>
          <div
            className={`rounded-3 p-2 d-flex g-2 ms-auto ${styles3.TooglerBox}`}
          >
            <button
              className={`btn ${
                sectionState === 1 ? "bg-white" : ""
              } position-relative`}
              onClick={() => setSectionState(1)}
            >
              Waiting
              {wdWaiting > 0 ? (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {wdWaiting}
                  <span className="visually-hidden">Waiting legality data</span>
                </span>
              ) : (
                <></>
              )}
            </button>
            <button
              className={`btn ${sectionState === 2 ? "bg-white" : ""}`}
              onClick={() => setSectionState(2)}
            >
              Accepted
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
                    placeholder="Search with event or organization"
                    onInput={handleSearchWdWait}
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
                      <th scope="col" style={{ width: "35%" }}>
                        Event Name
                      </th>
                      <th scope="col" style={{ width: "35%" }}>
                        Organization
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
                        <th scope="col" style={{ width: "35%" }}>
                          Event Name
                        </th>
                        <th scope="col" style={{ width: "35%" }}>
                          Organization
                        </th>
                        <th scope="col" className="text-center">
                          Action
                        </th>
                      </tr>
                      <tr className="top-thead-inner-2">
                        <th scope="col" style={{ width: "35%" }}></th>
                        <th scope="col" style={{ width: "35%" }}></th>
                        <th scope="col" className="text-center"></th>
                      </tr>
                    </thead>
                    <tbody ref={dataTable}>
                      {showData &&
                        showData.map((wd) => {
                          if (wd.status === 0) {
                            return (
                              <tr>
                                <td>{wd.event.name}</td>
                                <td>{wd.organization.name}</td>
                                <td>
                                  <div className="d-flex">
                                    <button
                                      className="btn btn-warning m-auto"
                                      data-bs-target="#exampleModalToggle"
                                      data-bs-toggle="modal"
                                      onClick={() => {
                                        handleView(wd);
                                      }}
                                    >
                                      View
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          }
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
                    placeholder="Search with event or organization"
                    onInput={handleSearchWdAcc}
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
                      <th scope="col" style={{ width: "35%" }}>
                        Event Name
                      </th>
                      <th scope="col" style={{ width: "35%" }}>
                        Organization
                      </th>
                      <th scope="col">Transfer Mode</th>
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
                        <th scope="col" style={{ width: "35%" }}>
                          Event Name
                        </th>
                        <th scope="col" style={{ width: "35%" }}>
                          Organization
                        </th>
                        <th scope="col">Transfer Mode</th>
                        <th scope="col" className="text-center">
                          Action
                        </th>
                      </tr>
                      <tr className="top-thead-inner-2">
                        <th scope="col" style={{ width: "35%" }}></th>
                        <th scope="col" style={{ width: "35%" }}></th>
                        <th scope="col"></th>
                        <th scope="col" className="text-center"></th>
                      </tr>
                    </thead>
                    <tbody ref={dataTable2}>
                      {showData &&
                        showData.map((wd) => {
                          if (wd.status === 1) {
                            return (
                              <tr>
                                <td>{wd.event.name}</td>
                                <td>{wd.organization.name}</td>
                                <td>
                                  <span
                                    class={`badge text-bg-${
                                      wd.mode === "auto" ? "success" : "warning"
                                    }`}
                                  >
                                    {wd.mode === "auto"
                                      ? "auto-transfer"
                                      : "manual-transfer"}
                                  </span>
                                </td>
                                <td>
                                  <div className="d-flex">
                                    <button
                                      className="btn btn-warning m-auto"
                                      data-bs-target="#exampleModalToggle"
                                      data-bs-toggle="modal"
                                      onClick={() => {
                                        handleView(wd);
                                      }}
                                    >
                                      View
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          }
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

export default Withdraws;
