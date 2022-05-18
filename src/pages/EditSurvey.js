import React, { useState, useEffect } from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Link } from "react-router-dom";
import axios from "axios";
import DateTimePicker from "react-datetime-picker";
import { useNavigate, useLocation } from "react-router-dom";
import { useAlert } from "react-alert";
import CONFIG from "./../config";
import { useSelector } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import Goback from "../components/Goback";

function EditSurvey() {
  const location = useLocation();
  const navigate = useNavigate();
  const [label, setLabel] = useState("");
  const [duration, setDuration] = useState(new Date());
  const [question_list, setQuestion_list] = useState([]);
  const [templateList, setTemplateList] = useState([]);
  const alert = useAlert();
  const admin = useSelector((state) => state.login);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [selectedTemplateLabel, setSelectedTemplateLabel] = useState("");
  const [status, setStatus] = useState("");
  const [round, setRound] = useState("");
  useEffect(() => {
    console.log("test", location.state.survey_id);
    get_surveybyId();
    fetchTemplate();
    fetchCatogery();

    return () => {};
  }, []);
  const fetchCatogery = () => {
    var config = {
      method: "get",
      url: `${CONFIG.API_URL}/categories`,

      headers: {},
    };

    axios(config)
      .then(function (response) {
        setCategoryList(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const get_surveybyId = () => {
    var config = {
      method: "get",
      url: `${CONFIG.API_URL}/surveys/${location.state.survey_id}`,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        setQuestion_list(response.data.question);
        setLabel(response.data.lable);
        setDuration(new Date(response.data.end_date));
        setRound(response.data.round);
        setStatus(response.data.status);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const fetchTemplate = () => {
    var config = {
      method: "get",
      url: `${CONFIG.API_URL}/templates`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function (response) {
        setTemplateList(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const updateTemplate = () => {
    var data = JSON.stringify({
      label: selectedTemplateLabel,
      template: question_list,
    });

    var config = {
      method: "put",
      url: `${CONFIG.API_URL}/templates/${selectedTemplateId}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        alert.success("Vorlage erfolgreich aktualisiert");
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const deleteTemplate = async () => {
    var config = {
      method: "delete",
      url: `${CONFIG.API_URL}/templates/${selectedTemplateId}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setTemplateList(
          templateList.filter((ele, index) => {
            if (ele.id !== response.data.id) {
              return true;
            }
            return false;
          })
        );
        // if (templateList.length > 0) {
        setSelectedTemplateId(null);
        // }
        alert.success("Template deleted successfully");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const saveTemplate = () => {
    var data = JSON.stringify({
      label: label + "-" + new Date().getTime(),
      template: question_list,
    });

    var config = {
      method: "post",
      url: `${CONFIG.API_URL}/templates`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        alert.success("Vorlage erfolgreich aktualisiert");
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const update_survey = (statusT) => {
    var data = JSON.stringify({
      lable: label,
      start_date: statusT === "publish" ? new Date() : null,
      end_date: duration.toISOString(),
      question: question_list,
      status: statusT,
      round: round,
    });

    var config = {
      method: "put",
      url: `${CONFIG.API_URL}/surveys/${location.state.survey_id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        alert.success("Die Umfrage ist aktualisiert");

        if (statusT === "publish") {
          var data = JSON.stringify({
            survey_id: location.state.survey_id,
          });

          var config = {
            method: "post",
            url: `${CONFIG.SERVER_URL}/create_unique_link`,
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjM5NTk4NzM4LCJleHAiOjE2NDIxOTA3Mzh9.shfLyOECpz5MbRQl71jH4hQB3pjl5c5KPw3u7GBd00A",
              "Content-Type": "application/json",
            },
            data: data,
          };

          axios(config)
            .then(function (response) {
              alert.success("Die Umfrage ist veröffentlicht");
              setStatus("publish");
            })
            .catch(function (error) {
              console.log(error);
            });
        }

        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <div>
      <main className="main-section">
        <div className="container-fluid">
          {/* Title and Breadcrumbs Start */}
          <div className="row">
            <div className="col-8">
              <div className="mb-3 mb-md-4">
                <Goback />
                <h1 className="h3 mb-2 mb-md-1">Neue Umfrage hinzufügen</h1>
                <Breadcrumb className="cb-breadcrumb">
                  <Breadcrumb.Item href="/admin">Dashboard</Breadcrumb.Item>
                  <Breadcrumb.Item href="/admin/surveys">
                    Surveys
                  </Breadcrumb.Item>
                  <Breadcrumb.Item active>
                    Neue Umfrage hinzufügen
                  </Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>
            <div className="col-4">
              {status === "draft" ? (
                <button
                  style={{ marginLeft: "auto", display: "flex" }}
                  className="btn btn-primary btn-raised btn-hover-effect btn-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    update_survey("publish");
                  }}
                >
                  Publish
                </button>
              ) : null}
            </div>
          </div>

          {/* Title and Breadcrumbs End */}

          <form>
            {/* General Setup Start */}
            <div className="card cb-card mb-3 mb-md-4">
              <div className="card-header card-header-border card-title-separator">
                <h2 className="h5 card-title">Allgemeine Einstellungen</h2>
                <p className="card-subtitle">
                  Geben Sie unten die Details ein, um die Umfrage zu
                  konfigurieren
                </p>
              </div>
              <div className="card-body">
                <div className="form-group cb-form-group mb-3 mb-md-4">
                  <label className="form-label">Titel</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter survey title"
                    value={label}
                    onChange={(e) => {
                      setLabel(e.target.value);
                    }}
                  />
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group cb-form-group mb-3 mb-md-4">
                      <label className="form-label">Runde</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter number of round"
                        value={round}
                        onChange={(e) => {
                          setRound(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group cb-form-group mb-3 mb-md-4">
                      <label className="form-label">Enddatum</label>
                      {/* <input
                          type="datetime-local"
                          className="form-control"
                          placeholder="Select duration"
                        /> */}
                      <DateTimePicker
                        onChange={setDuration}
                        value={duration}
                        className="custom-date-picker"
                      />
                      {/* <button
                          className="btn-fab btn-fab-dark-flat input-append-icon"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <span className="material-icons">event</span>
                        </button> */}
                    </div>
                  </div>
                </div>
                <div className="form-group cb-form-group mb-3 mb-md-4">
                  <label className="form-label">Vorlage</label>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-check custom-radio-selection p-0 mb-3">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="surveytemplate"
                          id="blankTemplate"
                        />
                        <label className="form-check-label" for="blankTemplate">
                          Blank Template
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-check custom-radio-selection p-0 mb-3">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="surveytemplate"
                          id="duplicateTemplate"
                          checked
                        />
                        <label
                          className="form-check-label"
                          for="duplicateTemplate"
                        >
                          Vorlage duplizieren
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <select
                        className="form-select"
                        placeholder="Select template"
                        onChange={(e) => {
                          if (e.target.value !== "defautl") {
                            setSelectedTemplateId(
                              templateList[e.target.value].id
                            );
                            setQuestion_list(
                              templateList[e.target.value].template
                            );
                            setSelectedTemplateLabel(
                              templateList[e.target.value].label
                            );
                          } else {
                            setSelectedTemplateId("");
                            setQuestion_list([]);
                          }
                        }}
                      >
                        <option value="defautl" selected>
                          Vorlage auswählen
                        </option>
                        {templateList.map((ele, index) => {
                          return <option value={index}>{ele.label}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* General Setup End */}
            {label ? (
              <>
                {" "}
                <div className="card cb-card mb-3 mb-md-4">
                  <div
                    className="card-header card-header-border card-title-separator"
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <h2 className="h5 card-title">Fragenliste</h2>
                      <p className="card-subtitle">
                        Fügen Sie unten eine Frage zur Umfrage hinzu
                      </p>
                    </div>

                    {!selectedTemplateId ? (
                      <button
                        className="btn btn-secondary btn-hover-effect me-2 me-md-3 btn-lg"
                        disabled={question_list.length > 0 ? false : true}
                        onClick={(e) => {
                          e.preventDefault();
                          saveTemplate();
                        }}
                      >
                        Vorlage speichern
                      </button>
                    ) : (
                      <Dropdown>
                        <Dropdown.Toggle>
                          <span className="btn-hover-effect me-2 me-md-3">
                            Template speichern
                          </span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="user-dropdown">
                          <Dropdown.Item
                            className="d-flex align-items-center"
                            // disabled={question_list.length > 0 ? false : true}
                            onClick={(e) => {
                              e.preventDefault();
                              saveTemplate();
                            }}
                          >
                            <span className="material-icons me-2">save</span>
                            Speichern unter
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="d-flex align-items-center"
                            onClick={(e) => {
                              e.preventDefault();
                              updateTemplate();
                            }}
                          >
                            <span className="material-icons me-2">edit</span>
                            Aktualisieren
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="d-flex align-items-center"
                            onClick={(e) => {
                              e.preventDefault();
                              deleteTemplate();
                            }}
                          >
                            <span className="material-icons me-2">delete</span>
                            Löschen
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </div>
                  <div className="card-body">
                    <ul className="list-unstyled cb-list-group cb-bordered-list mb-3 survey-que-list">
                      {/* Blank State */}
                      {/* <li className="cb-list-item">
                                        <div className="blank-state-message">
                                            <div className="cb-icon-avatar cb-icon-gray mb-3 cb-icon-72">
                                                <span className="material-icons">info</span>
                                            </div>
                                            <h6 className="text-muted">Select one of template option from above to start work on question list.</h6>
                                        </div>
                                    </li> */}

                      {/* Multiple choice - Radio */}

                      {question_list.map((ele, index) => {
                        if (ele.type === "mcq-grid-checkbox") {
                          return (
                            <li className="cb-list-item">
                              <div className="d-md-flex justify-content-between mb-3">
                                <div className="d-flex mb-2 mb-md-0">
                                  <div className="cb-icon-avatar cb-icon-secondary me-2 me-md-3">
                                    {index + 1}
                                  </div>
                                  <div className="form-group cb-form-group">
                                    <select
                                      className="form-select"
                                      placeholder="Select template"
                                      onChange={(e) => {
                                        console.log(e.target.value);
                                        let data = [];
                                        question_list.forEach((m, ki) => {
                                          if (ki === index) {
                                            if (e.target.value === "checkbox") {
                                              m = {
                                                uid: m.uid,
                                                type: "checkbox",
                                                question: "w",
                                                options: [
                                                  {
                                                    value: "",
                                                    score: 0,
                                                  },
                                                ],
                                              };
                                            } else if (
                                              e.target.value === "text"
                                            ) {
                                              m = {
                                                uid: m.uid,
                                                type: "text",
                                                question: "",
                                                score: "",
                                              };
                                            } else if (
                                              e.target.value === "mcq-grid"
                                            ) {
                                              m = {
                                                uid: m.uid,
                                                type: "mcq-grid",
                                                question: "",
                                                options: [
                                                  {
                                                    question: "question one",
                                                    option: [
                                                      {
                                                        value: "options one",
                                                        score: "10",
                                                      },
                                                    ],
                                                  },
                                                ],
                                              };
                                            } else if (
                                              e.target.value ===
                                              "mcq-grid-checkbox"
                                            ) {
                                              m = {
                                                uid: m.uid,
                                                type: "mcq-grid-checkbox",
                                                question: "",

                                                rows: [
                                                  {
                                                    value: "",
                                                  },
                                                ],
                                                colums: [
                                                  {
                                                    value: "",
                                                    socre: "",
                                                  },
                                                ],
                                              };
                                            }
                                          }
                                          data.push(m);
                                        });
                                        setQuestion_list(data);
                                      }}
                                    >
                                      <option selected value="mcq">
                                        Mehrfachauswahl
                                      </option>
                                      <option value="checkbox">
                                        Kontrollkästchen
                                      </option>
                                      <option value="mcq-grid-checkbox">
                                        MCQ-Kontrollkästchen
                                      </option>
                                      <option value="text">
                                        Text (Mehrzeilig)
                                      </option>
                                      <option value="mcq-grid">
                                        Mehrfachauswahl-Raster
                                      </option>
                                    </select>
                                  </div>
                                </div>
                                <div className="d-flex">
                                  <button
                                    className="btn-fab btn-secondary btn-hover-effect me-3"
                                    title="Duplizieren"
                                    onClick={(e) => {
                                      e.preventDefault();

                                      let datatopush = JSON.stringify(
                                        question_list[index]
                                      );

                                      setQuestion_list([
                                        ...question_list,
                                        JSON.parse(datatopush),
                                      ]);
                                    }}
                                  >
                                    <span className="material-icons">
                                      content_copy
                                    </span>
                                  </button>
                                  <button
                                    className="btn-fab btn-danger btn-hover-effect"
                                    title="Löschen"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      let data = [];
                                      question_list.map(
                                        (opt_del, opt_del_index) => {
                                          if (opt_del_index !== index) {
                                            data.push(opt_del);
                                          }
                                        }
                                      );
                                      setQuestion_list(data);
                                    }}
                                  >
                                    <span className="material-icons">
                                      delete{" "}
                                    </span>
                                  </button>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-8 form-group cb-form-group mb-3">
                                  <label className="form-label font-weight-bold">
                                    Frage
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Write your question..."
                                    value={ele.question}
                                    onChange={(e) => {
                                      let data = [];
                                      question_list.forEach((m, ki) => {
                                        if (ki === index) {
                                          m.question = e.target.value;
                                        }
                                        data.push(m);
                                      });
                                      setQuestion_list(data);
                                    }}
                                  />
                                </div>
                                <div className="col-3 form-group cb-form-group">
                                  <label className="form-label font-weight-bold">
                                    Kategorie
                                  </label>
                                  <select
                                    className="form-select"
                                    placeholder="Select template"
                                    value={ele.category}
                                    onChange={(e) => {
                                      console.log(e.target.value);
                                      let data = [];
                                      question_list.forEach((m, ki) => {
                                        if (ki === index) {
                                          m.category = parseInt(e.target.value);
                                        }
                                        data.push(m);
                                      });
                                      setQuestion_list(data);
                                    }}
                                  >
                                    {/* <option selected value="mcq">
                                      Multiple choice
                                    </option> */}
                                    {categoryList.map(
                                      (category, categoryIndex) => {
                                        return (
                                          <option value={category.id}>
                                            {category.name}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </div>
                                <div className="col-1 form-group cb-form-group">
                                  <label className="form-label font-weight-bold">
                                    Required
                                  </label>
                                  <div class="form-check">
                                    <input
                                      style={{
                                        height: 30,
                                        width: 30,
                                      }}
                                      class="form-check-input"
                                      type="checkbox"
                                      checked={ele.required}
                                      id="flexCheckDefault"
                                      onChange={(e) => {
                                        let data = [];
                                        question_list.forEach((m, ki) => {
                                          if (ki === index) {
                                            m.required = e.target.checked;
                                          }
                                          data.push(m);
                                        });
                                        setQuestion_list(data);
                                        console.log(data);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="row multiple-choice-grid-field">
                                <div className="col-md-6 mb-3 mb-md-0">
                                  <p className="form-label font-weight-bold fs-14">
                                    Rows
                                  </p>
                                  {ele.rows.map(
                                    (grid_options, gridopt_index) => {
                                      return (
                                        <>
                                          <div className="d-flex mb-3">
                                            <div className="form-group cb-form-group form-option-field">
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Add row"
                                                value={grid_options.value}
                                                onChange={(e) => {
                                                  let data = [];
                                                  question_list.forEach(
                                                    (m, ki) => {
                                                      if (ki === index) {
                                                        m.rows[
                                                          gridopt_index
                                                        ].value =
                                                          e.target.value;
                                                      }
                                                      data.push(m);
                                                    }
                                                  );
                                                  setQuestion_list(data);
                                                }}
                                              />
                                            </div>
                                            <button
                                              className="btn-fab btn-gray btn-hover-effect btn-ans-remove"
                                              title="Remove"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                let data = [];
                                                question_list.forEach(
                                                  (m, ki) => {
                                                    if (ki === index) {
                                                      m.rows = m.rows.filter(
                                                        (re, rei) =>
                                                          rei !== gridopt_index
                                                      );
                                                    }
                                                    //   console.log(m);
                                                    data.push(m);
                                                  }
                                                );
                                                setQuestion_list(data);
                                              }}
                                            >
                                              <span className="material-icons">
                                                close
                                              </span>
                                            </button>
                                          </div>
                                        </>
                                      );
                                    }
                                  )}
                                  <button
                                    className="btn btn-flat-link btn-link btn-icon-text btn-link-secondary"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      let data = [];
                                      question_list.forEach((m, ki) => {
                                        if (ki === index) {
                                          m.rows.push({
                                            value: "",
                                          });
                                        }
                                        data.push(m);
                                      });
                                      setQuestion_list(data);
                                    }}
                                  >
                                    <span className="material-icons me-1">
                                      add
                                    </span>
                                    <span className="link-text">
                                      Eine weitere Zeile hinzufügen
                                    </span>
                                  </button>
                                </div>

                                <div className="col-md-6">
                                  <p className="form-label font-weight-bold fs-14">
                                    Spalten & Punkte
                                  </p>

                                  {ele.colums.map(
                                    (grid_column, grid_column_index) => {
                                      return (
                                        <div className="d-flex mb-3">
                                          <div className="form-group cb-form-group form-option-field">
                                            <div className="d-md-flex form-radio-option">
                                              <input
                                                type="text"
                                                className="form-control form-control-option"
                                                placeholder="Add column"
                                                value={grid_column.value}
                                                onChange={(e) => {
                                                  let data = [];
                                                  question_list.forEach(
                                                    (m, ki) => {
                                                      if (ki === index) {
                                                        m.colums[
                                                          grid_column_index
                                                        ].value =
                                                          e.target.value;
                                                      }
                                                      data.push(m);
                                                    }
                                                  );
                                                  setQuestion_list(data);
                                                }}
                                              />
                                              <input
                                                type="text"
                                                className="form-control form-control-score"
                                                placeholder="Add score"
                                                value={grid_column.score}
                                                onChange={(e) => {
                                                  let data = [];
                                                  question_list.forEach(
                                                    (m, ki) => {
                                                      if (ki === index) {
                                                        m.colums[
                                                          grid_column_index
                                                        ].score =
                                                          e.target.value;
                                                      }
                                                      data.push(m);
                                                    }
                                                  );
                                                  setQuestion_list(data);
                                                }}
                                              />
                                            </div>
                                          </div>
                                          <button
                                            className="btn-fab btn-gray btn-hover-effect btn-ans-remove"
                                            title="Remove"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              let data = [];
                                              question_list.forEach((m, ki) => {
                                                if (ki === index) {
                                                  m.colums = m.colums.filter(
                                                    (re, rei) =>
                                                      rei !== grid_column_index
                                                  );
                                                }
                                                //   console.log(m);
                                                data.push(m);
                                              });
                                              setQuestion_list(data);
                                            }}
                                          >
                                            <span className="material-icons">
                                              close
                                            </span>
                                          </button>
                                        </div>
                                      );
                                    }
                                  )}
                                  <button
                                    className="btn btn-flat-link btn-link btn-icon-text btn-link-secondary"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      console.log(question_list);
                                      let data = [];
                                      question_list.forEach((m, ki) => {
                                        if (ki === index) {
                                          m.colums.push({
                                            value: "",
                                            score: "",
                                          });
                                        }
                                        data.push(m);
                                      });
                                      setQuestion_list(data);
                                    }}
                                  >
                                    <span className="material-icons me-1">
                                      add
                                    </span>
                                    <span className="link-text">
                                      Eine weitere Spalte hinzufügen
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </li>
                          );
                        }

                        if (ele.type === "mcq-grid") {
                          return (
                            <li className="cb-list-item">
                              <div className="d-md-flex justify-content-between mb-3">
                                <div className="d-flex mb-2 mb-md-0">
                                  <div className="cb-icon-avatar cb-icon-secondary me-2 me-md-3">
                                    {index + 1}
                                  </div>
                                  <div className="form-group cb-form-group">
                                    <select
                                      className="form-select"
                                      placeholder="Select template"
                                      onChange={(e) => {
                                        console.log(e.target.value);
                                        let data = [];
                                        question_list.forEach((m, ki) => {
                                          if (ki === index) {
                                            if (e.target.value === "checkbox") {
                                              m = {
                                                uid: m.uid,
                                                type: "checkbox",
                                                question: "w",
                                                options: [
                                                  {
                                                    value: "",
                                                    score: 0,
                                                  },
                                                ],
                                              };
                                            } else if (
                                              e.target.value === "text"
                                            ) {
                                              m = {
                                                uid: m.uid,
                                                type: "text",
                                                question: "",
                                                score: "",
                                              };
                                            } else if (
                                              e.target.value === "mcq-grid"
                                            ) {
                                              m = {
                                                uid: m.uid,
                                                type: "mcq-grid",
                                                question: "",
                                                options: [
                                                  {
                                                    question: "question one",
                                                    option: [
                                                      {
                                                        value: "options one",
                                                        score: "10",
                                                      },
                                                    ],
                                                  },
                                                ],
                                              };
                                            } else if (
                                              e.target.value ===
                                              "mcq-grid-checkbox"
                                            ) {
                                              m = {
                                                uid: m.uid,
                                                type: "mcq-grid-checkbox",
                                                question: "",

                                                rows: [
                                                  {
                                                    value: "",
                                                  },
                                                ],
                                                colums: [
                                                  {
                                                    value: "",
                                                    socre: "",
                                                  },
                                                ],
                                              };
                                            }
                                          }
                                          data.push(m);
                                        });
                                        setQuestion_list(data);
                                      }}
                                    >
                                      <option selected value="mcq">
                                        Mehrfachauswahl
                                      </option>
                                      <option value="checkbox">
                                        Kontrollkästchen
                                      </option>
                                      <option value="mcq-grid-checkbox">
                                        MCQ-Kontrollkästchen
                                      </option>
                                      <option value="text">
                                        Text (Mehrzeilig)
                                      </option>
                                      <option value="mcq-grid">
                                        Mehrfachauswahl-Raster
                                      </option>
                                    </select>
                                  </div>
                                </div>
                                <div className="d-flex">
                                  <button
                                    className="btn-fab btn-secondary btn-hover-effect me-3"
                                    title="Duplizieren"
                                    onClick={(e) => {
                                      e.preventDefault();

                                      let datatopush = JSON.stringify(
                                        question_list[index]
                                      );

                                      setQuestion_list([
                                        ...question_list,
                                        JSON.parse(datatopush),
                                      ]);
                                    }}
                                  >
                                    <span className="material-icons">
                                      content_copy
                                    </span>
                                  </button>
                                  <button
                                    className="btn-fab btn-danger btn-hover-effect"
                                    title="Löschen"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      let data = [];
                                      question_list.map(
                                        (opt_del, opt_del_index) => {
                                          if (opt_del_index !== index) {
                                            data.push(opt_del);
                                          }
                                        }
                                      );
                                      setQuestion_list(data);
                                    }}
                                  >
                                    <span className="material-icons">
                                      delete{" "}
                                    </span>
                                  </button>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-8 form-group cb-form-group mb-3">
                                  <label className="form-label font-weight-bold">
                                    Frage
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Write your question..."
                                    value={ele.question}
                                    onChange={(e) => {
                                      let data = [];
                                      question_list.forEach((m, ki) => {
                                        if (ki === index) {
                                          m.question = e.target.value;
                                        }
                                        data.push(m);
                                      });
                                      setQuestion_list(data);
                                    }}
                                  />
                                </div>
                                <div className="col-3 form-group cb-form-group">
                                  <label className="form-label font-weight-bold">
                                    Kategorie
                                  </label>
                                  <select
                                    className="form-select"
                                    placeholder="Select template"
                                    value={ele.category}
                                    onChange={(e) => {
                                      console.log(e.target.value);
                                      let data = [];
                                      question_list.forEach((m, ki) => {
                                        if (ki === index) {
                                          m.category = parseInt(e.target.value);
                                        }
                                        data.push(m);
                                      });
                                      setQuestion_list(data);
                                    }}
                                  >
                                    {/* <option selected value="mcq">
                                      Multiple choice
                                    </option> */}
                                    {categoryList.map(
                                      (category, categoryIndex) => {
                                        return (
                                          <option value={category.id}>
                                            {category.name}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </div>
                                <div className="col-1 form-group cb-form-group">
                                  <label className="form-label font-weight-bold">
                                    Required
                                  </label>
                                  <div class="form-check">
                                    <input
                                      style={{
                                        height: 30,
                                        width: 30,
                                      }}
                                      class="form-check-input"
                                      type="checkbox"
                                      checked={ele.required}
                                      id="flexCheckDefault"
                                      onChange={(e) => {
                                        let data = [];
                                        question_list.forEach((m, ki) => {
                                          if (ki === index) {
                                            m.required = e.target.checked;
                                          }
                                          data.push(m);
                                        });
                                        setQuestion_list(data);
                                        console.log(data);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="row multiple-choice-grid-field">
                                {ele.options.map(
                                  (grid_options, gridopt_index) => {
                                    return (
                                      <>
                                        <div className="col-md-6 mb-3 mb-md-0">
                                          <p className="form-label font-weight-bold fs-14">
                                            Reihe
                                          </p>

                                          <div className="d-flex mb-3">
                                            <div className="form-group cb-form-group form-option-field">
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Add row"
                                                value={grid_options.question}
                                                onChange={(e) => {
                                                  let data = [];
                                                  question_list.forEach(
                                                    (m, ki) => {
                                                      if (ki === index) {
                                                        m.options[
                                                          gridopt_index
                                                        ].question =
                                                          e.target.value;
                                                      }
                                                      data.push(m);
                                                    }
                                                  );
                                                  setQuestion_list(data);
                                                }}
                                              />
                                            </div>
                                            <button
                                              className="btn-fab btn-gray btn-hover-effect btn-ans-remove"
                                              title="Remove"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                let data = [];
                                                question_list.forEach(
                                                  (m, ki) => {
                                                    if (ki === index) {
                                                      m.options =
                                                        m.options.filter(
                                                          (re, rei) =>
                                                            rei !==
                                                            gridopt_index
                                                        );
                                                    }
                                                    //   console.log(m);
                                                    data.push(m);
                                                  }
                                                );
                                                setQuestion_list(data);
                                              }}
                                            >
                                              <span className="material-icons">
                                                close
                                              </span>
                                            </button>
                                          </div>
                                          {/* <button
                                      className="btn btn-flat-link btn-link btn-icon-text btn-link-secondary"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        let data = [];
                                        question_list.forEach((m, ki) => {
                                          if (m.uid === index) {
                                            m.options.push({
                                              question: "",
                                              option: [
                                                {
                                                  value: "",
                                                  score: "",
                                                },
                                              ],
                                            });
                                          }
                                          data.push(m);
                                        });
                                        setQuestion_list(data);
                                      }}
                                    >
                                      <span className="material-icons me-1">
                                        add
                                      </span>
                                      <span className="link-text">
                                        Weitere Zeile hinzufügen
                                      </span>
                                    </button> */}
                                        </div>
                                        <div className="col-md-6">
                                          <p className="form-label font-weight-bold fs-14">
                                            Spalte & Punkte
                                          </p>

                                          {grid_options.option.map(
                                            (
                                              grid_column,
                                              grid_column_index
                                            ) => {
                                              return (
                                                <div className="d-flex mb-3">
                                                  <div className="form-group cb-form-group form-option-field">
                                                    <div className="d-md-flex form-radio-option">
                                                      <input
                                                        type="text"
                                                        className="form-control form-control-option"
                                                        placeholder="Add column"
                                                        value={
                                                          grid_column.value
                                                        }
                                                        onChange={(e) => {
                                                          let data = [];
                                                          question_list.forEach(
                                                            (m, ki) => {
                                                              if (
                                                                ki === index
                                                              ) {
                                                                m.options[
                                                                  gridopt_index
                                                                ].option[
                                                                  grid_column_index
                                                                ].value =
                                                                  e.target.value;
                                                              }
                                                              data.push(m);
                                                            }
                                                          );
                                                          setQuestion_list(
                                                            data
                                                          );
                                                        }}
                                                      />
                                                      <input
                                                        type="text"
                                                        className="form-control form-control-score"
                                                        placeholder="Add score"
                                                        value={
                                                          grid_column.score
                                                        }
                                                        onChange={(e) => {
                                                          let data = [];
                                                          question_list.forEach(
                                                            (m, ki) => {
                                                              if (
                                                                ki === index
                                                              ) {
                                                                m.options[
                                                                  gridopt_index
                                                                ].option[
                                                                  grid_column_index
                                                                ].score =
                                                                  e.target.value;
                                                              }
                                                              data.push(m);
                                                            }
                                                          );
                                                          setQuestion_list(
                                                            data
                                                          );
                                                        }}
                                                      />
                                                    </div>
                                                  </div>
                                                  <button
                                                    className="btn-fab btn-gray btn-hover-effect btn-ans-remove"
                                                    title="Remove"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      let data = [];
                                                      question_list.forEach(
                                                        (m, ki) => {
                                                          if (ki === index) {
                                                            m.options[
                                                              gridopt_index
                                                            ].option = m.options[
                                                              gridopt_index
                                                            ].option.filter(
                                                              (re, rei) =>
                                                                rei !==
                                                                grid_column_index
                                                            );
                                                          }
                                                          //   console.log(m);
                                                          data.push(m);
                                                        }
                                                      );
                                                      setQuestion_list(data);
                                                    }}
                                                  >
                                                    <span className="material-icons">
                                                      close
                                                    </span>
                                                  </button>
                                                </div>
                                              );
                                            }
                                          )}
                                          <button
                                            className="btn btn-flat-link btn-link btn-icon-text btn-link-secondary"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              let data = [];
                                              question_list.forEach((m, ki) => {
                                                if (ki === index) {
                                                  m.options[
                                                    gridopt_index
                                                  ].option.push({
                                                    value: "",
                                                    score: "",
                                                  });
                                                }
                                                data.push(m);
                                              });
                                              setQuestion_list(data);
                                            }}
                                          >
                                            <span className="material-icons me-1">
                                              add
                                            </span>
                                            <span className="link-text">
                                              Weitere Spalte hinzufügen
                                            </span>
                                          </button>
                                        </div>
                                      </>
                                    );
                                  }
                                )}
                              </div>
                              <button
                                className="btn btn-flat-link btn-link btn-icon-text btn-link-secondary"
                                onClick={(e) => {
                                  e.preventDefault();
                                  let data = [];
                                  question_list.forEach((m, ki) => {
                                    if (ki === index) {
                                      m.options.push({
                                        question: "",
                                        option: [
                                          {
                                            value: "",
                                            score: "",
                                          },
                                        ],
                                      });
                                    }
                                    data.push(m);
                                  });
                                  setQuestion_list(data);
                                }}
                              >
                                <span className="material-icons me-1">add</span>
                                <span className="link-text">
                                  Weitere Zeile hinzufügen
                                </span>
                              </button>
                            </li>
                          );
                        }

                        if (ele.type === "text") {
                          return (
                            <li className="cb-list-item">
                              <div className="d-md-flex justify-content-between mb-3">
                                <div className="d-flex mb-2 mb-md-0">
                                  <div className="cb-icon-avatar cb-icon-secondary me-2 me-md-3">
                                    {index + 1}
                                  </div>
                                  <div className="form-group cb-form-group">
                                    <select
                                      className="form-select"
                                      placeholder="Select template"
                                      onChange={(e) => {
                                        console.log(e.target.value);
                                        let data = [];
                                        question_list.forEach((m, ki) => {
                                          if (ki === index) {
                                            if (e.target.value === "checkbox") {
                                              m = {
                                                uid: m.uid,
                                                type: "checkbox",
                                                question: "w",
                                                options: [
                                                  {
                                                    value: "",
                                                    score: 0,
                                                  },
                                                ],
                                              };
                                            } else if (
                                              e.target.value === "mcq-grid"
                                            ) {
                                              m = {
                                                uid: m.uid,
                                                type: "mcq-grid",
                                                question: "",
                                                options: [
                                                  {
                                                    question: "question one",
                                                    option: [
                                                      {
                                                        value: "options one",
                                                        score: "10",
                                                      },
                                                    ],
                                                  },
                                                ],
                                              };
                                            } else if (
                                              e.target.value === "mcq"
                                            ) {
                                              m = {
                                                uid: m.uid,
                                                type: "mcq",
                                                question: "",
                                                options: [
                                                  {
                                                    value: "options",
                                                    score: 10,
                                                  },
                                                ],
                                              };
                                            } else if (
                                              e.target.value ===
                                              "mcq-grid-checkbox"
                                            ) {
                                              m = {
                                                uid: m.uid,
                                                type: "mcq-grid-checkbox",
                                                question: "",

                                                rows: [
                                                  {
                                                    value: "",
                                                  },
                                                ],
                                                colums: [
                                                  {
                                                    value: "",
                                                    socre: "",
                                                  },
                                                ],
                                              };
                                            }
                                          }
                                          data.push(m);
                                        });
                                        setQuestion_list(data);
                                      }}
                                    >
                                      <option selected value="mcq">
                                        Mehrfachauswahl
                                      </option>
                                      <option value="checkbox">
                                        Kontrollkästchen
                                      </option>
                                      <option value="mcq-grid-checkbox">
                                        MCQ-Kontrollkästchen
                                      </option>
                                      <option value="text">
                                        Text (Mehrzeilig)
                                      </option>
                                      <option value="mcq-grid">
                                        Mehrfachauswahl-Raster
                                      </option>
                                    </select>
                                  </div>
                                </div>
                                <div className="d-flex">
                                  <button
                                    className="btn-fab btn-secondary btn-hover-effect me-3"
                                    title="Duplizieren"
                                    onClick={(e) => {
                                      e.preventDefault();

                                      let datatopush = JSON.stringify(
                                        question_list[index]
                                      );

                                      setQuestion_list([
                                        ...question_list,
                                        JSON.parse(datatopush),
                                      ]);
                                    }}
                                  >
                                    <span className="material-icons">
                                      content_copy
                                    </span>
                                  </button>
                                  <button
                                    className="btn-fab btn-danger btn-hover-effect"
                                    title="Löschen"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      let data = [];
                                      question_list.map(
                                        (opt_del, opt_del_index) => {
                                          if (opt_del_index !== index) {
                                            data.push(opt_del);
                                          }
                                        }
                                      );
                                      setQuestion_list(data);
                                    }}
                                  >
                                    <span className="material-icons">
                                      delete{" "}
                                    </span>
                                  </button>
                                </div>
                              </div>
                              <div className="d-md-flex">
                                <div className="form-group cb-form-group flex-fill mb-3 mb-md-0">
                                  <label className="form-label font-weight-bold">
                                    Frage
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Write your question..."
                                    value={ele.question}
                                    onChange={(e) => {
                                      let data = [];
                                      question_list.forEach((m, ki) => {
                                        if (ki === index) {
                                          m.question = e.target.value;
                                        }
                                        data.push(m);
                                      });
                                      setQuestion_list(data);
                                    }}
                                  />
                                </div>
                                <div className="col-4 form-group cb-form-group">
                                  <label className="form-label font-weight-bold">
                                    Kategorie
                                  </label>
                                  <select
                                    className="form-select"
                                    placeholder="Select template"
                                    value={ele.category}
                                    onChange={(e) => {
                                      console.log(e.target.value);
                                      let data = [];
                                      question_list.forEach((m, ki) => {
                                        if (ki === index) {
                                          m.category = parseInt(e.target.value);
                                        }
                                        data.push(m);
                                      });
                                      setQuestion_list(data);
                                    }}
                                  >
                                    {/* <option selected value="mcq">
                                      Multiple choice
                                    </option> */}
                                    {categoryList.map(
                                      (category, categoryIndex) => {
                                        return (
                                          <option value={category.id}>
                                            {category.name}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </div>
                                <div className="form-group cb-form-group ms-md-2 form-paragraph-score">
                                  <label className="form-label">Score</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Add score"
                                    value={ele.score}
                                    onChange={(e) => {
                                      let data = [];
                                      question_list.forEach((m, ki) => {
                                        if (ki === index) {
                                          m.score = e.target.value;
                                        }
                                        data.push(m);
                                      });
                                      setQuestion_list(data);
                                    }}
                                  />
                                </div>
                                <div className="col-1 form-group cb-form-group">
                                  <label className="form-label font-weight-bold">
                                    Required
                                  </label>
                                  <div class="form-check">
                                    <input
                                      style={{
                                        height: 30,
                                        width: 30,
                                        marginLeft: 5,
                                      }}
                                      class="form-check-input"
                                      type="checkbox"
                                      checked={ele.required}
                                      id="flexCheckDefault"
                                      onChange={(e) => {
                                        let data = [];
                                        question_list.forEach((m, ki) => {
                                          if (ki === index) {
                                            m.required = e.target.checked;
                                          }
                                          data.push(m);
                                        });
                                        setQuestion_list(data);
                                        console.log(data);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </li>
                          );
                        }

                        if (ele.type === "checkbox") {
                          return (
                            <li className="cb-list-item">
                              <div className="d-md-flex justify-content-between mb-3">
                                <div className="d-flex mb-2 mb-md-0">
                                  <div className="cb-icon-avatar cb-icon-secondary me-2 me-md-3">
                                    {index + 1}
                                  </div>
                                  <div className="form-group cb-form-group">
                                    <select
                                      className="form-select"
                                      placeholder="Select template"
                                      onChange={(e) => {
                                        console.log(e.target.value);
                                        let data = [];
                                        question_list.forEach((m, ki) => {
                                          if (ki === index) {
                                            if (e.target.value === "text") {
                                              m = {
                                                uid: m.uid,
                                                type: "text",
                                                question: "",
                                                score: "",
                                              };
                                            } else if (
                                              e.target.value === "mcq-grid"
                                            ) {
                                              m = {
                                                uid: m.uid,
                                                type: "mcq-grid",
                                                question: "",
                                                options: [
                                                  {
                                                    question: "question one",
                                                    option: [
                                                      {
                                                        value: "options one",
                                                        score: "10",
                                                      },
                                                    ],
                                                  },
                                                ],
                                              };
                                            } else if (
                                              e.target.value === "mcq"
                                            ) {
                                              m = {
                                                uid: m.uid,
                                                type: "mcq",
                                                question: "",
                                                options: [
                                                  {
                                                    value: "options",
                                                    score: 10,
                                                  },
                                                ],
                                              };
                                            } else if (
                                              e.target.value ===
                                              "mcq-grid-checkbox"
                                            ) {
                                              m = {
                                                uid: m.uid,
                                                type: "mcq-grid-checkbox",
                                                question: "",

                                                rows: [
                                                  {
                                                    value: "",
                                                  },
                                                ],
                                                colums: [
                                                  {
                                                    value: "",
                                                    socre: "",
                                                  },
                                                ],
                                              };
                                            }
                                          }
                                          data.push(m);
                                        });
                                        setQuestion_list(data);
                                      }}
                                    >
                                      <option selected value="mcq">
                                        Mehrfachauswahl
                                      </option>
                                      <option value="checkbox">
                                        Kontrollkästchen
                                      </option>
                                      <option value="mcq-grid-checkbox">
                                        MCQ-Kontrollkästchen
                                      </option>
                                      <option value="text">
                                        Text (Mehrzeilig)
                                      </option>
                                      <option value="mcq-grid">
                                        Mehrfachauswahl-Raster
                                      </option>
                                    </select>
                                  </div>
                                </div>
                                <div className="d-flex">
                                  <button
                                    className="btn-fab btn-secondary btn-hover-effect me-3"
                                    title="Duplizieren"
                                    onClick={(e) => {
                                      e.preventDefault();

                                      let datatopush = JSON.stringify(
                                        question_list[index]
                                      );

                                      setQuestion_list([
                                        ...question_list,
                                        JSON.parse(datatopush),
                                      ]);
                                    }}
                                  >
                                    <span className="material-icons">
                                      content_copy
                                    </span>
                                  </button>
                                  <button
                                    className="btn-fab btn-danger btn-hover-effect"
                                    title="Löschen"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      let data = [];
                                      question_list.map(
                                        (opt_del, opt_del_index) => {
                                          if (opt_del_index !== index) {
                                            data.push(opt_del);
                                          }
                                        }
                                      );
                                      setQuestion_list(data);
                                    }}
                                  >
                                    <span className="material-icons">
                                      delete{" "}
                                    </span>
                                  </button>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-8 form-group cb-form-group mb-3">
                                  <label className="form-label font-weight-bold">
                                    Frage
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Write your question..."
                                    value={ele.question}
                                    onChange={(e) => {
                                      let data = [];
                                      question_list.forEach((m, ki) => {
                                        if (ki === index) {
                                          m.question = e.target.value;
                                        }
                                        data.push(m);
                                      });
                                      setQuestion_list(data);
                                    }}
                                  />
                                </div>

                                <div className="col-3 form-group cb-form-group">
                                  <label className="form-label font-weight-bold">
                                    Kategorie
                                  </label>
                                  <select
                                    className="form-select"
                                    placeholder="Select template"
                                    value={ele.category}
                                    onChange={(e) => {
                                      let data = [];
                                      question_list.forEach((m, ki) => {
                                        if (ki === index) {
                                          m.category = parseInt(e.target.value);
                                        }
                                        data.push(m);
                                      });
                                      setQuestion_list(data);
                                    }}
                                  >
                                    {/* <option value="mcq">Multiple choice</option> */}
                                    {categoryList.map(
                                      (category, categoryIndex) => {
                                        return (
                                          <option value={category.id}>
                                            {category.name}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </div>
                                <div className="col-1 form-group cb-form-group">
                                  <label className="form-label font-weight-bold">
                                    Required
                                  </label>
                                  <div class="form-check">
                                    <input
                                      style={{
                                        height: 30,
                                        width: 30,
                                      }}
                                      class="form-check-input"
                                      type="checkbox"
                                      checked={ele.required}
                                      id="flexCheckDefault"
                                      onChange={(e) => {
                                        let data = [];
                                        question_list.forEach((m, ki) => {
                                          if (ki === index) {
                                            m.required = e.target.checked;
                                          }
                                          data.push(m);
                                        });
                                        setQuestion_list(data);
                                        console.log(data);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-md-12">
                                  <p className="form-label font-weight-bold">
                                    Antwort
                                  </p>
                                </div>
                                {ele.options.map((option, option_index) => {
                                  return (
                                    <div className="col-md-6 d-flex mb-3">
                                      <div className="form-group cb-form-group form-option-field">
                                        <label className="form-label">
                                          option {" " + (option_index + 1)}
                                        </label>
                                        <div className="d-md-flex form-checkbox-option">
                                          <input
                                            type="text"
                                            className="form-control form-control-option"
                                            placeholder="Add option"
                                            value={option.value}
                                            onChange={(e) => {
                                              let data = [];
                                              question_list.forEach((m, ki) => {
                                                if (ki === index) {
                                                  m.options[
                                                    option_index
                                                  ].value = e.target.value;
                                                }
                                                data.push(m);
                                              });
                                              setQuestion_list(data);
                                            }}
                                          />
                                          <input
                                            type="text"
                                            className="form-control form-control-score"
                                            placeholder="Add score"
                                            value={option.score}
                                            onChange={(e) => {
                                              let data = [];
                                              question_list.forEach((m, ki) => {
                                                if (ki === index) {
                                                  m.options[
                                                    option_index
                                                  ].score = e.target.value;
                                                }
                                                data.push(m);
                                              });
                                              setQuestion_list(data);
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <button
                                        className="btn-fab btn-gray btn-hover-effect btn-ans-remove"
                                        title="Remove"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          let data = [];
                                          question_list.forEach((m, ki) => {
                                            if (ki === index) {
                                              m.options = m.options.filter(
                                                (re, rei) =>
                                                  rei !== option_index
                                              );
                                            }
                                            //   console.log(m);
                                            data.push(m);
                                          });
                                          setQuestion_list(data);
                                        }}
                                      >
                                        <span className="material-icons">
                                          close
                                        </span>
                                      </button>
                                    </div>
                                  );
                                })}

                                <div className="col-md-12">
                                  <button
                                    className="btn btn-flat-link btn-link btn-icon-text btn-link-secondary"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      let data = [];
                                      question_list.forEach((m, ki) => {
                                        if (ki === index) {
                                          m.options.push({
                                            value: "",
                                            score: "",
                                          });
                                        }
                                        data.push(m);
                                      });
                                      setQuestion_list(data);
                                    }}
                                  >
                                    <span className="material-icons me-1">
                                      add
                                    </span>
                                    <span className="link-text">
                                      Weitere Option hinzufügen
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </li>
                          );
                        }
                        if (ele.type === "mcq") {
                          return (
                            <li className="cb-list-item">
                              <div className="d-md-flex justify-content-between mb-3">
                                <div className="d-flex mb-2 mb-md-0">
                                  <div className="cb-icon-avatar cb-icon-secondary me-2 me-md-3">
                                    {index + 1}
                                  </div>
                                  <div className="form-group cb-form-group">
                                    <select
                                      className="form-select"
                                      placeholder="Select template"
                                      onChange={(e) => {
                                        console.log(e.target.value);
                                        let data = [];
                                        question_list.forEach((m, ki) => {
                                          if (ki === index) {
                                            if (e.target.value === "checkbox") {
                                              m = {
                                                uid: m.uid,
                                                type: "checkbox",
                                                question: "w",
                                                options: [
                                                  {
                                                    value: "",
                                                    score: 0,
                                                  },
                                                ],
                                              };
                                            } else if (
                                              e.target.value === "text"
                                            ) {
                                              m = {
                                                uid: m.uid,
                                                type: "text",
                                                question: "",
                                                score: "",
                                              };
                                            } else if (
                                              e.target.value === "mcq-grid"
                                            ) {
                                              m = {
                                                uid: m.uid,
                                                type: "mcq-grid",
                                                question: "",
                                                options: [
                                                  {
                                                    question: "question one",
                                                    option: [
                                                      {
                                                        value: "options one",
                                                        score: "10",
                                                      },
                                                    ],
                                                  },
                                                ],
                                              };
                                            } else if (
                                              e.target.value === "mcq"
                                            ) {
                                              m = {
                                                uid: m.uid,
                                                type: "mcq",
                                                question: "",
                                                options: [
                                                  {
                                                    value: "options",
                                                    score: 10,
                                                  },
                                                ],
                                              };
                                            } else if (
                                              e.target.value ===
                                              "mcq-grid-checkbox"
                                            ) {
                                              m = {
                                                uid: m.uid,
                                                type: "mcq-grid-checkbox",
                                                question: "",

                                                rows: [
                                                  {
                                                    value: "",
                                                  },
                                                ],
                                                colums: [
                                                  {
                                                    value: "",
                                                    socre: "",
                                                  },
                                                ],
                                              };
                                            }
                                          }
                                          data.push(m);
                                        });
                                        setQuestion_list(data);
                                      }}
                                    >
                                      <option selected value="mcq">
                                        Mehrfachauswahl
                                      </option>
                                      <option value="checkbox">
                                        Kontrollkästchen
                                      </option>
                                      <option value="mcq-grid-checkbox">
                                        MCQ-Kontrollkästchen
                                      </option>
                                      <option value="text">
                                        Text (Mehrzeilig)
                                      </option>
                                      <option value="mcq-grid">
                                        Mehrfachauswahl-Raster
                                      </option>
                                    </select>
                                  </div>
                                </div>
                                <div className="d-flex">
                                  <button
                                    className="btn-fab btn-secondary btn-hover-effect me-3"
                                    title="Duplizieren"
                                    onClick={(e) => {
                                      e.preventDefault();

                                      let datatopush = JSON.stringify(
                                        question_list[index]
                                      );

                                      setQuestion_list([
                                        ...question_list,
                                        JSON.parse(datatopush),
                                      ]);
                                    }}
                                  >
                                    <span className="material-icons">
                                      content_copy
                                    </span>
                                  </button>
                                  <button
                                    className="btn-fab btn-danger btn-hover-effect"
                                    title="Löschen"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      let data = [];
                                      question_list.map(
                                        (opt_del, opt_del_index) => {
                                          if (opt_del_index !== index) {
                                            data.push(opt_del);
                                          }
                                        }
                                      );
                                      setQuestion_list(data);
                                    }}
                                  >
                                    <span className="material-icons">
                                      delete{" "}
                                    </span>
                                  </button>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-8 form-group cb-form-group mb-3">
                                  <label className="form-label font-weight-bold">
                                    Frage
                                  </label>
                                  <input
                                    type="text"
                                    value={ele.question}
                                    onChange={(e) => {
                                      let data = [];
                                      question_list.forEach((m, ki) => {
                                        if (ki === index) {
                                          m.question = e.target.value;
                                        }
                                        data.push(m);
                                      });
                                      setQuestion_list(data);
                                    }}
                                    className="form-control"
                                    placeholder="Write your question..."
                                  />
                                </div>
                                <div className="col-3 form-group cb-form-group">
                                  <label className="form-label font-weight-bold">
                                    Kategorie
                                  </label>
                                  <select
                                    className="form-select"
                                    placeholder="Select template"
                                    value={ele.category}
                                    onChange={(e) => {
                                      console.log(e.target.value);
                                      let data = [];
                                      question_list.forEach((m, ki) => {
                                        if (ki === index) {
                                          m.category = parseInt(e.target.value);
                                        }
                                        data.push(m);
                                      });
                                      setQuestion_list(data);
                                    }}
                                  >
                                    {/* <option selected value="mcq">
                                      Multiple choice
                                    </option> */}
                                    {categoryList.map(
                                      (category, categoryIndex) => {
                                        return (
                                          <option value={category.id}>
                                            {category.name}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </div>
                                <div className="col-1 form-group cb-form-group">
                                  <label className="form-label font-weight-bold">
                                    Required
                                  </label>
                                  <div class="form-check">
                                    <input
                                      style={{
                                        height: 30,
                                        width: 30,
                                      }}
                                      class="form-check-input"
                                      type="checkbox"
                                      checked={ele.required}
                                      id="flexCheckDefault"
                                      onChange={(e) => {
                                        let data = [];
                                        question_list.forEach((m, ki) => {
                                          if (ki === index) {
                                            m.required = e.target.checked;
                                          }
                                          data.push(m);
                                        });
                                        setQuestion_list(data);
                                        console.log(data);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-md-12">
                                  <p className="form-label font-weight-bold">
                                    Antwort
                                  </p>
                                </div>

                                {ele.options.map((option, option_index) => {
                                  return (
                                    <div className="col-md-6 d-flex mb-3">
                                      <div className="form-group cb-form-group form-option-field">
                                        <label className="form-label">
                                          option {" " + (option_index + 1)}
                                        </label>
                                        <div className="d-md-flex form-radio-option">
                                          <input
                                            type="text"
                                            className="form-control form-control-option"
                                            placeholder="Add option"
                                            value={option.value}
                                            onChange={(e) => {
                                              let data = [];
                                              question_list.forEach((m, ki) => {
                                                if (ki === index) {
                                                  m.options[
                                                    option_index
                                                  ].value = e.target.value;
                                                }
                                                data.push(m);
                                              });
                                              setQuestion_list(data);
                                            }}
                                          />
                                          <input
                                            type="text"
                                            className="form-control form-control-score"
                                            placeholder="Add score"
                                            value={option.score}
                                            onChange={(e) => {
                                              let data = [];
                                              question_list.forEach((m, ki) => {
                                                if (ki === index) {
                                                  m.options[
                                                    option_index
                                                  ].score = e.target.value;
                                                }
                                                data.push(m);
                                              });
                                              setQuestion_list(data);
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <button
                                        className="btn-fab btn-gray btn-hover-effect btn-ans-remove"
                                        title="Remove"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          let data = [];
                                          question_list.forEach((m, ki) => {
                                            if (ki === index) {
                                              m.options = m.options.filter(
                                                (re, rei) =>
                                                  rei !== option_index
                                              );
                                            }
                                            //   console.log(m);
                                            data.push(m);
                                          });
                                          setQuestion_list(data);
                                        }}
                                      >
                                        <span className="material-icons">
                                          close
                                        </span>
                                      </button>
                                    </div>
                                  );
                                })}
                                <div className="col-md-12">
                                  <button
                                    className="btn btn-flat-link btn-link btn-icon-text btn-link-secondary"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      let data = [];
                                      question_list.forEach((m, ki) => {
                                        if (ki === index) {
                                          m.options.push({
                                            value: "",
                                            score: "",
                                          });
                                        }
                                        data.push(m);
                                      });
                                      setQuestion_list(data);
                                    }}
                                  >
                                    <span className="material-icons me-1">
                                      add
                                    </span>
                                    <span className="link-text">
                                      Weitere Option hinzufügen
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </li>
                          );
                        }
                      })}

                      {/* Checkbox */}

                      {/* Text - Paragraph */}

                      {/* Multiple choice grid - Radio */}

                      {/* Neue Frage hinzufügen button */}
                      <li className="cb-list-item">
                        <button
                          className="btn btn-icon-text btn-gray-outline w-100"
                          onClick={(e) => {
                            console.log(question_list);
                            e.preventDefault();
                            setQuestion_list((ele) => [
                              ...ele,
                              {
                                uid: "hassan",
                                type: "mcq",
                                question: "",
                                options: [
                                  {
                                    value: "options",
                                    score: 10,
                                  },
                                ],
                              },
                            ]);
                          }}
                        >
                          <span className="material-icons me-1">add</span>
                          <span className="link-text">
                            Neue Frage hinzufügen
                          </span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </>
            ) : null}
            {/* Create Question Start */}

            {/* Create Question End */}

            {/* Form Actions Start */}
            <div className="row align-items-center">
              <div className="col-md-6 mb-3 mb-md-0 order-md-2 d-md-flex justify-content-end">
                {/* <button className="btn btn-secondary btn-hover-effect me-2 me-md-3 btn-lg">
                  Save Draft
                </button> */}
                <button
                  className="btn btn-primary btn-raised btn-hover-effect btn-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    update_survey(status);
                  }}
                >
                  Aktualisieren
                </button>
              </div>
              <div className="col-md-6 order-md-1">
                <button className="btn btn-gray btn-hover-effect btn-lg">
                  Formular zurücksetzen
                </button>
              </div>
            </div>
            {/* Form Actions End */}
          </form>
        </div>
      </main>
    </div>
  );
}

export default EditSurvey;
