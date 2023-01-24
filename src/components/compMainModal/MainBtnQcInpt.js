import { useContext } from "react";
import { Row, Col, Button, Card, Form } from "react-bootstrap";
import { ImUndo2 } from "react-icons/im";
import { QcEndlineContex } from "../../provider/QcEndProvider";
import { IoIosArrowBack } from "react-icons/io";
import { FcRuler } from "react-icons/fc";
// import { _ACTION } from "../../provider/QcEndAction";

const MainBtnQcInpt = () => {
  const { state, bdlUnslected, handlePageActive } = useContext(QcEndlineContex);
  const bdl = state.bdlSelect;

  return (
    <>
      <Row className="justify-content-between pe-0 mb-2">
        <Col sm={4}>
          <Row className="border rounded p-1 ms-1 bg-warning bg-opacity-50">
            <Col className="border-end border-dark">
              Bundle QTY : <span className="ms-1 fw-bold">{bdl.ORDER_QTY}</span>
            </Col>
            <Col>
              Checked QTY :{" "}
              <span className="ms-1 fw-bold">{bdl.ORDER_QTY}</span>
            </Col>
          </Row>
        </Col>
        <Col sm={3} className="text-end pe-0">
          <Button variant="primary" onClick={() => console.log("Primary")}>
            Messurment <FcRuler size={20} />
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Row className="mb-3">
            <Col>
              <Card className="border-opacity-25 shadow">
                <Card.Body>
                  <Row>
                    <Col sm={9}>
                      <Row
                        className="good-btn btn p-3 rounded d-flex align-items-center shadow"
                        // className={`bg-success btn p-3 rounded d-flex align-items-center shadow ${
                        //   sequenceStatus === headerActiv.QC_LBO_SS
                        //     ? 'disabled'
                        //     : ''
                        // }`}
                        style={{ height: "30vh" }}
                        // onClick={() =>
                        //   handlePostDefRejGood('GOOD', null, null)
                        // }
                      >
                        <Col className="text-start">
                          <h3>GOOD</h3>
                        </Col>
                        <Col className="text-center ms-4">
                          <h1>00</h1>
                        </Col>
                      </Row>
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
                            // disabled={goodValue === 0}
                            // onClick={() =>
                            //   handleUndoDefRejGood(
                            //     headerActiv.QC_LBO_ID,
                            //     'GOOD'
                            //   )
                            // }
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
                      <Row
                        className={`btn-bs btn p-3 rounded d-flex align-items-center shadow`}
                        // className={`bg-danger btn p-3 rounded d-flex align-items-center shadow ${
                        //   sequenceStatus === headerActiv.QC_LBO_SS
                        //     ? 'disabled'
                        //     : ''
                        // }`}
                        style={{ height: "30vh" }}
                        // onClick={() => handleShowRejAndDef('REJECT')}
                      >
                        <Col className="text-start">
                          <h3>BS</h3>
                        </Col>
                        <Col className="text-center ms-4">
                          <h1>00</h1>
                        </Col>
                      </Row>
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
                            // disabled={rejectValue === 0}
                            // onClick={() =>
                            //   handleUndoDefRejGood(
                            //     headerActiv.QC_LBO_ID,
                            //     'REJECT'
                            //   )
                            // }
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
                      <Row
                        className={`btn-defect btn p-2 rounded d-flex align-items-center shadow mb-2`}
                        // className={`bg-warning btn p-3 rounded d-flex align-items-center shadow ${
                        //   sequenceStatus === headerActiv.QC_LBO_SS
                        //     ? 'disabled'
                        //     : ''
                        // }`}
                        style={{ height: "14vh" }}
                        onClick={() => handlePageActive("DEFECT")}
                      >
                        <Col className="text-start">
                          <h3>DEFECTIVES</h3>
                        </Col>
                        <Col className="text-center ms-4">
                          <h1>00</h1>
                        </Col>
                      </Row>
                      <Row
                        className={`btn-defect btn p-2 rounded d-flex align-items-center shadow mt-1}`}
                        // className={`bg-warning btn p-3 rounded d-flex align-items-center shadow mt-1 ${
                        //   sequenceStatus === headerActiv.QC_LBO_SS
                        //     ? 'disabled'
                        //     : ''
                        // }`}
                        style={{ height: "14vh" }}
                        // onClick={() => handlePostDefBefore()}
                      >
                        <Col className="text-start">
                          <h3>DEFECT PREVIOUS </h3>
                        </Col>
                      </Row>
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
                            // disabled={defectValue === 0}
                            // onClick={() =>
                            //   handleUndoDefRejGood(
                            //     headerActiv.QC_LBO_ID,
                            //     'DEFECT'
                            //   )
                            // }
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
                      <Row
                        className={`btn-repaird btn p-3 rounded d-flex align-items-center shadow`}
                        // className={`bg-danger btn p-3 rounded d-flex align-items-center shadow ${
                        //   sequenceStatus === headerActiv.QC_LBO_SS
                        //     ? 'disabled'
                        //     : ''
                        // }`}
                        style={{ height: "30vh" }}
                        // onClick={() => handleShowRejAndDef('REJECT')}
                      >
                        <Col className="text-start">
                          <h3>REPAIRD</h3>
                        </Col>
                        <Col className="text-center ms-4">
                          <h1>00</h1>
                        </Col>
                      </Row>
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
                            // disabled={rejectValue === 0}
                            // onClick={() =>
                            //   handleUndoDefRejGood(
                            //     headerActiv.QC_LBO_ID,
                            //     'REJECT'
                            //   )
                            // }
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
          <Button variant="primary" onClick={bdlUnslected}>
            <IoIosArrowBack size={20} /> Back
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default MainBtnQcInpt;
