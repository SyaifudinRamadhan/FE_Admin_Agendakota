import React, { useRef, useState, useEffect } from "react";
import styles from "./styles/Topics.module.css";
import Navbar from "../../partials/Navbar";
import { BiPlusCircle, BiSave, BiTrash, BiX } from "react-icons/bi";
import Loading from "../../components/Loading";
import axios from "axios";

const dummyLoad = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 3000);
  });
};

const loadData = async () => {
  try {
    let data = await axios.get(
      process.env.REACT_APP_BACKEND_URL + "/api/org-types",
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

const addData = async ({ names }) => {
  console.log(names);
  try {
    await axios.post(
      process.env.REACT_APP_BACKEND_URL + "/api/admin/org-type/create",
      {
        name: names,
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

const delData = async ({ id }) => {
  try {
    await axios.post(
      process.env.REACT_APP_BACKEND_URL + "/api/admin/org-type/delete",
      {
        org_type_id: id,
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
        data:
          error.response.status === 404 ? ["Data not found"] : error.response,
        status: error.response.status,
      };
    }
  }
};

const formContent = (contentForm, inputEls, hanldeRemoveForm) => {
  let target = null;
  let inputTarget = null;
  return (
    <tr
      ref={(e) => {
        contentForm.current.push(e);
        target = e;
      }}
    >
      <td>
        <input
          type="text"
          name=""
          id=""
          className="form-control"
          placeholder="Input type name ..."
          ref={(e) => {
            inputEls.current.push(e);
            inputTarget = e;
          }}
        />
      </td>
      <td className="d-flex">
        <button
          type="button"
          className="btn btn-outline-danger rounded-3 m-auto"
          onClick={() => {
            hanldeRemoveForm(target, inputTarget);
          }}
        >
          <BiTrash />
        </button>
      </td>
    </tr>
  );
};

const OrgType = ({ fnSetActive = () => {}, fnSetLoginState = () => {} }) => {
  const frameForm = useRef();
  const contentForm = useRef(new Array());
  const inputEls = useRef(new Array());
  const closePopUp = useRef();
  const tableContent = useRef();

  const hanldeRemoveForm = (target, inputFormTarget) => {
    console.log(target, contentForm.current, inputEls.current);
    inputFormTarget.value = "";
    target.style.display = "none";
  };

  const [formAdd, setFormAdd] = useState([
    formContent(contentForm, inputEls, hanldeRemoveForm),
  ]);
  const [isLoading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    state: false,
    content: "",
    type: "",
  });
  const [showData, setData] = useState(null);

  const resetAlert = () => {
    setTimeout(() => {
      setAlert({ state: false, content: "", type: "" });
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    closePopUp.current.click();
    setLoading(true);
    let orgTypes = [];
    inputEls.current.forEach((el) => {
      if (el !== null && el.value !== null && el.value !== "") {
        orgTypes.push(el.value);
      }
    });
    console.log(orgTypes);
    addData({ names: orgTypes }).then((res) => {
      setLoading(false);
      console.log(res);
      if (res.status === 200) {
        setData(res.data.org_types);
        setAlert({
          state: true,
          content: "Event topic has added",
          type: "success",
        });
        while (inputEls.current.length > 0) {
          inputEls.current.pop();
        }
        setFormAdd(<></>);
        setTimeout(() => {
          setFormAdd([formContent(contentForm, inputEls, hanldeRemoveForm)]);
        }, 50);
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

  const handleDel = (id) => {
    setLoading(true);
    delData({ id: id }).then((res) => {
      setLoading(false);
      if (res.status === 200) {
        setData(res.data.org_types);
        setAlert({
          state: true,
          content: "Event topic has deleted",
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

  const handleAddForm = () => {
    setFormAdd([
      ...formAdd,
      formContent(contentForm, inputEls, hanldeRemoveForm),
    ]);
  };

  const handleHeightContent = () => {
    try {
      let height = window.innerHeight - 365;
      tableContent.current.style.maxHeight = height + "px";
      tableContent.current.style.overflow = "auto";
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleHeightContent();
    window.addEventListener("resize", handleHeightContent);
    fnSetActive("org-types");
  });

  useEffect(() => {
    if (showData === null) {
      setLoading(true);
      loadData().then((res) => {
        if (res.status === 200) {
          setData(res.data.org_types);
        } else {
          if (res.status == 401) {
            fnSetLoginState(0);
          }
          setData([]);
        }
        setLoading(false);
      });
    }
  }, [showData]);

  return (
    <>
      <div
        className="modal fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabindex="-1"
      >
        <button
          type="button"
          className="btn-close d-none"
          data-bs-dismiss="modal"
          aria-label="Close"
          ref={closePopUp}
        ></button>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="row m-0">
                <div className="col-12 d-flex pt-4 ps-3 pe-3 pb-1">
                  <h5>Add Organization Type</h5>
                  <button
                    className="btn btn-outline-danger rounded-pill ms-auto"
                    type="submit"
                  >
                    <BiSave /> Save
                  </button>
                </div>
                <div className="col-12 p-3 pb-1 bg-white rounded-3 mt-2">
                  <table className="table table-striped rounded-3">
                    <tbody id="table-body" ref={frameForm}>
                      {formAdd}
                    </tbody>
                  </table>
                </div>
                <div className="col-12 p-3 pt-1 bg-white rounded-3">
                  <button
                    className="btn btn-primary w-100 rounded-pill text-white"
                    onClick={handleAddForm}
                    type="button"
                  >
                    <BiPlusCircle /> Add Type
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className={`row ps-4 pe-4 pt-2 pb-2 ${styles.MainContainer}`}>
        <div className="col-12 mb-3 d-flex">
          <h5>Organization Types</h5>
          <button
            className="btn btn-primary rounded-pill ms-auto"
            data-bs-target="#exampleModalToggle"
            data-bs-toggle="modal"
          >
            <BiPlusCircle /> Add Type
          </button>
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

            <div className="col-12 p-3 bg-white rounded-3">
              <table className="table table-striped rounded-3">
                <thead>
                  <tr>
                    <th scope="col" style={{ width: "80%" }}>
                      Type Name
                    </th>
                    <th scope="col" className="text-center">
                      Action
                    </th>
                  </tr>
                </thead>
              </table>
              <div ref={tableContent}>
                <table className="table table-striped rounded-3">
                  <tbody>
                    {showData !== null &&
                      showData.map((data) => {
                        return (
                          <tr>
                            <td>{data.name}</td>
                            <td className="d-flex">
                              <button
                                className="btn btn-danger m-auto"
                                onClick={() => {
                                  handleDel(data.id);
                                }}
                              >
                                <BiTrash />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-12 p-3 bg-white rounded-3 mt-2">
              <button
                className="btn btn-primary w-100 rounded-pill text-white"
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
              >
                <BiPlusCircle /> Add Type
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default OrgType;
