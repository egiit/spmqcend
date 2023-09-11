import { useContext } from "react";
import { Row, Col, Button, Card, Form, Spinner } from "react-bootstrap";
import { ImUndo2 } from "react-icons/im";
import { QcEndlineContex } from "../../provider/QcEndProvider";
import { IoIosArrowBack } from "react-icons/io";
import { _ACTION } from "../../provider/QcEndAction";
import { flash } from "react-universal-flash";

const MainBtnQcInpt = () => {
  const {
    state,
    dispatch,
    planSizeUnSelected,
    handlePageActive,
    postOutput,
    handleUndoDefRejGood,
  } = useContext(QcEndlineContex);
  const bdl = state.planSizeSelect;
  const qr = state.qrQtyResult[0] ? state.qrQtyResult[0] : state.planSizeSelect;
  const undos = state.undoCount;

  function handleMultiple(e) {
    e.preventDefault();
    const { value } = e.target;
    if (value > 5 || value < 0)
      return flash(
        `Tidak dapat set perkalian kurang dari 0 dan lebih besar dari 5`,
        // `Can't Set Multiple Less Then 0 and Greater Than 5`,
        2000,
        "danger"
      );
    return dispatch({
      type: _ACTION._SET_MULTIPLE_RTT,
      payload: value,
    });
  }

  return (
    <>
      <Row className="justify-content-between pe-0 mb-2">
        <Col sm={5}>
          <Row className="border rounded p-1 ms-1 bg-warning bg-opacity-50">
            <Col className="border-end border-dark">
              Bundle QTY :<span className="ms-1 fw-bold">{bdl.ORDER_QTY}</span>
            </Col>
            <Col>
              Checked QTY :
              <span className="ms-1 fw-bold">{qr.TOTAL_CHECKED}</span>
            </Col>
          </Row>
        </Col>
        {/* <Col sm={3} className="text-end pe-0">
          <Button variant="primary" onClick={() => console.log("Primary")}>
            Messurment <FcRuler size={20} />
          </Button>
        </Col> */}
      </Row>
      <Row>
        <Col>
          <Row className="mb-3">
            <Col>
              <Card className="border-opacity-25 shadow">
                <Card.Body>
                  <Row>
                    <Col sm={9}>
                      {state.btnProcess ? (
                        <Row
                          className={`good-btn btn p-3 rounded d-flex align-items-center shadow disabled`}
                          style={{ height: "30vh" }}
                        >
                          <Col>
                            <Spinner
                              animation="border"
                              role="status"
                              variant="secondary"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </Spinner>
                          </Col>
                        </Row>
                      ) : (
                        <Row
                          className={`good-btn btn p-3 rounded d-flex align-items-center shadow ${
                            bdl.ORDER_QTY === parseInt(qr.TOTAL_CHECKED)
                              ? "disabled"
                              : ""
                          }`}
                          style={{ height: "30vh" }}
                          onClick={() => postOutput("RTT")}
                        >
                          <Col className="text-start">
                            <h3>RFT</h3>
                          </Col>
                          <Col className="text-center ms-4">
                            <h1>{qr.RTT}</h1>
                          </Col>
                        </Row>
                      )}
                    </Col>
                    <Col sm={3} className="px-3">
                      <Row className="px-2 mb-2">
                        <Col className="border rounded shadow-sm">
                          <div
                            style={{ fontSize: "13px" }}
                            className="text-center bg-success text-light rounded my-1"
                          >
                            MULTIPLE
                          </div>
                          <div className="mb-1">
                            <Form.Control
                              type="number"
                              min={0}
                              max={5}
                              value={state.multipleRtt}
                              onChange={handleMultiple}
                              className="text-center fw-bold fs-5"
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row
                        className="py-1 rounded d-flex align-items-center ms-1"
                        // style={{ height: "30vh" }}
                      >
                        <Col className="text-center">
                          <Button
                            variant="light"
                            className="shadow-sm border"
                            disabled={!undos.UNDO_RTT || undos.UNDO_RTT === 0}
                            onClick={() => handleUndoDefRejGood("RTT")}
                          >
                            <ImUndo2 size={40} className="undo-btn" />
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card className="border-opacity-25 shadow">
                <Card.Body>
                  <Row>
                    <Col sm={9}>
                      {state.btnProcess ? (
                        <Row
                          className={`btn-bs btn p-3 rounded d-flex align-items-center shadow disabled`}
                          style={{ height: "30vh" }}
                        >
                          <Col className="text-center">
                            <Spinner
                              animation="border"
                              role="status"
                              variant="light"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </Spinner>
                          </Col>
                        </Row>
                      ) : (
                        <Row
                          className={`btn-bs btn p-3 rounded d-flex align-items-center shadow ${
                            bdl.ORDER_QTY === parseInt(qr.TOTAL_CHECKED)
                              ? "disabled"
                              : ""
                          }`}
                          style={{ height: "30vh" }}
                          onClick={() => handlePageActive("BS")}
                        >
                          <Col className="text-start">
                            <h3>BAD STOCK</h3>
                          </Col>
                          <Col className="text-center ms-4">
                            <h1>{qr.BS}</h1>
                          </Col>
                        </Row>
                      )}
                    </Col>
                    <Col sm={3}>
                      <Row
                        className="p-3 rounded d-flex align-items-center ms-1 border-start"
                        style={{ height: "30vh" }}
                      >
                        <Col className="text-center">
                          <Button
                            variant="light"
                            className="shadow-sm border"
                            disabled={!undos.UNDO_BS || undos.UNDO_BS === 0}
                            onClick={() => handleUndoDefRejGood("BS")}
                          >
                            <ImUndo2 size={40} className="undo-btn" />
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row className="mb-3">
            <Col>
              <Card className="border-opacity-25 shadow">
                <Card.Body>
                  <Row>
                    <Col sm={9}>
                      {state.btnProcess ? (
                        <Row
                          className={`btn-defect btn p-2 rounded d-flex align-items-center shadow mb-2 disabled`}
                          style={{ height: "14vh" }}
                        >
                          <Col>
                            <Spinner
                              animation="border"
                              role="status"
                              variant="secondary"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </Spinner>
                          </Col>
                        </Row>
                      ) : (
                        <Row
                          className={`btn-defect btn p-2 rounded d-flex align-items-center shadow mb-2 ${
                            bdl.ORDER_QTY === parseInt(qr.TOTAL_CHECKED)
                              ? "disabled"
                              : ""
                          }`}
                          style={{ height: "14vh" }}
                          onClick={() => handlePageActive("DEFECT")}
                        >
                          <Col className="text-start">
                            <h3>DEFECTIVES</h3>
                          </Col>
                          <Col className="text-center ms-4">
                            <h1>{qr.DEFECT}</h1>
                          </Col>
                        </Row>
                      )}
                      {state.btnProcess ? (
                        <Row
                          className={`btn-defect btn p-2 rounded d-flex align-items-center shadow mt-1 disabled`}
                          style={{ height: "14vh" }}
                        >
                          <Col>
                            <Spinner
                              animation="border"
                              role="status"
                              variant="secondary"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </Spinner>
                          </Col>
                        </Row>
                      ) : (
                        <Row
                          className={`btn-defect btn p-2 rounded d-flex align-items-center shadow mt-1 ${
                            bdl.ORDER_QTY === parseInt(qr.TOTAL_CHECKED)
                              ? "disabled"
                              : ""
                          }`}
                          style={{ height: "14vh" }}
                          onClick={() => postOutput("DEFECT_PREV")}
                        >
                          <Col className="text-start">
                            <h3>DEFECT PREVIOUS </h3>
                          </Col>
                        </Row>
                      )}
                    </Col>
                    <Col sm={3}>
                      <Row
                        className="p-3 rounded d-flex align-items-center ms-1 border-start"
                        style={{ height: "30vh" }}
                      >
                        <Col className="text-center">
                          <Button
                            variant="light"
                            className="shadow-sm border"
                            disabled={
                              !undos.UNDO_DEFECT || undos.UNDO_DEFECT === 0
                            }
                            onClick={() => handleUndoDefRejGood("DEFECT")}
                          >
                            <ImUndo2 size={40} className="undo-btn" />
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card className="border-opacity-25 shadow">
                <Card.Body>
                  <Row>
                    <Col sm={9}>
                      {state.btnProcess ? (
                        <Row
                          className={`btn-repaird btn p-3 rounded d-flex align-items-center shadow disabled`}
                          style={{ height: "30vh" }}
                        >
                          <Col className="text-center">
                            <Spinner
                              animation="border"
                              role="status"
                              variant="light"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </Spinner>
                          </Col>
                        </Row>
                      ) : (
                        <Row
                          className={`btn-repaird btn p-3 rounded d-flex align-items-center shadow ${
                            state.dataDefectForRep.length === 0
                              ? "disabled"
                              : ""
                          }`}
                          style={{ height: "30vh" }}
                          onClick={() => handlePageActive("REPAIRED")}
                        >
                          <Col className="text-start">
                            <h3>REPAIRED</h3>
                          </Col>
                          <Col className="text-center ms-4">
                            <h1>{qr.REPAIRED}</h1>
                          </Col>
                        </Row>
                      )}
                    </Col>
                    <Col sm={3}>
                      <Row
                        className="p-3 rounded d-flex align-items-center ms-1 border-start"
                        style={{ height: "30vh" }}
                      >
                        <Col className="text-center">
                          <Button
                            variant="light"
                            className="shadow-sm border"
                            disabled={
                              !undos.UNDO_REPAIR || undos.UNDO_REPAIR === 0
                            }
                            onClick={() => handleUndoDefRejGood("REPAIR")}
                          >
                            <ImUndo2 size={40} className="undo-btn" />
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="justify-content-end mt-4">
        <Col sm={3} className="text-end">
          <Button
            variant="primary"
            onClick={() => planSizeUnSelected(bdl.PLANSIZE_ID)}
          >
            <IoIosArrowBack size={20} /> Back
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default MainBtnQcInpt;
