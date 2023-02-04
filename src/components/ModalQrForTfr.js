import { useContext } from "react";
import { Modal, Row, Col, Button } from "react-bootstrap";
import { QcEndlineContex } from "../provider/QcEndProvider";

const ModalQrForTfr = () => {
  const { state, closedModalTf, handleTrfrQr } = useContext(QcEndlineContex);
  return (
    <Modal show={state.mdlTfr} onHide={closedModalTf} className="modaltransfer">
      <Modal.Body>
        <div>
          Transfer Bundle with QR SERIAL :{" "}
          <span className="fw-bold">{state.qrForTfr.BARCODE_SERIAL}</span> ?
          {/* -
          SIZE : {state.qrForTfr.ORDER_SIZE} - QTY : {state.qrForTfr.ORDER_QTY}{" "} */}
        </div>
        <Row className="mt-3 justify-content-between">
          <Col sm={4} className="text-start">
            <Button size="sm" variant="primary" onClick={() => closedModalTf()}>
              Cancel
            </Button>
          </Col>
          <Col sm={4} className="text-end">
            <Button size="sm" variant="success" onClick={() => handleTrfrQr()}>
              Yes
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ModalQrForTfr;
