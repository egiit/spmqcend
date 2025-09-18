import React, { useContext, useState, useRef, useEffect, memo } from "react";
import {
  Modal,
  Button,
  Row,
  Col,
  Table,
  InputGroup,
  Form,
} from "react-bootstrap";
import { QcEndlineContex } from "../provider/QcEndProvider";
import { FcNext, FcPrevious } from "react-icons/fc";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { IoMdRemoveCircleOutline, IoMdCreate } from "react-icons/io";
import { flash } from "react-universal-flash";
import axios from "../axios/axios";

const MdlMeasurement = ({ handleClose }) => {
  const { state, userId, siteName, lineName, shift } =
    useContext(QcEndlineContex);
  const [idxInput, setIdxInput] = useState(0);
  const [seq, setSeq] = useState(1);
  const [dataTemp, setDataTemp] = useState([]);
  const [dataPostMes, setDataPostMes] = useState([]);
  const [opsiSeq, setOpsiSeq] = useState(false);
  const [modalInput, setMdalInput] = useState(false);
  const inputShow = useRef(null);
  const listBtn = {
    INCH: ["1/16", "1/8", "1/4", "1/2", "1/3", "3/16", "3/8", "3/4", "5/16", "7/16", "9/16", "5/8", "11/16", "13/16", "7/8", "15/16"],
    CM: [
      "0.0625",
      "0.1",
      "0.125",
      "0.1875",
      "0.2",
      "0.25",
      "0.3",
      "0.3125",
      "0.375",
      "0.4",
      "0.4375",
      "0.5",
      "0.5625",
      "0.6",
      "0.625",
      "0.6875",
      "0.7",
      "0.75",
      "0.8",
      "0.8125",
      "0.875",
      "0.9",
      "0.9375",
      "1.00",
      "1.01",
      "1.02",
      "1.03",
      "1.04",
      "1.05",
      "1.06",
      "1.07",
      "1.08",
      "1.09",
    ],
  };

  function activeInput() {
    if (seq === 6) return flash(`Sudah 5 urutan `, 2500, "warning");
    // const mdl = document.getElementById("mdlInpt");
    // const cntn = document.getElementById("contentMdl");
    // mdl.classList.toggle("show");
    // cntn.classList.toggle("show");
    setMdalInput(modalInput ? false : true);
  }

  //buton prev
  function nextIdx() {
    if (idxInput + 1 < state.measurSpec.length) {
      const newIdx = idxInput + 1;
      if (dataTemp[idxInput]) {
        if (
          dataTemp[idxInput].MES_VALUE.toString() !== "0" &&
          !dataTemp[idxInput].MES_CAT
        ) {
          return flash("Mohon tentukan plus atau minus", 2500, "warning");
        }
      }
      setIdxInput(newIdx);
      checkIdx(newIdx);
    } else {
      setIdxInput(0);
      checkIdx(0);
    }
  }

  //button next
  function prevIdx() {
    if (idxInput > 0) {
      const newIdx = idxInput - 1;
      if (dataTemp[idxInput]) {
        if (
          dataTemp[idxInput].MES_VALUE.toString() !== "0" &&
          !dataTemp[idxInput].MES_CAT
        ) {
          return flash("Mohon tentukan plus atau minus", 2500, "warning");
        }
      }
      setIdxInput(newIdx);
      checkIdx(newIdx);
    } else {
      setIdxInput(state.measurSpec.length - 1);
      checkIdx(state.measurSpec.length - 1);
    }
  }

  function cancleInpt() {
    setIdxInput(0);
    activeInput();
    setDataTemp([]);
    refreshSeq();
  }

  function handleChange(e, idx, spec) {
    e.preventDefault();
    const regex = /^[0-9\s/.]{0,6}$/;

    const { value } = e.target;
    if (spec.MES_UOM === "INCH" && !regex.test(value)) {
      // memvalidasi input
      return flash(
        `Angka dan karater yang diperbolehkan hanya 0-9 dan "/"`,
        2600,
        "warning"
      );
    }
    handleInptMes(value, idx, spec);
    passCheckVal(false);
  }

  function handleInptMes(value, idx, spec) {
    const newval = {
      ...spec,
      BARCODE_SERIAL: state.qrMeasSelected.BARCODE_SERIAL,
      MES_VALUE: value,
      MES_IDX: idx,
      SCHD_ID: state.qrMeasSelected.ACT_SCHD_ID,
      MES_SEQ: seq,
      SITE_NAME: siteName,
      LINE_NAME: lineName,
      MES_CAT: value === 0 ? "" : "+",
      SHIFT: shift,
      ADD_ID: userId,
    };
    let newtemp = [...dataTemp];
    const findArrIdx = dataTemp.findIndex(
      (data) => data.POM_ID === spec.POM_ID && data.MES_SEQ === seq
    );

    if (dataTemp.length === 0) return setDataTemp([newval]);
    if (findArrIdx < 0) {
      newtemp.push(newval);
      return setDataTemp(newtemp);
    } else {
      if (value === "") {
        const delt = newtemp.filter((dt, i) => i !== findArrIdx);
        return setDataTemp(delt);
      }

      newtemp[findArrIdx].MES_VALUE = value;
      return setDataTemp(newtemp);
    }
  }

  async function handlePass(e, idx, spec) {
    const { checked } = e.target;

    if (checked) {
      handleInptMes(0, idx, spec);
    }
  }

  async function handleSave() {
    if (dataTemp.length === 0)
      return flash("Tidak ada data measurement untuk di post", 2500, "danger");
    const dataWitHNull = dataTemp.filter((dt) => dt.MES_VALUE !== "");

    await axios
      .post(`/measurement/endline/`, dataWitHNull)
      .then((res) => {
        if (res.status === 200) {
          flash("Berhasil menyimpan data", 2500, "success");
          //   const newDataPost = [...dataPostMes, dataTemp];
          //   const newSeq = seq + 1 < 6 ? seq + 1 : 5;
          //   setDataPostMes(newDataPost);
          //   setSeq(newSeq);
          getDataMeasOut(state.qrMeasSelected, siteName, lineName);
          setDataTemp([]);
          cancleInpt();
          setOpsiSeq(false);
        }
      })
      .catch((err) => flash(err.message, 3000, "danger"));
  }

  function passCheckVal(val) {
    const pasCheck = document.getElementById("passCheck");
    pasCheck.checked = val;
  }

  function handleBtnCat(cat, idx, spec) {
    let newtemp = [...dataTemp];
    const findArrIdx = dataTemp.findIndex(
      (data) => data.POM_ID === spec.POM_ID && data.MES_SEQ === seq
    );
    if (findArrIdx < 0 || dataTemp.length === 0) {
      newtemp.push({
        ...spec,
        MES_IDX: idx,
        MES_CAT: cat,
        MES_VALUE: "",
        BARCODE_SERIAL: state.qrMeasSelected.BARCODE_SERIAL,
        SCHD_ID: state.qrMeasSelected.ACT_SCHD_ID,
        MES_SEQ: seq,
        SITE_NAME: siteName,
        LINE_NAME: lineName,
        ADD_ID: userId,
      });
      setDataTemp(newtemp);
    } else {
      newtemp[findArrIdx].MES_CAT = cat;
      return setDataTemp(newtemp);
    }
  }

  function findActvBtn(cat, index) {
    if (dataTemp.length === 0) return false;
    if (dataTemp[index]?.MES_CAT === cat) return true;
    return false;
  }

  // useEffect(() => {
  //   if (modalInput) {
  //     if (dataTemp.length > 0 && dataTemp[idxInput]) {
  //       inputShow.current.focus();
  //       if (dataTemp[idxInput].MES_VALUE.toString() === "0") {
  //         inputShow.current.value = dataTemp[idxInput].MES_VALUE;
  //         passCheckVal(true);
  //       } else {
  //         inputShow.current.value = "";
  //         passCheckVal(false);
  //       }
  //     } else {
  //       inputShow.current.value = "";
  //       passCheckVal(false);
  //     }
  //   }
  // }, [idxInput, dataTemp, modalInput]);

  function checkIdx(idx) {
    if (dataTemp.length > 0 && dataTemp[idx]) {
      inputShow.current.focus();
      if (dataTemp[idx].MES_VALUE.toString() === "0") {
        inputShow.current.value = dataTemp[idx].MES_VALUE;
        passCheckVal(true);
      } else {
        inputShow.current.value = "";
        passCheckVal(false);
      }
    } else {
      inputShow.current.value = "";
      passCheckVal(false);
    }
  }

  async function getDataMeasOut(dataBundleSel, siteName, lineName) {
    const { BARCODE_SERIAL, ORDER_SIZE } = dataBundleSel;
    const unixSize = encodeURIComponent(ORDER_SIZE);
    await axios
      .get(
        `/measurement/endline-out/${BARCODE_SERIAL}/${siteName}/${lineName}/${unixSize}`
      )
      .then((res) => {
        if (res.status === 200) {
          setDataPostMes(res.data.data);
          const dataOutMes = res.data.data;
          if (dataOutMes.length > 0) {
            const listSeq = [...new Set(dataOutMes.map((dm) => dm.MES_SEQ))];
            let arrCom = [1, 2, 3, 4, 5];
            let emptySeq = arrCom.filter(function (elemen) {
              return !listSeq.includes(elemen);
            });

            // const neqSeq = listSeq.length + 1 < 7 ? listSeq.length + 1 : 5;
            const neqSeq = emptySeq.length > 0 ? emptySeq[0] : 6;

            setSeq(neqSeq);
          }
        }
      })
      .catch((err) => flash(err.message, 3000, "danger"));
  }

  useEffect(() => {
    getDataMeasOut(state.qrMeasSelected, siteName, lineName);
  }, [state.qrMeasSelected, siteName, lineName]);

  function findOutputMes(data, pomId, seq) {
    if (data.length < 1) return "";
    const dataBySeq = data.filter(
      (dtMes) => dtMes.MES_SEQ === seq && dtMes.POM_ID === pomId
    );
    if (dataBySeq.length < 1) return "";
    if (dataBySeq[0].MES_VALUE === "0" || dataBySeq[0].MES_VALUE === "")
      return dataBySeq[0].MES_VALUE;
    return dataBySeq[0].MES_CAT === "-"
      ? `-${dataBySeq[0].MES_VALUE}`
      : `+${dataBySeq[0].MES_VALUE}`;
  }

  function findVal(data, pomId, seq) {
    if (data.length < 1) return "";
    const dataBySeq = data.filter(
      (dtMes) => dtMes.MES_SEQ === seq && dtMes.POM_ID === pomId
    );
    if (dataBySeq.length < 1) return "";
    return dataBySeq[0].MES_VALUE;
  }

  function seqOpsAction(sq) {
    const checkDataPost = dataPostMes.filter((dt) => dt.MES_SEQ === sq);
    if (checkDataPost.length < 1)
      return flash(`Tidak ada data urutan ke ${sq}`, 2500, "warning");

    setOpsiSeq(sq);
  }

  function editSeq(sq) {
    const checkDataPost = dataPostMes.filter((dt) => dt.MES_SEQ === sq);
    if (checkDataPost.length < 1)
      return flash(`Tidak ada data urutan ke ${sq}`, 2500, "warning");

    setSeq(sq);
    setDataTemp(checkDataPost);
    setMdalInput(true);
  }

  function cancelOpsi() {
    refreshSeq();
    setOpsiSeq(false);
  }

  function refreshSeq() {
    if (dataPostMes.length > 0) {
      const listSeq = [...new Set(dataPostMes.map((dm) => dm.MES_SEQ))];
      let arrCom = [1, 2, 3, 4, 5];
      let emptySeq = arrCom.filter(function (elemen) {
        return !listSeq.includes(elemen);
      });

      // const neqSeq = listSeq.length + 1 < 7 ? listSeq.length + 1 : 5;
      const neqSeq = emptySeq.length > 0 ? emptySeq[0] : 6;

      setSeq(neqSeq);
    }
  }

  async function deleteSeqData(sq) {
    const datas = dataPostMes.filter((dt) => dt.MES_SEQ === sq);
    if (datas.length < 1)
      return flash(`Tidak ada data urutan ke ${sq}`, 2500, "warning");

    await axios
      .delete(`/measurement/endline-out/${datas[0].BARCODE_SERIAL}/${sq}`)
      .then((res) => {
        if (res.status === 200) {
          getDataMeasOut(state.qrMeasSelected, siteName, lineName);
          cancelOpsi();
          flash(res.data.message, 2500, "success");
        }
      })
      .catch((err) => flash(err.message, 2500, "danger"));
  }

  let uom = state.measurSpec[0].MES_UOM;

  function selectButon(value) {
    const spec = state.measurSpec[idxInput];
    handleInptMes(value, idxInput, spec);
  }

  return (
    <Modal
      //   size="xl"
      show={state.mdlMeas}
      onHide={handleClose}
      fullscreen
      className="mainmodal"
    >
      <Modal.Body>
        {!modalInput ? (
          <div style={{ height: "90vh" }}>
            <Row className="mb-2">
              <Col>
                <div className="bg-ylw  shadow-sm py-1">
                  <h4 className="text-center mb-0">MEASUREMENT</h4>
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={2}>
                <InputGroup size="sm" className="mb-3">
                  <InputGroup.Text id="no-box" className="fw-bold">
                    NO BOX
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="nobox"
                    aria-label="nobox"
                    aria-describedby="no-box"
                    disabled
                    defaultValue={state.qrMeasSelected?.BUNDLE_SEQUENCE}
                  />
                </InputGroup>
              </Col>
              <Col sm={3}>
                <InputGroup size="sm" className="mb-3">
                  <InputGroup.Text id="qr" className="fw-bold">
                    QR SERIAL
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="qr"
                    aria-label="qr"
                    aria-describedby="qr"
                    disabled
                    defaultValue={state.qrMeasSelected?.BARCODE_SERIAL}
                  />
                </InputGroup>
              </Col>
              <Col sm={2}>
                <InputGroup size="sm" className="mb-3">
                  <InputGroup.Text id="sizes" className="fw-bold">
                    SIZE
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="sizes"
                    aria-label="sizes"
                    aria-describedby="sizes"
                    disabled
                    defaultValue={state.qrMeasSelected?.ORDER_SIZE}
                  />
                </InputGroup>
              </Col>
              <Col sm={3} className="ms-auto text-end">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => activeInput()}
                  disabled={state.measurSpec?.length === 0 || seq === 6}
                >
                  ADD : #{seq > 5 ? 5 : seq}
                </Button>
              </Col>
            </Row>
            {opsiSeq ? (
              <Row className="justify-content-end mb-2">
                <Col sm={3} className="text-end fw-bold">
                  Acion for Sequance {opsiSeq} :
                </Col>
                <Col sm={3} className="text-end">
                  <Button
                    size="sm"
                    variant="outline-danger"
                    className="me-3"
                    onClick={() => deleteSeqData(opsiSeq)}
                  >
                    Delete <IoMdRemoveCircleOutline size={15} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-warning"
                    className="me-3"
                    onClick={() => editSeq(opsiSeq)}
                  >
                    Edit <IoMdCreate size={15} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    className="me-3"
                    onClick={() => cancelOpsi()}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            ) : null}
            <Row className="mb-3">
              <Col>
                <div className="table-responsive" style={{ height: "83vh" }}>
                  <Table size="sm" bordered hover>
                    <thead>
                      <tr
                        className="text-center"
                        style={{ position: "sticky", top: 0, zIndex: 1 }}
                      >
                        <th className="bg-secondary text-light">NO</th>
                        <th className="bg-secondary text-light">DESCRIPTION</th>
                        <th className="bg-secondary text-light">SPEC</th>
                        <th className="bg-secondary text-light">TOL-</th>
                        <th className="bg-secondary text-light">TOL+</th>
                        <th className="bg-seq" onClick={() => seqOpsAction(1)}>
                          1
                        </th>
                        <th className="bg-seq" onClick={() => seqOpsAction(2)}>
                          2
                        </th>
                        <th className="bg-seq" onClick={() => seqOpsAction(3)}>
                          3
                        </th>
                        <th className="bg-seq" onClick={() => seqOpsAction(4)}>
                          4
                        </th>
                        <th className="bg-seq" onClick={() => seqOpsAction(5)}>
                          5
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.measurSpec.length ? (
                        state.measurSpec?.map((spec, i) => (
                          <tr key={i} className="text-center">
                            <td>{i + 1}</td>
                            <td className="text-start">{spec.POM_DESC}</td>
                            <td>{spec.SPEC}</td>
                            <td>{spec.POM_PLUS}</td>
                            <td>{spec.POM_MIN}</td>
                            <td>
                              {findOutputMes(dataPostMes, spec.POM_ID, 1)}
                            </td>
                            <td>
                              {findOutputMes(dataPostMes, spec.POM_ID, 2)}
                            </td>
                            <td>
                              {findOutputMes(dataPostMes, spec.POM_ID, 3)}
                            </td>
                            <td>
                              {findOutputMes(dataPostMes, spec.POM_ID, 4)}
                            </td>
                            <td>
                              {findOutputMes(dataPostMes, spec.POM_ID, 5)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="fst-italic text-center" colSpan={10}>
                            No Data SPEC Please Call QC ADM
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
            <Row className="justify-content-end">
              <Col sm={1} className="text-end">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleClose()}
                >
                  Close
                </Button>
              </Col>
            </Row>
          </div>
        ) : (
          <div>
            <Row className="justify-content-center">
              <Col sm={1} className="text-center bg-primary rounded py-1">
                <h4 className="text-light mb-0">#{seq}</h4>
              </Col>
            </Row>
            <Row className="pt-1">
              <Col sm={1}>
                <Button
                  className="mt-4"
                  variant="light"
                  disabled={idxInput === 0}
                  onClick={() => prevIdx()}
                >
                  <FcPrevious size={25} />
                </Button>
              </Col>
              <Col sm={10} className="px-0">
                <Table bordered>
                  <thead>
                    <tr className="text-center">
                      <th className="bg-secondary text-light">NO</th>
                      <th className="bg-secondary text-light">DESCRIPTION</th>
                      <th className="bg-secondary text-light">SPEC</th>
                      <th className="bg-secondary text-light">TOL-</th>
                      <th className="bg-secondary text-light">TOL+</th>
                      <th className="bg-secondary bg-opacity-50" colSpan={4}>
                        INPUT
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.measurSpec
                      ?.filter((spc, idx) => idx === idxInput)
                      .map((spec, i) => (
                        <tr key={i}>
                          <td className="text-center">{idxInput + 1}</td>
                          <td>{spec.POM_DESC}</td>
                          <td>{spec.SPEC}</td>
                          <td>{spec.POM_PLUS}</td>
                          <td>{spec.POM_MIN}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="outline-warning"
                              onClick={() => handleBtnCat("-", idxInput, spec)}
                              active={findActvBtn("-", idxInput)}
                            >
                              <AiOutlineMinus size={13} />
                            </Button>
                          </td>
                          <td>
                            <Button
                              size="sm"
                              variant="outline-warning"
                              onClick={() => handleBtnCat("+", idxInput, spec)}
                              active={findActvBtn("+", idxInput)}
                            >
                              <AiOutlinePlus size={13} />
                            </Button>
                          </td>
                          <td>
                            <FormInputByUom
                              handleChange={handleChange}
                              idxInput={idxInput}
                              spec={spec}
                              inputShow={inputShow}
                              dataTemp={dataTemp}
                              findVal={findVal}
                              seq={seq}
                            />
                          </td>
                          <td>
                            <Form.Check
                              className="mt-2"
                              type="checkbox"
                              id="passCheck"
                              label={`PASS`}
                              onChange={(e) => handlePass(e, idxInput, spec)}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Col>
              <Col sm={1}>
                <Button
                  className="mt-4"
                  variant="light"
                  onClick={() => nextIdx()}
                >
                  <FcNext size={25} />
                </Button>
              </Col>
            </Row>
            <Row>
              <Col className="mx-4 mt-2">
                <div className="text-center fw-bold bg-dark bg-opacity-25 mb-1">
                  Tombol Pintas {uom}
                </div>
                {listBtn[uom].map((lbtn, i) => (
                  <Button
                    key={i}
                    size="sm"
                    variant="primary"
                    onClick={() => selectButon(lbtn)}
                    className="m-2"
                  >
                    {lbtn}
                  </Button>
                ))}
              </Col>
            </Row>
            <Row className="justify-content-end mt-3 pe-5 border-2 border-top pt-2">
              <Col sm={3} className="text-end ">
                <Button
                  className="me-2"
                  size="sm"
                  variant="primary"
                  onClick={() => cancleInpt()}
                >
                  Canacel
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleSave()}
                  disabled={dataTemp.length === 0}
                >
                  Save
                </Button>
              </Col>
            </Row>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

const FormInputByUom = memo(
  ({ handleChange, idxInput, spec, inputShow, dataTemp, findVal, seq }) => {
    if (spec.MES_UOM === "INCH") {
      return (
        <Form.Control
          ref={inputShow}
          onChange={(e) => handleChange(e, idxInput, spec)}
          value={findVal(dataTemp, spec.POM_ID, seq)}
          type="text"
          placeholder="1/9"
        />
      );
    }
    if (spec.MES_UOM === "CM") {
      return (
        <Form.Control
          ref={inputShow}
          onChange={(e) => handleChange(e, idxInput, spec)}
          value={findVal(dataTemp, spec.POM_ID, seq)}
          type="number"
          placeholder="0.5"
        />
      );
    }
  }
);

export default MdlMeasurement;
