import { useContext } from "react";
import { Modal, ListGroup, Row, Col } from "react-bootstrap";
import { QcEndlineContex } from "../provider/QcEndProvider";
import MainBtnQcInpt from "./compMainModal/MainBtnQcInpt";
import PartAndDefectChoice from "./compMainModal/PartAndDefectChoice";

const MainModalInput = () => {
  const { state, bdlUnslected } = useContext(QcEndlineContex);
  const bdl = state.bdlSelect;

  return (
    <Modal show={state.mdlInput} fullscreen onHide={bdlUnslected}>
      <Modal.Header closeButton className="py-1">
        <ListGroup
          className="shadow-sm"
          horizontal
          style={{ fontSize: "13px" }}
        >
          <ListGroup.Item variant="secondary" className="fw-bold">
            QC Endline Input :
          </ListGroup.Item>
          <ListGroup.Item variant="secondary">
            {bdl.BARCODE_SERIAL}
          </ListGroup.Item>
          <ListGroup.Item variant="secondary">{bdl.BUYER_CODE}</ListGroup.Item>
          <ListGroup.Item variant="secondary">{bdl.ORDER_STYLE}</ListGroup.Item>
          <ListGroup.Item variant="secondary">{bdl.ORDER_COLOR}</ListGroup.Item>
          <ListGroup.Item variant="secondary">{bdl.ORDER_SIZE}</ListGroup.Item>
        </ListGroup>
      </Modal.Header>
      <Modal.Body className="py-1">
        <Row className="main-content-input">
          <Col>
            {state.pageActive === "" ? <MainBtnQcInpt /> : null}
            {state.pageActive === "DEFECT" ? <PartAndDefectChoice /> : null}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default MainModalInput;
