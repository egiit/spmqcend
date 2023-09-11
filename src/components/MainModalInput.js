import { useContext } from "react";
import { Modal, ListGroup, Row, Col } from "react-bootstrap";
import { QcEndlineContex } from "../provider/QcEndProvider";
import ForRepairedPage from "./compMainModal/ForRepairedPage";
import MainBtnQcInpt from "./compMainModal/MainBtnQcInpt";
import PartAndDefectChoice from "./compMainModal/PartAndDefectChoice";

const MainModalInput = () => {
  const { state, planSizeUnSelected } = useContext(QcEndlineContex);
  const bdl = state.planSizeSelect;

  return (
    <Modal
      show={state.mdlInput}
      fullscreen
      onHide={planSizeUnSelected}
      className="mainmodal"
    >
      <Modal.Header className="py-1">
        <ListGroup
          className="shadow-sm"
          horizontal
          style={{ fontSize: "13px" }}
        >
          <ListGroup.Item variant="secondary" className="fw-bold">
            QC Endline Input :
          </ListGroup.Item>
          {/* <ListGroup.Item variant="secondary">
            {bdl.BARCODE_SERIAL}
          </ListGroup.Item> */}
          <ListGroup.Item variant="secondary">
            {bdl.BARCODE_SERIAL}
          </ListGroup.Item>
          <ListGroup.Item variant="secondary">{bdl.BUYER_CODE}</ListGroup.Item>
          <ListGroup.Item variant="secondary">{bdl.MO_NO}</ListGroup.Item>
          <ListGroup.Item variant="secondary">{bdl.ORDER_STYLE}</ListGroup.Item>
          <ListGroup.Item variant="secondary">{bdl.ORDER_COLOR}</ListGroup.Item>
          <ListGroup.Item variant="secondary">{bdl.ORDER_SIZE}</ListGroup.Item>
        </ListGroup>
      </Modal.Header>
      <Modal.Body className="py-1">
        <Row className="main-content-input">
          <Col>
            {state.pageActive === "" ? <MainBtnQcInpt /> : null}
            {state.pageActive === "DEFECT" ? (
              <PartAndDefectChoice type="DEFECT" />
            ) : null}
            {state.pageActive === "BS" ? (
              <PartAndDefectChoice type="BS" />
            ) : null}
            {state.pageActive === "REPAIRED" ? (
              <ForRepairedPage type="REPAIRED" />
            ) : null}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default MainModalInput;
