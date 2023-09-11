import { useContext } from "react";
import {
  Modal,
  Row,
  Col,
  Button,
  Table,
  // InputGroup,
  // Form,
} from "react-bootstrap";
import { QcEndlineContex } from "../provider/QcEndProvider";
import { useState } from "react";
// import { flash } from "react-universal-flash";
import { IoMdDoneAll } from "react-icons/io";

const ModalQrForTfr = () => {
  const templateQr = {
    BARCODE_SERIAL: "",
    BARCODE_MAIN: "",
    BARCODE_SEQ: 0,
    NEW_QTY: 0,
  };
  const {
    state,
    closedModalTf,
    handleTrfrQr,
    handleSplitAndTfr,
    handleTrfrQrSplit,
  } = useContext(QcEndlineContex);
  const [qtySplit, setQtySplit] = useState([templateQr]);
  const qr = state.qrForTfr;

  //handle new split
  function handleSplit() {
    const newSplit = [...Array(2)].map((seq, idx) => ({
      ...qr,
      BARCODE_SERIAL: `${qr.BARCODE_SERIAL}-${idx + 1}`,
      BARCODE_MAIN: qr.BARCODE_SERIAL,
      BARCODE_SEQ: idx + 1,
      NEW_QTY: idx === 0 ? qr.GOOD : qr.BAL_SCHEDULE,
    }));
    setQtySplit(newSplit);
  }

  function checkGood(data) {
    if (!data) return false;
    if (data.COUNT_SPLIT) return "splited";
    if (data.COUNT_SPLIT === null && parseInt(data.BAL_SCHEDULE) !== 0)
      return "newsplit";
    if (parseInt(data.BAL_SCHEDULE) === 0) return "complete";
  }

  // //for add or min split
  // function addOrMinSplit(act) {
  //   if (act === "-") {
  //     const newQty = qtySplit - 1;
  //     if (newQty < 2) return flash("Min 2", 2000, "danger");
  //     return setQtySplit(newQty);
  //   }

  //   if (act === "+") {
  //     const newQty = qtySplit + 1;
  //     if (newQty > 4) return flash("Max 4", 2000, "danger");
  //     return setQtySplit(newQty);
  //   }
  // }

  return (
    <Modal
      size="lg"
      show={state.mdlTfr}
      onHide={closedModalTf}
      className="modaltransfer"
    >
      <Modal.Body>
        {checkGood(state.qrForTfr) === "newsplit" ? (
          <div>
            <div className="bg-warning bg-opacity-50 rounded px-2 py-1">
              Total GOOD QTY belum sesuai BOX QTY, lakukan QR Split jika ingin
              transfer sesuai GOOD QTY saat ini!
            </div>
            <Table>
              <thead>
                <tr>
                  <th>QR SERIAL</th>
                  <th className="text-center">BOX QTY</th>
                  <th className="text-center">GOOD QTY</th>
                  <th className="text-center">BALANCE</th>
                  <th className="text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{qr.BARCODE_SERIAL}</td>
                  <td className="text-center">{qr.ORDER_QTY}</td>
                  <td className="text-center">{qr.GOOD}</td>
                  <td className="text-center">{qr.BAL_SCHEDULE}</td>
                  <td className="text-center">
                    <Button size="sm" variant="secondary" onClick={handleSplit}>
                      QR Split
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
            {qtySplit.length > 1 ? (
              <>
                {/* <Row>
                  <Col sm={4}>
                    <InputGroup className="mb-3">
                      <InputGroup.Text>Split To :</InputGroup.Text>
                      <Button
                        variant="secondary"
                        id="button-addon1"
                        disabled={qtySplit === 2}
                        onClick={() => addOrMinSplit("-")}
                      >
                        -
                      </Button>
                      <Form.Control
                        aria-label="split"
                        // defaultValue={qtySplit}
                        onChange={addOrMinSplit}
                        value={qtySplit.length}
                        className="text-center"
                      />
                      <Button
                        variant="secondary"
                        id="button-addon2"
                        onClick={() => addOrMinSplit("+")}
                        disabled={qtySplit === 4}
                      >
                        +
                      </Button>
                    </InputGroup>
                  </Col>
                </Row> */}
                <Row>
                  <Col>
                    <div className="text-center fw-bold border-bottom bg-primary bg-opacity-50">
                      QR Split List
                    </div>
                    <Table>
                      <thead>
                        <tr className="">
                          <th>New QR SERIAL</th>
                          <th className="text-center">Sequance</th>
                          <th className="text-center">Qty</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {qtySplit.map((seq, idx) => (
                          <tr key={idx}>
                            <td>{seq.BARCODE_SERIAL}</td>
                            <td className="text-center">{seq.BARCODE_SEQ}</td>
                            <td className="text-center">{seq.NEW_QTY}</td>
                            <td className="text-center">
                              {idx === 0 ? (
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={() => handleSplitAndTfr(qtySplit)}
                                >
                                  Confirm & Transfer
                                </Button>
                              ) : null}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </>
            ) : null}
          </div>
        ) : null}
        {checkGood(state.qrForTfr) === "complete" ? (
          <div>
            Anda yakin akan mentransfer BOX{" "}
            <span className="fw-bold">No.{qr.BUNDLE_SEQUENCE}</span> dengen QR
            Serial <span className="fw-bold">{qr.BARCODE_SERIAL}</span> ?
          </div>
        ) : null}
        {checkGood(state.qrForTfr) === "splited" ? (
          <div>
            <div className="text-center fw-bold border-bottom bg-primary bg-opacity-50">
              MAIN QR
            </div>
            <Table>
              <thead>
                <tr>
                  <th>QR SERIAL</th>
                  <th className="text-center">BOX QTY</th>
                  <th className="text-center">GOOD QTY</th>
                  <th className="text-center">BALANCE</th>
                  <th className="text-center">TRANSFER QTY</th>
                  <th className="text-center">BALANCE TRANSFER</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{qr.BARCODE_SERIAL}</td>
                  <td className="text-center">{qr.ORDER_QTY}</td>
                  <td className="text-center">{qr.GOOD}</td>
                  <td className="text-center">{qr.BAL_SCHEDULE}</td>
                  <td className="text-center">{qr.TRANSFER_QTY}</td>
                  <td className="text-center">{qr.BAL_TRANSFER}</td>
                </tr>
              </tbody>
            </Table>
            <div className="text-center fw-bold border-bottom bg-primary bg-opacity-50">
              QR Split List
            </div>
            <Table>
              <thead>
                <tr className="">
                  <th>QR SERIAL SPLITED</th>
                  <th className="text-center">Sequance</th>
                  <th className="text-center">Qty</th>
                  <th className="text-center">Transfer Status</th>
                </tr>
              </thead>
              <tbody>
                {state.qrSplitList?.map((seq, idx) => (
                  <tr key={idx}>
                    <td>{seq.BARCODE_SERIAL}</td>
                    <td className="text-center">{seq.BARCODE_SEQ}</td>
                    <td className="text-center">{seq.NEW_QTY}</td>
                    <td className="text-center">
                      {seq.TRANSFER_QTY === seq.NEW_QTY ? (
                        <IoMdDoneAll size={20} color="#00a814" />
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={parseInt(qr.BAL_TRANSFER) !== seq.NEW_QTY}
                          onClick={() => handleTrfrQrSplit(seq, qr)}
                        >
                          Transfer
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : null}

        <Row className="mt-3 justify-content-between">
          <Col sm={4} className="text-start">
            <Button size="sm" variant="primary" onClick={() => closedModalTf()}>
              Cancel
            </Button>
          </Col>
          <Col sm={4} className="text-end">
            {checkGood(state.qrForTfr) === "complete" ? (
              <Button
                size="sm"
                variant="success"
                onClick={() => handleTrfrQr(state.qrForTfr)}
              >
                Ya Transfer
              </Button>
            ) : null}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ModalQrForTfr;
