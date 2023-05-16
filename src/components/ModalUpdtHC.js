import React, { useState, useEffect, useContext } from "react";
import axios from "../axios/axios";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { flash } from "react-universal-flash";
import { QcEndlineContex } from "../provider/QcEndProvider";

const ModalUpdtHC = ({ handleClose }) => {
  const { state, refreshPlanning } = useContext(QcEndlineContex);
  const { mdlHC, dataHCselect } = state;

  const [hc, setHc] = useState("0");
  const [maxhc, setmaxhc] = useState(35);

  //handle input Manpower
  const handleMpinput = (e) => {
    e.preventDefault();
    const { value } = e.target;
    if (value > maxhc) return setHc(maxhc);
    if (value < 0) return setHc(0);
    setHc(value);
  };

  const handlePostMp = async (data, mpCount) => {
    let newData = { ...data };
    if (data.type === "ot") {
      newData.ACT_MP_OT = mpCount;
    }
    if (data.type === "normal") {
      newData.ACT_MP = mpCount;
    }
    if (data.type === "extOt") {
      newData.ACT_MP_X_OT = mpCount;
    }

    await axios
      .post("/qc/endline/act-manpower", newData)
      .then((res) => {
        if (res.status === 200) {
          refreshPlanning();
          flash(res.data.message, 2000, "success");
          handleClose();
        }
      })
      .catch((err) => flash(err.message, 2000, "danger"));
  };

  useEffect(() => {
    if (dataHCselect.type === "normal") {
      if (dataHCselect.ACT_MP !== null) {
        setHc(dataHCselect.ACT_MP);
      } else {
        setHc(dataHCselect.PLAN_MP);
      }
      return setmaxhc(dataHCselect.PLAN_MP + 10);
    }
    if (dataHCselect.type === "ot") {
      if (dataHCselect.ACT_MP_OT !== null) {
        setHc(dataHCselect.ACT_MP_OT);
      } else {
        setHc(dataHCselect.PLAN_MP_OT);
      }
      return setmaxhc(dataHCselect.PLAN_MP_OT + 10);
    }
    if (dataHCselect.type === "extOt") {
      if (dataHCselect.ACT_MP_X_OT !== null) {
        setHc(dataHCselect.ACT_MP_X_OT);
      } else {
        setHc(dataHCselect.PLAN_MP_X_OT);
      }
      return setmaxhc(dataHCselect.PLAN_MP_X_OT + 10);
    }
  }, [dataHCselect]);

  return (
    <div>
      <Modal
        show={mdlHC}
        backdrop="static"
        keyboard={false}
        centered
        onHide={handleClose}
      >
        <Modal.Body>
          <Row>
            <Col className="fw-bold mb-2">Actual Manpower :</Col>
          </Row>
          <Row>
            <Col className="text-center">
              <Button size="sm" variant="secondary">
                {dataHCselect.CUSTOMER_NAME}
              </Button>
              <Button
                size="sm"
                variant={dataHCselect.type !== "normal" ? "warning" : "primary"}
              >
                {dataHCselect.ORDER_STYLE_DESCRIPTION}
              </Button>
            </Col>
          </Row>
          <Row
            className={`justify-content-center mb-2 ${
              dataHCselect.type !== "normal" ? "bg-warning" : "bg-primary"
            } rounded m-2 py-1`}
          >
            <Col sm={3}>
              <div>
                <Form.Control
                  className="text-center"
                  type="number"
                  value={hc}
                  min="0"
                  max={maxhc}
                  onChange={handleMpinput}
                />
              </div>
            </Col>
          </Row>
          <input
            type="range"
            className="form-range"
            value={hc}
            onChange={handleMpinput}
            min="0"
            max={maxhc}
            step="1"
            // step="0.5"
            id="customRange3"
          ></input>
        </Modal.Body>
        <Modal.Footer>
          <Button size="sm" variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => handlePostMp(dataHCselect, hc)}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalUpdtHC;
