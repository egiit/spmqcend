import { useContext } from "react";
import { Modal, Row, Col, Button, Table } from "react-bootstrap";
import { QcEndlineContex } from "../provider/QcEndProvider";
import { ImUndo2 } from "react-icons/im";
import { BiTransferAlt } from "react-icons/bi";
import CheckNilai from "../partial/CheckNilai";

const MdlDetailQr = () => {
  const { state, clsMdlQrDetail, handlMdlReturn, handlMdlTfrActv } =
    useContext(QcEndlineContex);

  function openMdlTansfer(dataSelect, dataDetail) {
    if (!dataSelect || !dataDetail) return;

    const dataJoin = {
      ...dataDetail,
      ...dataSelect,
      BAL_TRANSFER:
        CheckNilai(dataDetail.GOOD) - CheckNilai(dataSelect.TRANSFER_QTY),
      BAL_SCHEDULE:
        CheckNilai(dataDetail.ORDER_QTY) - CheckNilai(dataDetail.GOOD),
    };
    clsMdlQrDetail();
    handlMdlTfrActv(dataJoin);
  }
  return (
    <Modal
      show={state.mdlDetailQr}
      onHide={clsMdlQrDetail}
      className="modaltransfer"
      size="lg"
    >
      <Modal.Body>
        <Row className="mb-2">
          <Col className="text-center py-1 border-bottom">
            <h5 className="mb-0">Detail Bundle</h5>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table size="sm">
              <thead>
                <tr>
                  <th>QR</th>
                  <td>:</td>
                  <td>{state.dataQrDtlSelect?.BARCODE_SERIAL}</td>
                </tr>
                <tr>
                  <th>NO</th>
                  <td>:</td>
                  <td>{state.dataQrDtlSelect?.BUNDLE_SEQUENCE}</td>
                </tr>
                <tr>
                  <th>PO</th>
                  <td>:</td>
                  <td>{state.dataQrDtlSelect?.ORDER_REFERENCE_PO_NO}</td>
                </tr>
                <tr>
                  <th>COLOR</th>
                  <td>:</td>
                  <td>{state.dataQrDtlSelect?.ITEM_COLOR_NAME}</td>
                </tr>
                <tr>
                  <th>SEWING IN</th>
                  <td>:</td>
                  <td>{state.dataQrDtlSelect?.SCAN_DATE}</td>
                </tr>
              </thead>
            </Table>
          </Col>
          <Col sm={6}>
            <Table size="sm">
              <thead>
                <tr>
                  <th>ORDER QTY</th>
                  <td>:</td>
                  <td>{state.dataQrDetail?.ORDER_QTY}</td>
                </tr>
                <tr>
                  <th>RFT</th>
                  <td>:</td>
                  <td>{state.dataQrDetail?.RTT}</td>
                </tr>
                <tr>
                  <th>DEFECT</th>
                  <td>:</td>
                  <td>{state.dataQrDetail?.DEFECT}</td>
                </tr>
                <tr>
                  <th>REPAIRED</th>
                  <td>:</td>
                  <td>{state.dataQrDetail?.REPAIRED}</td>
                </tr>
                <tr>
                  <th>BS</th>
                  <td>:</td>
                  <td>{state.dataQrDetail?.BS}</td>
                </tr>
              </thead>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col className="d-grid gap-2">
            <Button
              variant="warning"
              disabled={state.dataQrDetail.TOTAL_CHECKED !== "0"}
              onClick={() => handlMdlReturn(state.dataQrDetail)}
            >
              <ImUndo2 size={16} /> Return
            </Button>
          </Col>
          <Col className="d-grid gap-2">
            <Button
              variant="primary"
              onClick={() =>
                openMdlTansfer(state.dataQrDtlSelect, state.dataQrDetail)
              }
            >
              <BiTransferAlt size={16} /> Transfer
            </Button>
          </Col>
        </Row>
        <Row className="mt-3 justify-content-between">
          <Col className="text-end">
            {/* <Button
              size="sm"
              variant="primary"
              className="me-2"
              onClick={() => clsMdlQrDetail()}
            >
              Cancel    
            </Button> */}
            <Button
              size="sm"
              variant="primary"
              onClick={() => clsMdlQrDetail()}
            >
              Closed
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default MdlDetailQr;
