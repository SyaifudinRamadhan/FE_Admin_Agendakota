import React, { useEffect, useRef, useState } from "react";
import style from "./styles/CommisionSetup.module.css";
import {
  BiInfoCircle,
  BiError,
  BiPlusCircle,
  BiEdit,
  BiTrash,
} from "react-icons/bi";
import axios from "axios";
import Loading from "../../components/Loading";

const loadData = async () => {
  try {
    let data = await axios.get(
      process.env.REACT_APP_BACKEND_URL + "/api/admin/refund-setting",
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

const addData = async ({ day_before, allow_refund }) => {
  try {
    await axios.post(
      process.env.REACT_APP_BACKEND_URL + "/api/admin/refund-setting/create",
      {
        day_before,
        allow_refund,
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

const updateData = async ({ day_before, allow_refund, id }) => {
  try {
    await axios.post(
      process.env.REACT_APP_BACKEND_URL + "/api/admin/refund-setting/update",
      {
        id,
        day_before,
        allow_refund,
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

const deleteData = async ({ id }) => {
  try {
    await axios.post(
      process.env.REACT_APP_BACKEND_URL + "/api/admin/refund-setting/delete",
      {
        id,
        _method: "DELETE",
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

const RefundSetup = ({
  fnSetActive = () => {},
  fnSetLoginState = () => {},
  loginState,
}) => {
  // ============= Control State ======================
  const [settingData, setSettingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInputDistance, setShowInDistance] = useState(true);
  const [popUpMode, setPopUpMode] = useState("add");
  const [showSpecialTooglePopUp, setShowSpcTooglePopUp] = useState(true);
  const [pauseProcess, setPauseProcess] = useState({
    name: "",
    data: null,
    state: false,
  });

  // ============= Form Data ==========================
  const distanceHour = useRef();
  const percentageValue = useRef();
  const forDeleted = useRef();
  const mainBtnClosePopUp = useRef();

  const handleOpenPopUp = (data, allData) => {
    let hasSpc = false;
    if (allData) {
      allData.forEach((dataInner) => {
        if (dataInner.day_before === -1) {
          hasSpc = true;
        }
      });
    }
    if (data) {
      distanceHour.current.value = data.day_before;
      percentageValue.current.value = data.allow_refund * 100;
      if (data.day_before === -1 && forDeleted.current) {
        forDeleted.current.checked = true;
      }
      if (hasSpc && data.day_before !== -1) {
        setShowSpcTooglePopUp(false);
        setShowInDistance(true);
      } else if (data.day_before === -1) {
        setShowSpcTooglePopUp(true);
        setShowInDistance(false);
        setTimeout(() => {
          if (forDeleted.current) {
            forDeleted.current.checked = true;
          }
        }, 100);
      } else {
        setShowSpcTooglePopUp(true);
        setShowInDistance(true);
      }
    } else if (!data && hasSpc) {
      setShowSpcTooglePopUp(false);
      setShowInDistance(true);
    } else if (!data && !hasSpc) {
      setShowSpcTooglePopUp(true);
      setShowInDistance(true);
    }
  };

  const setForDeletedEvent = (e) => {
    if (e.target.checked === true) {
      setShowInDistance(false);
      distanceHour.current.value = -1;
    } else {
      setShowInDistance(true);
      distanceHour.current.value = null;
    }
  };

  const resetForm = () => {
    distanceHour.current.value = null;
    percentageValue.current.value = null;
    if (forDeleted.current) {
      forDeleted.current.checked = false;
    }
  };

  const handleSubmit = (evt, mode) => {
    evt.preventDefault();
    if (
      !distanceHour.current ||
      distanceHour.current.value === "" ||
      !percentageValue.current ||
      percentageValue.current.value === ""
    ) {
      window.alert("All setup field are required to be filled in");
    } else {
      setLoading(true);
      if (mode === "add") {
        addData({
          day_before: distanceHour.current.value,
          allow_refund: parseFloat(percentageValue.current.value) / 100,
        }).then((res) => {
          if (res.status === 200) {
            window.alert("Add data successfully !");
            setSettingData(res.data.refund_settings);
            resetForm();
          } else if (res.status === 401) {
            fnSetLoginState(0);
            setPauseProcess({
              name: "add",
              data: {
                day_before: distanceHour.current.value,
                allow_refund: percentageValue.current.value,
              },
              state: true,
            });
          } else {
            window.alert("Add data failed !");
          }
          setLoading(false);
          mainBtnClosePopUp.current.click();
        });
      } else {
        updateData({
          id: mode,
          day_before: distanceHour.current.value,
          allow_refund: parseFloat(percentageValue.current.value) / 100,
        }).then((res) => {
          console.log(res.status);
          if (res.status === 200) {
            window.alert("Data updated successfully !");
            setSettingData(res.data.refund_settings);
            resetForm();
          } else if (res.status === 401) {
            fnSetLoginState(0);
            setPauseProcess({
              name: "update",
              data: {
                id: mode,
                day_before: distanceHour.current.value,
                allow_refund: percentageValue.current.value,
              },
              state: true,
            });
          } else {
            window.alert("Data updated failed !");
          }
          setLoading(false);
          mainBtnClosePopUp.current.click();
        });
      }
    }
  };

  const handleDelete = (id) => {
    setLoading(true);
    deleteData({
      id,
    }).then((res) => {
      if (res.status === 200) {
        window.alert("Data deleted successfully !");
        setSettingData(res.data.refund_settings);
      } else if (res.status === 401) {
        fnSetLoginState(0);
        setPauseProcess({
          name: "delete",
          data: { id: id },
          state: true,
        });
      } else {
        window.alert("Data deleted failed !");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    if (loading && !settingData) {
      fnSetActive("refund-setup");
      loadData().then((res) => {
        if (res.status === 200) {
          setSettingData(res.data.refund_settings);
        }
        setLoading(false);
      });
    }
  }, [loading, settingData]);

  useEffect(() => {
    if (pauseProcess.state && loginState === 1) {
      if (pauseProcess.name === "add") {
        setLoading(true);
        addData({
          day_before: pauseProcess.data.day_before,
          allow_refund: parseFloat(pauseProcess.data.allow_refund) / 100,
        }).then((res) => {
          if (res.status === 200) {
            window.alert("Add data successfully !");
            setSettingData(res.data.refund_settings);
            resetForm();
          } else {
            window.alert("Add data failed !");
          }
          setLoading(false);
          mainBtnClosePopUp.current.click();
        });
      } else if (pauseProcess.name === "update") {
        setLoading(true);
        updateData({
          id: pauseProcess.data.id,
          day_before: pauseProcess.data.day_before,
          allow_refund: parseFloat(pauseProcess.data.allow_refund) / 100,
        }).then((res) => {
          if (res.status === 200) {
            window.alert("Data updated successfully !");
            setSettingData(res.data.refund_settings);
            resetForm();
          } else {
            window.alert("Data updated failed !");
          }
          setLoading(false);
          mainBtnClosePopUp.current.click();
        });
      } else if (pauseProcess.name === "delete") {
        handleDelete(pauseProcess.data.id);
      }
      setPauseProcess({
        name: "",
        data: null,
        state: false,
      });
    }
  }, [pauseProcess, loginState]);

  return (
    <div className="row ps-4 pe-4 pt-2 pb-2">
      <div className="col-12 mb-3">
        <h5>Refund Setup</h5>
      </div>
      <div className={`col-12 mb-3 p-3 bg-secondary-subtle rounded-4`}>
        <div className="d-flex gap-3">
          <div className="d-flex">
            <BiInfoCircle
              style={{ margin: "auto", width: "25px", height: "25px" }}
            />
          </div>
          <div className="">
            <p className="mb-0">
              This page is used to set the refund value that is allowed for a
              certain period of time before the event takes place, or before the
              visit time selected by the user
            </p>
          </div>
        </div>
      </div>
      <div
        className={`modal fade ${loading ? "d-none" : ""}`}
        id="add-modal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-fullscreen-md-down modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {popUpMode === "add" ? "Add" : "Edit"} Rule
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form
              onSubmit={(e) => {
                handleSubmit(e, popUpMode);
              }}
            >
              <div className="modal-body">
                <div className={`mb-3 ${showInputDistance ? "" : "d-none"}`}>
                  <label for="distance-value" className="col-form-label">
                    Distance From Start Event / Selected Visit Date User :
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="distance-value"
                    ref={distanceHour}
                  />
                </div>
                {showSpecialTooglePopUp ? (
                  <div className="form-check form-switch mb-3 ps-0 pe-3 d-flex">
                    <label
                      className="form-check-label me-3 pointer"
                      for="special-deleted-event"
                    >
                      Setting Allow Refund Percentage for Deleted / Canceled
                      Event (Special)
                    </label>
                    <input
                      className="form-check-input my-auto ms-auto"
                      type="checkbox"
                      role="switch"
                      id="special-deleted-event"
                      ref={forDeleted}
                      onChange={setForDeletedEvent}
                    />
                  </div>
                ) : (
                  <></>
                )}
                <div className="mb-3">
                  <label
                    for="refund-value-percentage"
                    className="col-form-label"
                  >
                    Allow Refund Value (%) :
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="refund-value-percentage"
                    ref={percentageValue}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  ref={mainBtnClosePopUp}
                >
                  Close
                </button>
                <button type="sumbit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
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
          <div className="row">
            <button
              className="btn btn-primary rounded-pill ms-auto d-flex gap-2"
              style={{ width: "unset" }}
              data-bs-toggle="modal"
              data-bs-target="#add-modal"
              onClick={() => {
                setPopUpMode("add");
                handleOpenPopUp(null, settingData);
                resetForm();
              }}
            >
              <BiPlusCircle className="my-auto" />
              <span>Tambah</span>
            </button>
            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th scope="col">Distance Hours</th>
                  <th scope="col">Allow Refund (%)</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {settingData.map((data) => {
                  return (
                    <tr>
                      <td>
                        {data.day_before === -1
                          ? "For Deleted / Canceled Event"
                          : data.day_before}
                      </td>
                      <td>{data.allow_refund * 100}</td>
                      <td>
                        <div className="w-100 d-flex gap-2">
                          <button
                            className="btn btn-warning d-flex gap-2"
                            data-bs-toggle="modal"
                            data-bs-target="#add-modal"
                            onClick={() => {
                              setPopUpMode(data.id);
                              handleOpenPopUp(data, settingData);
                            }}
                          >
                            <BiEdit />
                            <span>Edit</span>
                          </button>
                          <button
                            className="btn btn-danger d-flex gap-2"
                            onClick={() => {
                              window.confirm(
                                "Are you sure to delete this rule ?"
                              )
                                ? handleDelete(data.id)
                                : window.alert("Data canceled deleted");
                            }}
                          >
                            <BiTrash />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RefundSetup;
