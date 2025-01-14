import React, { memo, useContext, useState } from "react";
import { Card, Button, Table, Row, Col, Form } from "react-bootstrap";
import { FaUserPlus } from "react-icons/fa";
import { IoIosArrowDown, IoMdTimer } from "react-icons/io";
import { GiCheckMark } from "react-icons/gi";
import { SlNote } from "react-icons/sl";
import { QcEndlineContex } from "../provider/QcEndProvider";
import { flash } from "react-universal-flash";
import { getTimeFromMins } from "../partial/TimeManipulate";
import TrPlanSize from "./compMainModal/TrPlanSize";
// import TrPlanSizePending from "./compMainModal/TrPlanSizePending";
import CheckNilai from "../partial/CheckNilai";

const ListPlanning = ({
  selectHc,
  handleSelPlanSize,
  viewQrList,
  openMdlRemark,
  prodType,
}) => {
  const { state } = useContext(QcEndlineContex);
  const [showLoading, setShowLoadingQty] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [querySize, setQuerySize] = useState("");

  function accordOpen(plan) {
    if (plan.ACT_MP === null && prodType === "normal")
      return flash("Mohon set Manpower terlebih dahulu!", 2000, "warning");
    if (plan.ACT_MP_OT === null && prodType === "ot")
      return flash("Mohon set Manpower terlebih dahulu!", 2000, "warning");
    if (plan.ACT_MP_X_OT === null && prodType === "extOt")
      return flash("Mohon set Manpower terlebih dahulu!", 2000, "warning");
    // return flash("Please Set Actual Manpower First!", 2000, "warning");
    const getUnixId = `${plan.SCHD_ID}${plan.SCHD_QTY}`;

    const arrow = document.getElementsByClassName(`arrow${getUnixId}`)[0];
    const rowListline = document.getElementsByClassName(
      `row-planid-${getUnixId}`
    )[0];
    arrow.classList.toggle("opened");
    rowListline.classList.toggle("opened");
  }

  function checkStatus(qty, checked) {
    if (checked !== 0) {
      if ("0" === qty) return <GiCheckMark size={20} color="#00a814" />;
      if ("0" !== qty) return <IoMdTimer size={20} color="#fcba03" />;
    }
    return null;
  }

  //function untuk input from search size
  function handleInputFilterz(e) {
    const { value } = e.target;

    setQuerySize(value);
  }
  //function untuk showloading qty 0
  function handleShowLoading(e) {
    const { checked } = e.target;
    setShowLoadingQty(checked);
  }
  //function untuk show complete status
  function handleShowComplete(e) {
    const { checked } = e.target;
    setShowComplete(checked);
  }

  //function untuk filter data size jika ada input search size
  function filterSize(data) {
    if (querySize === "") return data;
    const newData = [...data];
    return newData.filter(
      (dtz) => dtz.SIZE_CODE.toLowerCase().indexOf(querySize.toLowerCase()) > -1
    );
  }

  //function show loading 0
  function filersData(data) {
    const newData = [...data];
    if (!showLoading && !showComplete)
      return newData.filter(
        (dtz) =>
          parseInt(dtz.LOADING_QTY) !== 0 &&
          parseInt(dtz.LOADING_QTY) !== parseInt(dtz.TTL_TRANSFER)
      );
    if (showLoading && !showComplete)
      return newData.filter(
        (dtz) =>
          parseInt(dtz.LOADING_QTY) === 0 ||
          parseInt(dtz.LOADING_QTY) !== parseInt(dtz.TTL_TRANSFER)
      );
    if (!showLoading && showComplete)
      return newData.filter(
        (dtz) =>
          parseInt(dtz.LOADING_QTY) !== 0 ||
          parseInt(dtz.TRANSFER_QTY) === dtz.ORDER_QTY
      );
    if (showLoading && showComplete) return newData;
  }

  function findTarget(plan, prodType) {
    if (prodType === "normal") {
      if (plan.ACT_TARGET) return plan.ACT_TARGET;
      return plan.PLAN_TARGET;
    }
    if (prodType === "ot") {
      if (plan.ACT_TARGET_OT) return plan.ACT_TARGET_OT;
      return CheckNilai(plan.PLAN_TARGET_OT);
    }
    if (prodType === "extOt") {
      if (plan.ACT_TARGET_X_OT) return plan.ACT_TARGET_X_OT;
      return CheckNilai(plan.PLAN_TARGET_X_OT);
    }
  }

  function findOutput(plan, prodType) {
    if (prodType === "normal") return plan.NORMAL_OUTPUT;
    if (prodType === "ot") return plan.OT_OUTPUT;
    if (prodType === "extOt") return CheckNilai(plan.X_OT_OUTPUT);
  }

  function findType(prodType) {
    if (prodType === "normal") return "N";
    if (prodType === "ot") return "O";
    if (prodType === "extOt") return "XO";
  }
  return (
    <>
      {state.dataDailyPlan
        ? state.dataDailyPlan.map((plan, i) => (
            <Card className="shadow border-0 mt-1" key={i}>
              <Card.Body className="py-1 px-2 card-planing rounded">
                <Table responsive className="tbl-qc-planning">
                  <tbody>
                    <tr className="align-middle headerplan">
                      <td>Buyer</td>
                      <td>PO Ref</td>
                      <td>Style</td>
                      {/* <td>Dec</td> */}
                      <td>Color</td>
                      <td>WH</td>
                      <td>MP</td>
                      <td>Target</td>
                      <td>Output</td>
                      <td>Var</td>
                      <td rowSpan={2} className=" border-0">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => openMdlRemark(plan, prodType)}
                        >
                          <SlNote size="18" color="#FFF" />
                        </Button>
                      </td>
                      <td rowSpan={2} className="noborder">
                        <Button
                          size="sm"
                          variant="primary"
                          disabled={plan.ACT_MP}
                          onClick={() => selectHc(plan, prodType)}
                        >
                          <FaUserPlus size="20" color="#FFF" />
                        </Button>
                      </td>
                      <td
                        rowSpan={2}
                        className="noborder"
                        onClick={() => accordOpen(plan, prodType)}
                      >
                        <IoIosArrowDown
                          size="20"
                          className={`arrow${plan.SCHD_ID}${plan.SCHD_QTY}`}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>{plan.CUSTOMER_NAME}</td>
                      <td>{plan.ORDER_REFERENCE_PO_NO}</td>
                      <td>{plan.ORDER_STYLE_DESCRIPTION}</td>
                      {/* <td>{plan.PRODUCT_ITEM_DESCRIPTION}</td> */}
                      <td>{plan.ITEM_COLOR_NAME}</td>
                      <td>{getTimeFromMins(plan.PLAN_WH)}</td>
                      <MP plan={plan} prodType={prodType} />
                      <td>{findTarget(plan, prodType)}</td>
                      <td>{findOutput(plan, prodType)}</td>
                      <td>
                        {plan.ACT_TARGET
                          ? plan.NORMAL_OUTPUT - plan.ACT_TARGET
                          : 0}
                      </td>
                    </tr>
                  </tbody>
                </Table>
                {/* detail bundle planning */}
                <Row
                  className={`mt-2 row-planed row-planid-${plan.SCHD_ID}${plan.SCHD_QTY} border-top`}
                >
                  <Col>
                    <Row className="my-1">
                      <Col sm={2}>
                        <Form.Control
                          size="sm"
                          type="text"
                          placeholder="Size Search"
                          onChange={handleInputFilterz}
                        />
                      </Col>
                      <Col sm={3} className="fst-italic">
                        <Form.Check // prettier-ignore
                          type="switch"
                          id="hideloading-switch"
                          label="Show Loading Qty 0"
                          onChange={handleShowLoading}
                        />
                      </Col>
                      <Col sm={3} className="fst-italic">
                        <Form.Check // prettier-ignore
                          type="switch"
                          id="showcomplete-switch"
                          label="Show complete status"
                          onChange={handleShowComplete}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col className="list-table-size">
                        {state.dataQrBundle ? (
                          <Table
                            size="sm"
                            bordered
                            hover
                            className="tbl-qc-detail"
                          >
                            <thead>
                              <tr className="table-dark text-center align-middle row-header-size">
                                {/* <th>BOX</th> */}
                                {/* <th>QR SERIAL</th> */}
                                {/* <th style={{ maxWidth: "200px" }}>STYLE</th> */}
                                <th>SIZE</th>
                                <th>T.BOX</th>
                                <th>SCH QTY</th>
                                <th>LOADING QTY</th>
                                <th>CHECK</th>
                                <th>GOOD</th>
                                <th>DEFECT/BS</th>
                                <th>BALANCE</th>
                                <th>TRANSFER</th>
                                <th>BAL.TFR</th>
                                <th>STATUS</th>
                                <th>DETAIL</th>
                              </tr>
                            </thead>
                            <tbody className=" align-middle">
                              <TrPlanSize
                                plan={plan}
                                viewQrList={viewQrList}
                                handleSelPlanSize={handleSelPlanSize}
                                checkStatus={checkStatus}
                                dataPlanBySize={filterSize(
                                  filersData(state.dataPlanBySize)
                                )}
                                prodType={findType(prodType)}
                              />
                              {/* <TrPlanSizePending
                            plan={plan}
                            viewQrList={viewQrList}
                            handleSelPlanSize={handleSelPlanSize}
                            checkStatus={checkStatus}
                            prodType="N"
                          /> */}
                            </tbody>
                          </Table>
                        ) : null}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))
        : null}
    </>
  );
};

const MP = memo(({ plan, prodType }) => {
  let mpPlan = plan.PLAN_MP;
  let actMp = plan.ACT_MP;
  if (prodType === "ot") {
    mpPlan = plan.PLAN_MP_OT;
    actMp = plan.ACT_MP_OT;
  }
  if (prodType === "extOt") {
    mpPlan = plan.PLAN_MP_X_OT;
    actMp = plan.ACT_MP_X_OT;
  }
  if (!actMp) {
    return <td className="text-warning">{mpPlan}</td>;
  }
  return <td>{actMp}</td>;
});

export default ListPlanning;
