import React, { useContext } from "react";
import { Table, Button, Card } from "react-bootstrap";
import { QcEndlineContex } from "../provider/QcEndProvider";
import { MdAdd, MdUndo } from "react-icons/md";

const InputLog = () => {
  const { state } = useContext(QcEndlineContex);

  function checkType(log) {
    if (log === "RFT")
      return (
        <Button size="sm" variant="success">
          RFT
        </Button>
      );
    if (log === "DEFECT")
      return (
        <Button size="sm" variant="warning">
          DEFECT
        </Button>
      );
    if (log === "REPAIRED")
      return (
        <Button size="sm" variant="primary">
          REPAIRED
        </Button>
      );
  }
  return (
    <div className="mt-5 pt-3 mx-3">
      <div className="fw-bold fs-5 mb-2 text-center input-log text-dark">
        Input Log
      </div>
      <Card>
        <Card.Body>
          <div style={{ height: "85vh", overflow: "scroll" }}>
            <Table size="sm" striped bordered hover>
              <thead>
                <tr
                  className="text-center table-light"
                  style={{ top: "0", position: "sticky" }}
                >
                  <th>No</th>
                  <th>Time</th>
                  <th>Barcode Serial</th>
                  <th>Size</th>
                  <th>Production Type</th>
                  <th>Input Type</th>
                  <th>Qty</th>
                  <th>User</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {state.dataLog?.map((log, idx) => (
                  <tr key={idx} className="text-center">
                    <td>{idx + 1}</td>
                    <td>{log.ADD_TIME}</td>
                    <td>{log.BARCODE_SERIAL}</td>
                    <td>{log.ENDLINE_PLAN_SIZE}</td>
                    <td>{log.ENDLINE_PORD_TYPE}</td>
                    <td>{checkType(log.ENDLINE_OUT_TYPE)}</td>
                    <td>{log.ENDLINE_OUT_QTY}</td>
                    <td>{log.QC_NAME}</td>
                    <td>
                      {log.ENDLINE_OUT_UNDO ? (
                        <Button size="sm" variant="secondary">
                          Undo{" "}
                          <span>
                            <MdUndo />
                          </span>
                        </Button>
                      ) : (
                        <Button size="sm" variant="info">
                          Add{" "}
                          <span>
                            <MdAdd />
                          </span>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default InputLog;
