import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/Topics.module.css";
import Navbar from "../../partials/Navbar";
import Slider from "../../components/Slider";
import Event from "../../components/Event";
import styles2 from "./styles/Categories.module.css";
import styles3 from "./styles/Cities.module.css";
import {
  BiCheckCircle,
  BiEdit,
  BiHide,
  BiPlusCircle,
  BiSave,
  BiShow,
  BiTrash,
  BiX,
  BiXCircle,
} from "react-icons/bi";
import Loading from "../../components/Loading";
import { redirect, useNavigate } from "react-router-dom";
import InputImage from "../../components/InputImage";
import Select from "react-select";
import axios from "axios";

const dummyLoad = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 3000);
  });
};

// Load all events
const loadEvents = async () => {
  try {
    let events = await axios.get(
      process.env.REACT_APP_BACKEND_URL + "/api/pop-events",
      {
        headers: {
          "x-api-key": process.env.REACT_APP_BACKEND_KEY,
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

// Load all special day + events data
const loadData = async () => {
  // output key  = special-days
  try {
    let data = await axios.get(
      process.env.REACT_APP_BACKEND_URL + "/api/admin/special-days",
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

const addSpotlight = async ({ title }) => {
  // output key  = special_days
  try {
    await axios.post(
      process.env.REACT_APP_BACKEND_URL + "/api/admin/special-day/create",
      {
        title: title,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "Content-Type": "multipart/form-data",
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

const updateSpotlight = async ({ spotlightId, title }) => {
  // output key  = special_day
  try {
    await axios.post(
      process.env.REACT_APP_BACKEND_URL + "/api/admin/special-day/update",
      {
        special_day_id: spotlightId,
        title: title,
        _method: "PUT",
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "Content-Type": "multipart/form-data",
          "x-api-key": process.env.REACT_APP_BACKEND_KEY,
        },
      }
    );
    return getSpotlightData({ spotlightId: spotlightId });
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

const delSpotlight = async ({ spotlightId }) => {
  // output key  = special_days
  try {
    await axios.post(
      process.env.REACT_APP_BACKEND_URL + "/api/admin/special-day/delete",
      {
        special_day_id: spotlightId,
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

const setActive = async ({ spotlightId }) => {
  // output key  = spotlights
  try {
    await axios.post(
      process.env.REACT_APP_BACKEND_URL + "/api/admin/special-day/set-view",
      {
        special_day_id: spotlightId,
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
// ==================================================================
const getSpotlightData = async ({ spotlightId }) => {
  // output key  = special_day (main)
  try {
    let data = await axios.get(
      process.env.REACT_APP_BACKEND_URL +
        "/api/special-day?special_day_id=" +
        spotlightId,
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

const addEventSpotlight = async ({ spotlightId, eventId }) => {
  // output key  = special_day
  console.log({ spotlightId, eventId });
  try {
    await axios.post(
      process.env.REACT_APP_BACKEND_URL + "/api/admin/special-day/event/add",
      {
        special_day_id: spotlightId,
        event_id: eventId,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "x-api-key": process.env.REACT_APP_BACKEND_KEY,
        },
      }
    );
    return getSpotlightData({ spotlightId: spotlightId });
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

const toLeftInSpotlight = async ({ spotlightEventId }) => {
  // output key = special_day_events
  try {
    let data = await axios.post(
      process.env.REACT_APP_BACKEND_URL +
        "/api/admin/special-day/event/set-prio-plus",
      {
        special_day_event_id: spotlightEventId,
      },
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

const toRightInSpotlight = async ({ spotlightEventId }) => {
  // output key = special_day_events
  try {
    let data = await axios.post(
      process.env.REACT_APP_BACKEND_URL +
        "/api/admin/special-day/event/set-prio-min",
      {
        special_day_event_id: spotlightEventId,
      },
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

const delDataInSpotlight = async ({ spotlightId, spotlightEventId }) => {
  // output key = special_day_events
  try {
    let data = await axios.post(
      process.env.REACT_APP_BACKEND_URL + "/api/admin/special-day/event/delete",
      {
        special_day_event_id: spotlightEventId,
        _method: "DELETE",
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "x-api-key": process.env.REACT_APP_BACKEND_KEY,
        },
      }
    );
    return getSpotlightData({ spotlightId: spotlightId });
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

const SpecialDays = ({
  fnSetActive = () => {},
  fnSetLoginState = () => {},
}) => {
  const [titleForm, setTitleFirstForm] = useState("Add Special Day");
  const inputTitle = useRef();
  const closePopUp = useRef();
  const btnOpenEdit = useRef();

  // const bannerSpotlight = useRef();
  // const inputSubTitle = useRef();
  const closePopUpSpt = useRef();
  const closePopUpEvt = useRef();
  const closePopUpSptHid = useRef();
  // const delPreview = useRef();
  const selectEvent = useRef();

  // ====================================================================

  const [isLoading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    state: false,
    content: "",
    type: "",
  });
  const [statePosOpenPopUp, setStatePosition] = useState("add");

  // const [imageDataForm, setImage] = useState(null);
  const [showData, setData] = useState(null);
  const [spotlightSelected, setSpotSelect] = useState(null);
  const [eventsData, setEventData] = useState(null);
  const [optEventList, setOptEventList] = useState([]);

  const resetAlert = () => {
    setTimeout(() => {
      setAlert({ state: false, content: "", type: "" });
    }, 3000);
  };

  const resetForm = () => {
    inputTitle.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(statePosOpenPopUp);
    if (!inputTitle.current.value || inputTitle.current.value === "") {
      setAlert({
        state: "true",
        content: "All fields are required to be filled in",
        type: "danger",
      });
      resetAlert();
    } else {
      closePopUpSptHid.current.click();
      setLoading(true);
      if (statePosOpenPopUp === "add") {
        addSpotlight({
          title: inputTitle.current.value,
        }).then((res) => {
          setLoading(false);

          if (res.status === 200) {
            closePopUpSpt.current.click();
            setData(res.data.special_days);
            resetForm();
            setAlert({
              state: true,
              content: "Special day event group has added",
              type: "success",
            });
          } else {
            btnOpenEdit.current.click();
            if (res.status == 401) {
              fnSetLoginState(0);
            }
            setAlert({
              state: true,
              content: Object.values(res.data.data).toString(),
              type: "danger",
            });
          }
          resetAlert();
        });
      } else {
        updateSpotlight({
          spotlightId: spotlightSelected,
          title: inputTitle.current.value,
        }).then((res) => {
          console.log(res);

          if (res.status === 200) {
            closePopUpSpt.current.click();
            let index = 0;
            showData.forEach((data) => {
              if (data.data.id === spotlightSelected) {
                showData[index] = res.data.special_day;
              }
              index++;
            });
            setAlert({
              state: true,
              content: "Special day event group event has updated",
              type: "success",
            });
            resetForm();
          } else {
            btnOpenEdit.current.click();
            if (res.status == 401) {
              fnSetLoginState(0);
            }
            setAlert({
              state: true,
              content: Object.values(res.data.data).toString(),
              type: "danger",
            });
          }
          setLoading(false);
          resetAlert();
        });
      }
    }
  };

  const handleDel = (id) => {
    setLoading(true);
    delSpotlight({ spotlightId: id }).then((res) => {
      setLoading(false);
      if (res.status === 200) {
        setData(res.data.special_days);
        setAlert({
          state: true,
          content: "Special day event has removed",
          type: "success",
        });
      } else {
        if (res.status == 401) {
          fnSetLoginState(0);
        }
        setAlert({
          state: true,
          content: Object.values(res.data.data).toString(),
          type: "danger",
        });
      }
      resetAlert();
    });
  };

  const handleSetView = (id) => {
    setLoading(true);
    setActive({ spotlightId: id }).then((res) => {
      if (res.status === 200) {
        setData(res.data.special_days);
        setAlert({
          state: true,
          content: "Special day event has updated",
          type: "success",
        });
      } else {
        if (res.status == 401) {
          fnSetLoginState(0);
        }
        setAlert({
          state: true,
          content: Object.values(res.data.data).toString(),
          type: "danger",
        });
      }
      setLoading(false);
      resetAlert();
    });
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    console.log(selectEvent.current);
    if (selectEvent.current.getValue().length === 0) {
      setAlert({
        state: true,
        content: "Please select one or more event",
        type: "danger",
      });
      resetAlert();
    } else {
      closePopUpEvt.current.click();
      setLoading(true);
      addEventSpotlight({
        spotlightId: spotlightSelected.toString(),
        eventId: [...selectEvent.current.getValue().map((val) => val.value)],
      }).then((res) => {
        if (res.status === 200) {
          let index = 0;
          showData.forEach((data) => {
            console.log(res);
            if (data.data.id === spotlightSelected) {
              // console.log(showData[index], res.data.spotlight);
              showData[index] = res.data.special_day;
            }
            index++;
          });
          setAlert({
            state: true,
            content: "Special day event has added",
            type: "success",
          });
        } else {
          if (res.status == 401) {
            fnSetLoginState(0);
          }
          setAlert({
            state: true,
            content: Object.values(res.data.data).toString(),
            type: "danger",
          });
        }
        setLoading(false);
        resetAlert();
      });
    }
  };

  const handleNavLeft = (id, evtSpotId) => {
    setLoading(true);
    toLeftInSpotlight({ spotlightEventId: evtSpotId }).then((res) => {
      if (res.status === 202) {
        let index = 0;
        showData.forEach((data) => {
          if (data.data.id === id) {
            showData[index].events = res.data.special_day_events;
          }
          index++;
        });
        setAlert({
          state: true,
          content: "Special day event has updated",
          type: "success",
        });
      } else {
        if (res.status == 401) {
          fnSetLoginState(0);
        }
        setAlert({
          state: true,
          content: Object.values(res.data.data).toString(),
          type: "danger",
        });
      }
      setLoading(false);
      resetAlert();
    });
  };

  const handleNavRight = (id, evtSpotId) => {
    setLoading(true);
    toRightInSpotlight({ spotlightEventId: evtSpotId }).then((res) => {
      if (res.status === 202) {
        let index = 0;
        showData.forEach((data) => {
          if (data.data.id === id) {
            showData[index].events = res.data.special_day_events;
          }
          index++;
        });
        setAlert({
          state: true,
          content: "Special day event has updated",
          type: "success",
        });
      } else {
        if (res.status == 401) {
          fnSetLoginState(0);
        }
        setAlert({
          state: true,
          content: Object.values(res.data.data).toString(),
          type: "danger",
        });
      }
      setLoading(false);
      resetAlert();
    });
  };

  const handleDelEvent = (id, evtSpotId) => {
    setLoading(true);
    delDataInSpotlight({ spotlightId: id, spotlightEventId: evtSpotId }).then(
      (res) => {
        // console.log(res);
        if (res.status === 200) {
          let index = 0;
          showData.forEach((data) => {
            console.log(res);
            if (data.data.id === id) {
              // console.log(showData[index], res.data.spotlight);
              showData[index] = res.data.special_day;
            }
            index++;
          });
          setAlert({
            state: true,
            content: "Event in special day group has deleted",
            type: "success",
          });
        } else {
          if (res.status == 401) {
            fnSetLoginState(0);
          }
          setAlert({
            state: true,
            content: Object.values(res.data.data).toString(),
            type: "danger",
          });
        }
        setLoading(false);
        resetAlert();
      }
    );
  };

  const handleOpenAdd = () => {
    setTitleFirstForm("Add Special Day");
    if (statePosOpenPopUp === "edit") {
      inputTitle.current.value = null;
    }
    setStatePosition("add");
  };

  const handleOpenEdit = (data) => {
    // =========== dummy data ================
    setTitleFirstForm("Edit Special Day");
    inputTitle.current.value = data.title;
    // =======================================
    btnOpenEdit.current.click();
    setStatePosition("edit");
  };

  useEffect(() => {
    fnSetActive("special-days");
    if (showData === null) {
      setLoading(true);
      loadData().then((res) => {
        setLoading(false);
        if (res.status === 200) {
          setData(res.data.special_days);
        } else {
          if (res.status == 401) {
            fnSetLoginState(2);
          }
          setData([]);
        }
      });
    }
    if (eventsData === null) {
      loadEvents().then((res) => {
        if (res.status === 200) {
          setEventData(res.data.events);
        } else {
          if (res.status == 401) {
            fnSetLoginState(2);
          }
          setEventData([]);
        }
      });
    }
  }, [showData, eventsData]);

  useEffect(() => {
    if (showData !== null && spotlightSelected) {
      let spotSelected = showData.filter(
        (spotData) => spotData.data.id === spotlightSelected
      );
      let options = [];
      eventsData.forEach((event) => {
        let isSame = false;
        spotSelected[0].events.forEach((eventSlc) => {
          if (eventSlc.id === event.id) {
            isSame = true;
          }
        });
        if (!isSame) {
          options.push({
            label: (
              <div className="d-flex gap-3">
                <img
                  width={"150px"}
                  src={process.env.REACT_APP_BACKEND_URL + event.logo}
                  alt=""
                  srcset=""
                />
                <div>{event.name}</div>
              </div>
            ),
            value: event.id,
          });
        }
      });
      setOptEventList(options);
    }
  }, [spotlightSelected, showData]);

  return (
    <>
      {/* ===== PopUp for first data spotlight event ====== */}
      <div
        className="modal fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabindex="-1"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className={`modal-dialog modal-dialog-centered`}>
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="row m-0">
                <div className="col-12 d-flex pt-4 ps-3 pe-3 pb-1">
                  <h5>{titleForm}</h5>
                  <button
                    type="button"
                    className="btn-close ms-auto"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    ref={closePopUpSpt}
                    onClick={() => {
                      setSpotSelect(null);
                      if (statePosOpenPopUp === "edit") {
                        resetForm();
                      }
                    }}
                  ></button>
                  <button
                    type="button"
                    className="btn-close ms-auto d-none"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    ref={closePopUpSptHid}
                  ></button>
                </div>
                <div className="col-12 mt-3 mb-3">
                  <input
                    type="text"
                    name=""
                    id=""
                    placeholder="Special Day Title"
                    className="form-control"
                    ref={inputTitle}
                  />
                </div>
                <div className="col-12 mb-3">
                  <button
                    className="btn btn-primary text-white rounded-3 ms-auto w-100"
                    type="submit"
                  >
                    <BiSave /> Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* ====== PopUp secondary for add event in spotlight ======== */}
      <div
        className="modal fade"
        id="addEventSpotlight"
        aria-hidden="true"
        aria-labelledby="addEventSpotlightLabel"
        tabindex="-1"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleAddEvent}>
              <div className="row m-0">
                <div className="col-12 d-flex pt-4 ps-3 pe-3 pb-1">
                  <h5>Add Event In Special Day</h5>
                  <button
                    type="button"
                    className="btn-close ms-auto"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    ref={closePopUpEvt}
                    onClick={() => {
                      selectEvent.current.setValue([]);
                      setSpotSelect(null);
                    }}
                  ></button>
                </div>
              </div>
              <div className="col-12 ps-3 pe-3 pb-1 pt-1">
                <Select
                  className="rounded-3 mt-4 mb-3"
                  placeholder="Select Events"
                  isMulti
                  options={optEventList.map((opt) => opt)}
                  ref={selectEvent}
                />
                <button
                  className="btn btn-primary d-flex gap-1 w-100 mt-4 mb-4"
                  type="submit"
                >
                  <BiSave className="my-auto ms-auto" />{" "}
                  <div className="my-auto me-auto">Save</div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* =========================================================== */}
      <div className={`row ps-4 pe-4 pt-2 pb-2 ${styles.MainContainer}`}>
        <div className="col-12 mb-3 d-flex">
          <h5>Special Day Events</h5>
          <button
            className="btn btn-primary rounded-pill ms-auto"
            data-bs-target="#exampleModalToggle"
            data-bs-toggle="modal"
            onClick={handleOpenAdd}
          >
            <BiPlusCircle /> Add Special Day
          </button>
          <button
            className="d-none"
            data-bs-target="#exampleModalToggle"
            data-bs-toggle="modal"
            ref={btnOpenEdit}
          ></button>
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
              {console.log(showData)}
              {showData ? (
                showData.length !== 0 ? (
                  showData.map((data) => {
                    return (
                      <div className="w-100 p-2 rounded-3 bg-white mb-3">
                        <div className="pb-2 pt-0 d-flex">
                          <div className="my-auto">
                            {data.data.view ? (
                              <span
                                class="btn btn-success d-flex"
                                style={{ width: "100px" }}
                              >
                                <BiCheckCircle className="my-auto ms-auto" />{" "}
                                <div className="my-auto ms-2 me-auto">
                                  Active
                                </div>
                              </span>
                            ) : (
                              <span
                                class="btn btn-secondary d-flex"
                                style={{ width: "100px" }}
                              >
                                <BiXCircle className="my-auto ms-auto" />{" "}
                                <div className="my-auto ms-2 me-auto">
                                  Active
                                </div>
                              </span>
                            )}
                          </div>
                          <button
                            className="btn btn-outline-primary ms-auto"
                            onClick={() => {
                              handleSetView(data.data.id);
                            }}
                          >
                            Set Active
                          </button>
                          <button
                            className="btn btn-warning ms-2"
                            onClick={() => {
                              handleOpenEdit(data.data);
                              setSpotSelect(data.data.id);
                            }}
                          >
                            <BiEdit />
                          </button>
                          <button
                            className="btn btn-danger ms-2"
                            onClick={() => {
                              handleDel(data.data.id);
                            }}
                          >
                            <BiTrash />
                          </button>
                        </div>
                        <h5 style={{ marginTop: 10 }}>{data.data.title}</h5>
                        <div style={{ display: "flex", scale: "1" }}>
                          <Slider
                            style={{
                              flexDirection: "row",
                              marginTop: 20,
                              gap: 20,
                              display: "flex",
                            }}
                            distanceCard={20}
                            content={[
                              <div
                                className={`p-3 ${styles2.AddBtn} ${styles3.AddBtn2}`}
                                data-bs-target="#addEventSpotlight"
                                data-bs-toggle="modal"
                                style={{
                                  flexBasis:
                                    data.events.length === 0
                                      ? "unnset"
                                      : "100%",
                                  width: "313px",
                                }}
                                // ref={btnAdd}
                                onClick={() => {
                                  setSpotSelect(data.data.id);
                                }}
                              >
                                <BiPlusCircle />
                                <div className={`${styles2.TextBtn}`}>
                                  Add Event
                                </div>
                              </div>,
                              ...data.events.map((event, e) => (
                                <Event
                                  data={event}
                                  key={e}
                                  style={{
                                    maxWidth: "unset",
                                    flexBasis: "100%",
                                  }}
                                  deleteIcon={{
                                    state: true,
                                    onClick: () => {
                                      handleDelEvent(
                                        data.data.id,
                                        event.id_data
                                      );
                                    },
                                  }}
                                />
                              )),
                            ]}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div
                    className="d-flex w-100 mt-4 h-100"
                    style={{ flexDirection: "column", opacity: "60%" }}
                  >
                    <img
                      src="/images/Sparkler.png"
                      className="mt-auto mx-auto"
                      alt=""
                      srcset=""
                      width={"150px"}
                    />
                    <p className="fw-bold fs-5 text-center mb-auto mt-3">
                      No Special Day Event Data
                    </p>
                  </div>
                )
              ) : (
                <></>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SpecialDays;
