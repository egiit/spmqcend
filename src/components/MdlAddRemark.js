import React, { useState } from "react";
import { Modal, Button, Row, Col, Table, Form } from "react-bootstrap";
import { getTimeFromMins } from "../partial/TimeManipulate";

const MdlAddRemark = ({
  show,
  handleClose,
  plan,
  typeProd,
  handleAddRemark,
}) => {
  const [remaksText, setRemaksText] = useState("");

  function handleRemaksText(e) {
    const { value } = e.target;
    setRemaksText(value);
  }

  //find devault value
  function findDefvalue(typeProd, plan) {
    if (typeProd === "normal") return plan.NORMAL_REMARK;
    if (typeProd === "ot") return plan.OT_REMARK;
    if (typeProd === "extOt") return plan.OT_X_REMARK;
  }

  return (
    <Modal
      size="xl"
      show={show}
      onHide={handleClose}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Body>
        <div
          className={`${
            typeProd === "normal" ? "bg-primary" : "bg-warning"
          } fw-bold text-center`}
        >
          Add Remark
        </div>
        <Row>
          <Col>
            <Table size="sm" striped bordered responsive hover>
              <thead>
                <tr className="text-center">
                  <th>Buyer</th>
                  <th>PO Ref</th>
                  <th>Style</th>
                  <th>Color</th>
                  <th>WH</th>
                  <th>MP</th>
                  <th>Target</th>
                  <th>Output</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{plan.CUSTOMER_NAME}</td>
                  <td>{plan.ORDER_REFERENCE_PO_NO}</td>
                  <td>{plan.ORDER_STYLE_DESCRIPTION}</td>
                  <td>{plan.ITEM_COLOR_NAME}</td>
                  {typeProd === "normal" ? (
                    <React.Fragment>
                      <td>{getTimeFromMins(plan.PLAN_WH)}</td>
                      <td>{plan.ACT_MP ? plan.ACT_MP : plan.PLAN_MP}</td>
                      <td>
                        {plan.ACT_TARGET ? plan.ACT_TARGET : plan.PLAN_TARGET}
                      </td>
                      <td>{plan.NORMAL_OUTPUT}</td>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <td>{getTimeFromMins(plan.PLAN_WH_OT)}</td>
                      <td>
                        {plan.ACT_TARGET_OT
                          ? plan.ACT_TARGET_OT
                          : plan.PLAN_TARGET_OT}
                      </td>
                      <td>{plan.NORMAL_OUTPUT_OT}</td>
                      <td>
                        {plan.ACT_TARGET_OT
                          ? plan.ACT_TARGET_OT - plan.OT_OUTPUT
                          : 0}
                      </td>
                    </React.Fragment>
                  )}
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col>
            <Form.Control
              as="textarea"
              aria-label="Remark"
              onChange={handleRemaksText}
              defaultValue={findDefvalue(typeProd, plan)}
            />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => handleAddRemark(remaksText, typeProd)}
        >
          Save Remark
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MdlAddRemark;
