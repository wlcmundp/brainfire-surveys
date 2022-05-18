import React, { useState, useEffect } from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Link } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { useSelector } from "react-redux";
import CONFIG from "../config";
import date from "date-and-time";
import Logout from "../actions/logout";
import Goback from "../components/Goback";
function SurveysList() {
  const [show, setShow] = useState(false);
  const [logout, setLogout] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const admin = useSelector((state) => state.login);

  const [surveyList, setSurveyList] = useState([]);

  useEffect(() => {
    var config = {
      method: "get",
      url: `${CONFIG.API_URL}/surveys?_sort=created_at:DESC`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function (response) {
        setSurveyList(response.data);
      })
      .catch(function (error) {
        // if (error.response.data.statusCode === 401) {
        //   setLogout(true);
        // }
      });

    return () => {};
  }, []);

  const deleteSurvey = () => {
    var config = {
      method: "delete",
      url: `${CONFIG.API_URL}/surveys/${selectedId}`,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        let data = surveyList.filter((ele, index) => ele.id !== selectedId);
        setSurveyList(data);
        handleClose();
      })
      .catch(function (error) {
        // if (error.response.data.statusCode === 401) {
        //   setLogout(true);
        // }
      });
  };

  return (
    <div>
      {logout ? <Logout /> : null}

      <main className="main-section">
        <div className="container-fluid">
          {/* Title, Breadcrumbs and Add Button Start */}
          <div className="row mb-3 mb-md-4">
            <div className="col-md-8">
              <Goback />
              <h1 className="h3 mb-2 mb-md-1">Befragungen</h1>
              <Breadcrumb className="cb-breadcrumb">
                <Breadcrumb.Item href="/admin">Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Befragungen</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className="col-md-4 d-md-flex align-items-center justify-content-end">
              <Link
                to="/admin/add-new-survey"
                className="btn btn-primary btn-icon-text btn-raised btn-hover-effect"
              >
                <span className="material-icons me-2">add</span>
                <span className="link-text">Add New Survey</span>
              </Link>
            </div>
          </div>
          {/* Title, Breadcrumbs and Add Button End */}

          {/* Survey List Table Start */}
          <div className="card cb-card overflow-hidden">
            <Table className="cb-table mb-0">
              <thead>
                <tr>
                  <th>
                    <div className="d-flex align-items-center">
                      Title{" "}
                      <span className="material-icons ms-1">unfold_more</span>
                    </div>
                  </th>
                  <th>
                    <div className="d-flex align-items-center">
                      Start Date{" "}
                      <span className="material-icons ms-1">unfold_more</span>
                    </div>
                  </th>
                  <th>
                    <div className="d-flex align-items-center">
                      End Date{" "}
                      <span className="material-icons ms-1">unfold_more</span>
                    </div>
                  </th>
                  <th>
                    <div className="d-flex align-items-center">
                      Status{" "}
                      <span className="material-icons ms-1">unfold_more</span>
                    </div>
                  </th>
                  <th>
                    <div className="d-flex align-items-center">Actions </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {surveyList.map((ele, index) => {
                  return (
                    <tr>
                      <td data-title="Title" className="table-col-title">
                        <div className="d-flex align-items-start cb-list-item">
                          <div className="cb-icon-avatar cb-icon-secondary me-2 me-md-3">
                            {ele.lable[0] + ele.lable[1]}
                          </div>
                          <div>
                            <Link
                              to="/admin/edit-survey"
                              state={{ survey_id: ele.id }}
                            >
                              <h6 className="mb-1">{ele.lable}</h6>
                            </Link>
                            <p className="card-subtitle">{ele.round} rounds</p>
                          </div>
                        </div>
                      </td>
                      <td data-title="Start Date" className="table-col-xs-50">
                        <p className="mb-0">
                          {date.format(
                            new Date(ele.start_date),
                            "DD MMM, YYYY"
                          )}
                        </p>
                      </td>
                      <td data-title="End Date" className="table-col-xs-50">
                        <p className="mb-0">
                          {date.format(new Date(ele.end_date), "DD MMM, YYYY")}
                        </p>
                      </td>
                      <td data-title="Status" className="table-col-xs-50">
                        {ele.status === "publish" ? (
                          <Badge
                            bg="success"
                            className="cb-badge badge-open-round"
                          >
                            Published
                          </Badge>
                        ) : (
                          <Badge
                            bg="primary"
                            className="cb-badge badge-open-round"
                          >
                            Draft
                          </Badge>
                        )}
                      </td>
                      <td data-title="Actions" className="table-col-actions">
                        <Link
                          to="/admin/edit-survey"
                          state={{ survey_id: ele.id }}
                        >
                          <button
                            className="btn-fab btn-secondary btn-hover-effect me-3"
                            title="Edit"
                            onClick={() => {
                              setSelectedId(ele.id);
                            }}
                          >
                            <span className="material-icons">edit</span>
                          </button>
                        </Link>
                        <button
                          className="btn-fab btn-danger btn-hover-effect"
                          onClick={() => {
                            handleShow();
                            setSelectedId(ele.id);
                          }}
                          title="Delete"
                        >
                          <span className="material-icons">delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {/* <tr>
                  <td data-title="Title" className="table-col-title">
                    <div className="d-flex align-items-start cb-list-item">
                      <div className="cb-icon-avatar cb-icon-secondary me-2 me-md-3">
                        SB
                      </div>
                      <div>
                        <Link to="/admin">
                          <h6 className="mb-1">Survey Barometer Title</h6>
                        </Link>
                        <p className="card-subtitle">2 rounds</p>
                      </div>
                    </div>
                  </td>
                  <td data-title="Start Date" className="table-col-xs-50">
                    <p className="mb-0">Dec 06, 2021</p>
                  </td>
                  <td data-title="End Date" className="table-col-xs-50">
                    <p className="mb-0">-</p>
                  </td>
                  <td data-title="Status" className="table-col-xs-50">
                    <Badge bg="gray" className="cb-badge badge-open-round">
                      Draft
                    </Badge>
                  </td>
                  <td data-title="Actions" className="table-col-actions">
                    <button
                      className="btn-fab btn-secondary btn-hover-effect me-3"
                      title="Edit"
                    >
                      <span className="material-icons">edit</span>
                    </button>
                    <button
                      className="btn-fab btn-danger btn-hover-effect"
                      onClick={handleShow}
                      title="Delete"
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td data-title="Title" className="table-col-title">
                    <div className="d-flex align-items-start cb-list-item">
                      <div className="cb-icon-avatar cb-icon-secondary me-2 me-md-3">
                        SB
                      </div>
                      <div>
                        <Link to="/admin">
                          <h6 className="mb-1">Survey Barometer Title</h6>
                        </Link>
                        <p className="card-subtitle">2 rounds</p>
                      </div>
                    </div>
                  </td>
                  <td data-title="Start Date" className="table-col-xs-50">
                    <p className="mb-0">Nov 15, 2021</p>
                  </td>
                  <td data-title="End Date" className="table-col-xs-50">
                    <p className="mb-0">Nov 30, 2021</p>
                  </td>
                  <td data-title="Status" className="table-col-xs-50">
                    <Badge bg="success" className="cb-badge badge-open-round">
                      Completed
                    </Badge>
                  </td>
                  <td data-title="Actions" className="table-col-actions">
                    <button
                      className="btn-fab btn-secondary btn-hover-effect me-3"
                      title="Edit"
                    >
                      <span className="material-icons">edit</span>
                    </button>
                    <button
                      className="btn-fab btn-danger btn-hover-effect"
                      onClick={handleShow}
                      title="Delete"
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td data-title="Title" className="table-col-title">
                    <div className="d-flex align-items-start cb-list-item">
                      <div className="cb-icon-avatar cb-icon-secondary me-2 me-md-3">
                        SB
                      </div>
                      <div>
                        <Link to="/admin">
                          <h6 className="mb-1">Survey Barometer Title</h6>
                        </Link>
                        <p className="card-subtitle">2 rounds</p>
                      </div>
                    </div>
                  </td>
                  <td data-title="Start Date" className="table-col-xs-50">
                    <p className="mb-0">Nov 15, 2021</p>
                  </td>
                  <td data-title="End Date" className="table-col-xs-50">
                    <p className="mb-0">Nov 30, 2021</p>
                  </td>
                  <td data-title="Status" className="table-col-xs-50">
                    <Badge bg="success" className="cb-badge badge-open-round">
                      Completed
                    </Badge>
                  </td>
                  <td data-title="Actions" className="table-col-actions">
                    <button
                      className="btn-fab btn-secondary btn-hover-effect me-3"
                      title="Edit"
                    >
                      <span className="material-icons">edit</span>
                    </button>
                    <button
                      className="btn-fab btn-danger btn-hover-effect"
                      onClick={handleShow}
                      title="Delete"
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td data-title="Title" className="table-col-title">
                    <div className="d-flex align-items-start cb-list-item">
                      <div className="cb-icon-avatar cb-icon-secondary me-2 me-md-3">
                        SB
                      </div>
                      <div>
                        <Link to="/admin">
                          <h6 className="mb-1">Survey Barometer Title</h6>
                        </Link>
                        <p className="card-subtitle">2 rounds</p>
                      </div>
                    </div>
                  </td>
                  <td data-title="Start Date" className="table-col-xs-50">
                    <p className="mb-0">Nov 15, 2021</p>
                  </td>
                  <td data-title="End Date" className="table-col-xs-50">
                    <p className="mb-0">Nov 30, 2021</p>
                  </td>
                  <td data-title="Status" className="table-col-xs-50">
                    <Badge bg="success" className="cb-badge badge-open-round">
                      Completed
                    </Badge>
                  </td>
                  <td data-title="Actions" className="table-col-actions">
                    <button
                      className="btn-fab btn-secondary btn-hover-effect me-3"
                      title="Edit"
                    >
                      <span className="material-icons">edit</span>
                    </button>
                    <button
                      className="btn-fab btn-danger btn-hover-effect"
                      onClick={handleShow}
                      title="Delete"
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </td>
                </tr> */}
              </tbody>
            </Table>
          </div>
          {/* Survey List Table End */}
        </div>

        {/* Delete Survey Popup Start */}
        <Modal
          show={show}
          onHide={handleClose}
          className="cb-modal thank-you-modal delete-modal"
          centered
        >
          <Modal.Header className="justify-content-center" closeButton>
            <div className="cb-icon-avatar cb-icon-danger cb-icon-72">
              <span className="material-icons">delete</span>
            </div>
          </Modal.Header>
          <Modal.Body className="text-center">
            <h4>Delete Survey</h4>
            <p className="mb-0">
              Are you sure you want to delete this survey? This process can't be
              undone.
            </p>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <button
              className="btn btn-gray btn-raised btn-hover-effect me-3"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger btn-raised btn-hover-effect"
              onClick={() => {
                deleteSurvey();
              }}
            >
              Delete Survey
            </button>
          </Modal.Footer>
        </Modal>
        {/* Delete Survey Popup End */}
      </main>
    </div>
  );
}

export default SurveysList;
