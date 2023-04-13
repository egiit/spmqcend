import { useContext } from "react";
import { Modal, Row, Col, Button } from "react-bootstrap";
import { QcEndlineContex } from "../provider/QcEndProvider";

const MdlConfReturn = () => {
  const { state, closedModalRetr, handleReturn } = useContext(QcEndlineContex);
  return (
    <Modal
      show={state.mdlConfirReturn}
      onHide={closedModalRetr}
      className="modaltransfer"
    >
      <Modal.Body>
        <Row className="mb-2">
          <Col className="text-center bg-danger py-1">
            <h5 className="mb-0">Confirm Return BOX/BUNDLE</h5>
          </Col>
        </Row>
        <div className="text-center">
          Are You Sure Return Bundle :{" "}
          <span className="fw-bold">{state.bdlForRetrun.BARCODE_SERIAL}</span> ?
          {/* -
          SIZE : {state.qrForTfr.ORDER_SIZE} - QTY : {state.qrForTfr.ORDER_QTY}{" "} */}
        </div>
        <Row className="mt-3 justify-content-between">
          <Col sm={4} className="text-start">
            <Button
              size="sm"
              variant="primary"
              onClick={() => closedModalRetr()}
            >
              Cancel
            </Button>
          </Col>
          <Col sm={4} className="text-end">
            <Button size="sm" variant="warning" onClick={() => handleReturn()}>
              Yes
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default MdlConfReturn;
