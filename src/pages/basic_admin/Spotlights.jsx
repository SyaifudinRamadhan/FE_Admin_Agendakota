import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/Topics.module.css";
import stylesHome from "./styles/Home.module.css";
import Navbar from "../../partials/Navbar";
import Slider from "../../components/Slider";
import Event from "../../components/Event";
import styles2 from "./styles/Categories.module.css";
import styles3 from "./styles/Cities.module.css";
import styles4 from "./styles/Spotlights.module.css";
import {
  BiCheckCircle,
  BiEdit,
  BiFileBlank,
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

// Load all spotlight + events data
const loadData = async () => {
  // output key  = spotlights
  try {
    let data = await axios.get(
      process.env.REACT_APP_BACKEND_URL + "/api/admin/spotlights",
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

const addSpotlight = async ({ title, subTitle, banner }) => {
  // output key  = spotlights
  console.log({ title: title, sub_title: subTitle, banner: banner.files[0] });
  try {
    await axios.post(
      process.env.REACT_APP_BACKEND_URL + "/api/admin/spotlight/create",
      {
        title: title,
        sub_title: subTitle,
        banner: banner.files[0],
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

const updateSpotlight = async ({ spotlightId, title, subTitle, banner }) => {
  // output key  = spotlight
  try {
    await axios.post(
      process.env.REACT_APP_BACKEND_URL + "/api/admin/spotlight/update",
      {
        spotlight_id: spotlightId,
        title: title,
        sub_title: subTitle,
        banner: banner.value === "" || !banner.value ? null : banner.files[0],
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
  // output key  = spotlights
  try {
    await axios.post(
      process.env.REACT_APP_BACKEND_URL + "/api/admin/spotlight/delete",
      {
        spotlight_id: spotlightId,
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
      process.env.REACT_APP_BACKEND_URL + "/api/admin/spotlight/set-view",
      {
        spotlight_id: spotlightId,
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
  // output key  = spotlight (main)
  try {
    let data = await axios.get(
      process.env.REACT_APP_BACKEND_URL +
        "/api/spotlight?spotlight_id=" +
        spotlightId,
      {
        data: {
          spotlight_id: spotlightId,
        },
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
  // output key  = spotlight
  try {
    await axios.post(
      process.env.REACT_APP_BACKEND_URL + "/api/admin/spotlight/event/add",
      {
        spotlight_id: spotlightId,
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
  // output key = event_spotlights
  try {
    let data = await axios.post(
      process.env.REACT_APP_BACKEND_URL +
        "/api/admin/spotlight/event/set-prio-plus",
      {
        spotlight_event_id: spotlightEventId,
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
  // output key = event_spotlights
  try {
    let data = await axios.post(
      process.env.REACT_APP_BACKEND_URL +
        "/api/admin/spotlight/event/set-prio-min",
      {
        spotlight_event_id: spotlightEventId,
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

const delDataInSpotlight = async ({ spotlightEventId }) => {
  // output key = event_spotlights
  try {
    let data = await axios.post(
      process.env.REACT_APP_BACKEND_URL + "/api/admin/spotlight/event/delete",
      {
        spotlight_event_id: spotlightEventId,
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

const Spotlights = ({ fnSetActive = () => {}, fnSetLoginState = () => {} }) => {
  const [titleForm, setTitleFirstForm] = useState("Add Spotlight");
  const bannerSpotlight = useRef();
  const inputTitle = useRef();
  const inputSubTitle = useRef();
  const closePopUpSpt = useRef();
  const closePopUpEvt = useRef();
  const btnOpenEdit = useRef();
  const delPreview = useRef();
  const selectEvent = useRef();
  const closePopUpSptHid = useRef();

  const [imageDataForm, setImage] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    state: false,
    content: "",
    type: "",
  });
  const [statePosOpenPopUp, setStatePosition] = useState("add");
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
    inputSubTitle.current.value = "";
    bannerSpotlight.current.value = "";
    setImage(null);
    delPreview.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(statePosOpenPopUp);
    if (
      ((!bannerSpotlight.current.value ||
        bannerSpotlight.current.value === "") &&
        statePosOpenPopUp === "add") ||
      !inputTitle.current.value ||
      inputTitle.current.value === "" ||
      !inputSubTitle.current.value ||
      inputSubTitle.current.value === ""
    ) {
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
          subTitle: inputSubTitle.current.value,
          banner: bannerSpotlight.current,
        }).then((res) => {
          setLoading(false);
          if (res.status === 200) {
            closePopUpSpt.current.click();
            setData(res.data.spotlights);
            resetForm();
            setAlert({
              state: true,
              content: "Spotlight event has added",
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
          subTitle: inputSubTitle.current.value,
          banner: bannerSpotlight.current,
        }).then((res) => {
          if (res.status === 200) {
            closePopUpSpt.current.click();
            let index = 0;
            showData.forEach((data) => {
              if (data.data.id === spotlightSelected) {
                showData[index] = res.data.spotlight;
              }
              index++;
            });
            setAlert({
              state: true,
              content: "Spotlight event has updated",
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
        setData(res.data.spotlights);
        setAlert({
          state: true,
          content: "Spotlight event has removed",
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
        setData(res.data.spotlights);
        setAlert({
          state: true,
          content: "Spotlight event has updated",
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
              showData[index] = res.data.spotlight;
            }
            index++;
          });
          setAlert({
            state: true,
            content: "Spotlight event has added in group",
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
            showData[index].events = res.data.event_spotlights;
          }
          index++;
        });
        setAlert({
          state: true,
          content: "Spotlight event has updated",
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
            showData[index].events = res.data.event_spotlights;
          }
          index++;
        });
        setAlert({
          state: true,
          content: "Spotlight event has updated",
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
    delDataInSpotlight({ spotlightEventId: evtSpotId }).then((res) => {
      // console.log(res);
      if (res.status === 202) {
        let index = 0;
        showData.forEach((data) => {
          if (data.data.id === id) {
            showData[index].events = res.data.event_spotlights.map((evt) => {
              evt.event.id_data = evt.id;
              return evt.event;
            });
          }
          index++;
        });
        setAlert({
          state: true,
          content: "Event in spotlight group has removed",
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

  const handleOpenAdd = () => {
    setTitleFirstForm("Add Spotlight");
    setImage(null);
    if (statePosOpenPopUp === "edit") {
      bannerSpotlight.current.value = null;
      inputTitle.current.value = null;
      inputSubTitle.current.value = null;
    }
    setStatePosition("add");
  };

  const handleOpenEdit = (data) => {
    // =========== dummy data ================
    setTitleFirstForm("Edit Spotlight");
    setImage(process.env.REACT_APP_BACKEND_URL + data.banner);
    inputTitle.current.value = data.title;
    inputSubTitle.current.value = data.sub_title;
    // =======================================
    btnOpenEdit.current.click();
    setStatePosition("edit");
  };

  useEffect(() => {
    fnSetActive("spotlights");
    if (showData === null) {
      setLoading(true);
      loadData().then((res) => {
        setLoading(false);
        if (res.status === 200) {
          setData(res.data.spotlights);
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
        <div
          className={`modal-dialog modal-dialog-centered ${styles4.PopUpAdd}`}
        >
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
                {alert.state ? (
                  <div className="ps-3 pe-3">
                    <div className={`alert alert-${alert.type}`} role="alert">
                      {alert.content}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                <div className="col-12 mt-3">
                  <InputImage
                    style={{
                      width: "100%",
                      height: "unset",
                      aspectRatio: "13 / 5",
                    }}
                    refData={bannerSpotlight}
                    defaultFile={imageDataForm}
                    refDelBtn={delPreview}
                    required={false}
                  />
                </div>
                <div className="col-12 mt-3">
                  <input
                    type="text"
                    name=""
                    id=""
                    placeholder="Spotlight Title"
                    className="form-control"
                    ref={inputTitle}
                  />
                </div>
                <div className="col-12 mt-3 mb-3">
                  <textarea
                    name=""
                    className="form-control"
                    placeholder="Spotlight descriptiion / sub title"
                    id=""
                    cols="30"
                    rows="4"
                    ref={inputSubTitle}
                  ></textarea>
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
                  <h5>Add Event Spotlighted</h5>
                  <button
                    type="button"
                    className="btn-close ms-auto"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    ref={closePopUpEvt}
                    onClick={() => {
                      setSpotSelect(null);
                      selectEvent.current.setValue([]);
                    }}
                  ></button>
                </div>
              </div>
              {alert.state ? (
                <div className="ps-3 pe-3">
                  <div className={`alert alert-${alert.type}`} role="alert">
                    {alert.content}
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className="col-12 ps-3 pe-3 pb-1 pt-1">
                {eventsData !== null ? (
                  <Select
                    className="rounded-3 mt-4 mb-3"
                    placeholder="Select Events"
                    isMulti
                    ref={selectEvent}
                    options={optEventList.map((opt) => opt)}
                  />
                ) : (
                  <></>
                )}
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
          <h5>Event Spotlights</h5>
          <button
            className="btn btn-primary rounded-pill ms-auto"
            data-bs-target="#exampleModalToggle"
            data-bs-toggle="modal"
            onClick={handleOpenAdd}
          >
            <BiPlusCircle /> Add Spotlight
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
              {showData !== null ? (
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
                        <div className={stylesHome.CustomSpotlight}>
                          <div>
                            <div
                              className={stylesHome.CustomSpotBox}
                              style={{
                                backgroundImage: `url("${process.env.REACT_APP_BACKEND_URL}${data.data.banner}")`,
                              }}
                            >
                              <div className={stylesHome.CustomSpotText}>
                                <div className={stylesHome.CustomSpotTitle}>
                                  {data.data.title}
                                </div>
                                <div className={stylesHome.CustomSpotSubtitle}>
                                  {data.data.sub_title}
                                </div>
                              </div>
                              <div className={stylesHome.CustomSpotEvents}>
                                <Slider
                                  style={{
                                    flexDirection: "row",
                                    marginTop: 20,
                                    gap: 20,
                                    display: "flex",
                                    padding: "0px",
                                  }}
                                  distanceCard={20}
                                  navigatorClasses={[
                                    stylesHome.CustomNavSlideSpot,
                                  ]}
                                  content={[
                                    <div
                                      className={`p-3 ${styles2.AddBtn} ${styles3.AddBtn2}`}
                                      data-bs-target="#addEventSpotlight"
                                      data-bs-toggle="modal"
                                      style={{
                                        width: "313px",
                                        flexBasis:
                                          data.events.length === 0
                                            ? "unnset"
                                            : "100%",
                                      }}
                                      onClick={() => {
                                        setSpotSelect(data.data.id);
                                      }}
                                      // ref={btnAdd}
                                    >
                                      <BiPlusCircle />
                                      <div className={`${styles2.TextBtn}`}>
                                        Add Event
                                      </div>
                                    </div>,
                                    ...data.events.map((event, e) => {
                                      return (
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
                                      );
                                    }),
                                  ]}
                                />
                              </div>
                            </div>
                          </div>
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
                      No Spotlight Data
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

export default Spotlights;
