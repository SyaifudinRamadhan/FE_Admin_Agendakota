import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/Topics.module.css";
import styles2 from "./styles/Categories.module.css";
import Navbar from "../../partials/Navbar";
import Event from "../../components/Event";
import {
  BiAnchor,
  BiBus,
  BiCalendarCheck,
  BiCalendarEvent,
  BiCheckCircle,
  BiEdit,
  BiHide,
  BiPlusCircle,
  BiSave,
  BiSearch,
  BiShow,
  BiTrash,
  BiX,
  BiXCircle,
  BiRotateLeft,
} from "react-icons/bi";
import Loading from "../../components/Loading";
import axios from "axios";
import { Alert } from "react-bootstrap";

const dummyLoad = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 3000);
  });
};

const loadCategories = async () => {
  try {
    let data = await axios.get(
      process.env.REACT_APP_BACKEND_URL + "/api/categories",
      {
        headers: {
          "x-api-key": process.env.REACT_APP_BACKEND_KEY,
        },
      }
    );
    console.log(data);
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

const loadData = async () => {
  try {
    let events = await axios.get(
      process.env.REACT_APP_BACKEND_URL + "/api/admin/all-event",
      {
        headers: {
          "x-api-key": process.env.REACT_APP_BACKEND_KEY,
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      }
    );
    return {
      data: events.data,
      status: events.status,
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

const loadDelete = async ({ orgId, eventId }) => {
  try {
    let res = await axios.post(
      process.env.REACT_APP_BACKEND_URL +
        "/api/admin/org/" +
        orgId +
        "/event/delete",
      {
        event_id: eventId,
        _method: "DELETE",
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "x-api-key": process.env.REACT_APP_BACKEND_KEY,
        },
      }
    );
    return {
      data: res.data,
      status: res.status,
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

const loadRollback = async ({ orgId, eventId }) => {
  try {
    let res = await axios.post(
      process.env.REACT_APP_BACKEND_URL +
        "/api/admin/org/" +
        orgId +
        "/event/rollback",
      {
        event_id: eventId,
        _method: "PUT",
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "x-api-key": process.env.REACT_APP_BACKEND_KEY,
        },
      }
    );
    return {
      data: res.data,
      status: res.status,
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

const Events = ({
  fnSetActive = () => {},
  fnSetLoginState = () => {},
  loginState,
}) => {
  const inputTitle = useRef();
  const closePopUp = useRef();
  const inputFilter = useRef();
  const inputSearch = useRef();
  const dataRow = useRef();

  const [isLoading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    state: false,
    content: "",
    type: "",
  });
  const [showData, setDataShow] = useState(null);
  const [showCategories, setCategories] = useState(null);
  const [delState, setDelSState] = useState(0);
  const [pausedProcess, ssetPausedProcess] = useState("");

  const resetAlert = () => {
    setTimeout(() => {
      setAlert({ state: false, content: "", type: "" });
    }, 3000);
  };

  const handleDelete = (orgId, eventId) => {
    setLoading(true);
    loadDelete({ orgId: orgId, eventId: eventId }).then((res) => {
      if (res.status === 202) {
        window.alert("Data berhasil dihapus !!!");
        setDelSState(null);
        setTimeout(() => {
          setDelSState(0);
        }, 50);
      } else if (res.status === 401) {
        ssetPausedProcess("delete@" + orgId + "@" + eventId);
        fnSetLoginState(0);
      } else if (res.status === 404) {
        window.alert("Data tidak dapat ditemukan !!!");
      } else {
        window.alert(
          "Data gagal dihapus, karena masalah server. Silahkan coba kembali !!!"
        );
      }
      setLoading(false);
    });
  };

  const handleRolllback = (orgId, eventId) => {
    setLoading(true);
    loadRollback({ orgId: orgId, eventId: eventId }).then((res) => {
      if (res.status === 202) {
        window.alert("Data berhasil dikembalikan !!!");
        setDelSState(null);
        setTimeout(() => {
          setDelSState(1);
        }, 50);
      } else if (res.status === 401) {
        ssetPausedProcess("rollback@" + orgId + "@" + eventId);
        fnSetLoginState(0);
      } else if (res.status === 404) {
        window.alert("Data tidak dapat ditemukan !!!");
      } else {
        window.alert(
          "Data gagal dikembalikan, karena masalah server. Silahkan coba kembali !!!"
        );
      }
      setLoading(false);
    });
  };

  const handleSearch = (e) => {
    let key = e.target.value.toLowerCase();
    let cards = dataRow.current.getElementsByClassName("event-card");
    for (let i = 0; i < cards.length; i++) {
      console.log(
        "Search : ",
        cards[i]
          .getElementsByClassName("title-key")[0]
          .innerHTML.toLowerCase()
          .includes(key),
        key
      );
      if (
        cards[i]
          .getElementsByClassName("title-key")[0]
          .innerHTML.toLowerCase()
          .includes(key)
      ) {
        cards[i].style.display = "flex";
      } else {
        cards[i].style.display = "none";
      }
    }
  };

  const handleFilter = (e) => {
    let key = e.target.value.toLowerCase();
    let cards = dataRow.current.getElementsByClassName("event-card");
    for (let i = 0; i < cards.length; i++) {
      if (
        cards[i]
          .getElementsByClassName("category-key")[0]
          .innerHTML.toLowerCase()
          .includes(key)
      ) {
        cards[i].style.display = "flex";
      } else {
        cards[i].style.display = "none";
      }
    }
  };

  useEffect(() => {
    fnSetActive("events");
  });

  useEffect(() => {
    if (showCategories === null) {
      setLoading(true);
      loadCategories().then((res) => {
        if (res.status === 200) {
          setCategories(res.data.categories);
        } else {
          if (res.status === 401) {
            fnSetLoginState(2);
          }
          setCategories([]);
        }
        setLoading(false);
      });
    }
  }, [showCategories]);

  useEffect(() => {
    if (delState !== null) {
      setLoading(true);
      loadData().then((res) => {
        if (res.status === 200) {
          let events = [];
          res.data.events.forEach((event) => {
            if (event.deleted === delState) {
              events.push(event);
            }
          });
          setDataShow(events);
        } else {
          if (res.status === 401) {
            fnSetLoginState(2);
          }
          setDataShow([]);
        }
        setLoading(false);
      });
    }
  }, [delState]);

  useEffect(() => {
    if (loginState) {
      if (pausedProcess.split("@")[0] === "delete") {
        handleDelete(pausedProcess.split("@")[1], pausedProcess.split("@")[2]);
      } else if (pausedProcess.split("@")[0] === "rollback") {
        handleRolllback(
          pausedProcess.split("@")[1],
          pausedProcess.split("@")[2]
        );
      }
    }
  }, [loginState, pausedProcess]);

  return (
    <>
      {/* ===== PopUp for first data spotlight event ====== */}
      <div
        className="modal fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabindex="-1"
      >
        <div
          className={`modal-dialog modal-dialog-centered ${styles.PopUpAdd}`}
        >
          <div className="modal-content">
            <div className="row m-0">
              <div className="col-12 d-flex pt-4 ps-3 pe-3 pb-1">
                <h5>Add Event / Activites</h5>
                <button
                  type="button"
                  className="btn-close ms-auto"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  ref={closePopUp}
                ></button>
              </div>
              <div className="col-12 mt-3 mb-5 p-5 pt-3">
                <div className="row">
                  <div className="col-12 mb-5 text-center">
                    Select Action Type
                  </div>
                  <div className="col-md-3">
                    <div
                      className={`p-3 ${styles2.AddBtn}`}
                      data-bs-target="#exampleModalToggle"
                      data-bs-toggle="modal"
                    >
                      <BiCalendarEvent />
                      <div className={`${styles2.TextBtn}`}>Add Event</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div
                      className={`p-3 ${styles2.AddBtn}`}
                      data-bs-target="#exampleModalToggle"
                      data-bs-toggle="modal"
                    >
                      <BiCalendarCheck />
                      <div className={`${styles2.TextBtn}`}>
                        Add Daily Activities
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div
                      className={`p-3 ${styles2.AddBtn}`}
                      data-bs-target="#exampleModalToggle"
                      data-bs-toggle="modal"
                    >
                      <BiBus />
                      <div className={`${styles2.TextBtn}`}>
                        Add Tour Travel (reccuring)
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div
                      className={`p-3 ${styles2.AddBtn}`}
                      data-bs-target="#exampleModalToggle"
                      data-bs-toggle="modal"
                    >
                      <BiAnchor />
                      <div className={`${styles2.TextBtn}`}>Add Attraction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* =========================================================== */}
      <div className={`row ps-4 pe-4 pt-2 pb-2 ${styles.MainContainer}`}>
        <div className="col-12 mb-3 d-flex">
          <div className="me-auto">
            <button
              className="btn btn-primary rounded-pill me-auto"
              data-bs-target="#exampleModalToggle"
              data-bs-toggle="modal"
            >
              <BiPlusCircle /> Add Event / Activity
            </button>
          </div>
          <div
            className={`rounded-3 p-2 d-flex g-2 ms-auto ${styles.TooglerBox}`}
          >
            <button
              className={`btn ${delState === 0 ? "bg-white" : ""}`}
              onClick={() => setDelSState(0)}
            >
              Active Events
            </button>
            <button
              className={`btn ${delState === 1 ? "bg-white" : ""}`}
              onClick={() => setDelSState(1)}
            >
              Deleted
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

            <div className="col-12">
              <div className="row mt-2 mb-4">
                <div className="col-md-6 mt-2">
                  <select
                    className="form-select"
                    placeholder="Category Filter"
                    aria-label="Category Filter"
                    ref={inputFilter}
                    onChange={handleFilter}
                  >
                    <option value="">All</option>
                    {showCategories &&
                      showCategories.map((cat) => {
                        return <option value={cat.name}>{cat.name}</option>;
                      })}
                  </select>
                </div>
                <div className="col-md-6 mt-2 d-flex">
                  <input
                    type="text"
                    placeholder="Search by name event / activity"
                    className="form-control ms-auto"
                    ref={inputSearch}
                    onInput={handleSearch}
                  />
                  <button className="btn btn-primary" disabled>
                    <BiSearch />
                  </button>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="alert alert-info d-flex">
                <div className="my-auto">
                  <b>INFORMASI</b> Jika ingin memuat data terbaru, silahkan
                  lakukan reload page, atau klik tombol reload berikut
                </div>
                <button
                  className="btn btn-warning ms-auto my-auto"
                  onClick={() => {
                    setDelSState(null);
                    setTimeout(() => {
                      setDelSState(0);
                    }, 50);
                  }}
                >
                  Reload
                </button>
              </div>
            </div>
            <div
              className="col-12 d-flex gap-3"
              style={{ flexDirection: "row", flexWrap: "wrap" }}
              ref={dataRow}
            >
              {showData &&
                showData.map((event, e) => (
                  <Event
                    className={["event-card"]}
                    data={event}
                    key={e}
                    deleteIcon={{
                      state: true,
                      onClick: () => {
                        if (delState === 0) {
                          handleDelete(event.org.id, event.id);
                        } else if (delState === 1) {
                          handleRolllback(event.org.id, event.id);
                        }
                      },
                      customIcon:
                        delState === 0 ? undefined : (
                          <BiRotateLeft className="m-auto fs-4" />
                        ),
                    }}
                    forOrganizer={true}
                  />
                ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Events;
