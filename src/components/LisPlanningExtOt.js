import React, { memo } from "react";
import { Card, Button, Table, Row, Col } from "react-bootstrap";
import { FaUserPlus } from "react-icons/fa";
import { IoIosArrowDown, IoMdTimer } from "react-icons/io";
import { GiCheckMark } from "react-icons/gi";
import { SlNote } from "react-icons/sl";
import { useContext } from "react";
import { QcEndlineContex } from "../provider/QcEndProvider";
import { flash } from "react-universal-flash";
import TrPlanSize from "./compMainModal/TrPlanSize";
import TrPlanSizePending from "./compMainModal/TrPlanSizePending";
import { getTimeFromMins } from "../partial/TimeManipulate";
import CheckNilai from "../partial/CheckNilai";

const LisPlanningExtOt = ({
  dataDailyPlan,
  selectHc,
  handleSelPlanSize,
  viewQrList,
  openMdlRemark,
}) => {
  const { state } = useContext(QcEndlineContex);

  function accordOpen(plan) {
    if (plan.ACT_MP_X_OT === null)
      return flash("Mohon Set Manpower terlebih dahulu!", 2000, "warning");
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
    if (checked) {
      if (checked === qty) return <GiCheckMark size={20} color="#00a814" />;
      if (checked !== qty) return <IoMdTimer size={20} color="#fcba03" />;
    }
    return null;
  }
  return (
    <>
      {dataDailyPlan
        ? dataDailyPlan.map((plan, i) => (
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
                          onClick={() => openMdlRemark(plan, "extOt")}
                        >
                          <SlNote size="18" color="#FFF" />
                        </Button>
                      </td>
                      <td rowSpan={2} className="noborder">
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => selectHc(plan, "extOt")}
                        >
                          <FaUserPlus size="20" color="#FFF" />
                        </Button>
                      </td>
                      <td
                        rowSpan={2}
                        className="noborder"
                        onClick={() => accordOpen(plan, "extOt")}
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
                      <td>{getTimeFromMins(plan.PLAN_WH_X_OT)}</td>
                      <MP plan={plan} />
                      <td>
                        {plan.ACT_TARGET_X_OT
                          ? plan.ACT_TARGET_X_OT
                          : CheckNilai(plan.PLAN_TARGET_X_OT)}
                      </td>
                      <td>{CheckNilai(plan.X_OT_OUTPUT)}</td>
                      <td>
                        {plan.ACT_TARGET_X_OT
                          ? CheckNilai(plan.X_OT_OUTPUT) -
                            CheckNilai(plan.ACT_TARGET_X_OT)
                          : 0}
                      </td>
                    </tr>
                  </tbody>
                </Table>
                {/* detail bundle planning */}
                <Row
                  className={`mt-2 row-planed row-planid-${plan.SCHD_ID}${plan.SCHD_QTY}`}
                >
                  <Col>
                    {state.dataQrBundle ? (
                      <Table
                        size="sm"
                        bordered
                        responsive
                        hover
                        className="tbl-qc-detail"
                      >
                        <thead>
                          <tr className="table-dark text-center align-middle">
                            {/* <th>BOX</th> */}
                            {/* <th>QR SERIAL</th> */}
                            <th>SCH DATE</th>
                            <th style={{ maxWidth: "200px" }}>STYLE</th>
                            <th>SIZE</th>
                            <th>T.BUNDLE</th>
                            <th>QTY</th>
                            <th>CHECK</th>
                            <th>RFT</th>
                            <th>DEFECT</th>
                            <th>REPAIRED</th>
                            <th>BS</th>
                            <th>PENDING</th>
                            <th>STATUS</th>
                            <th>ACT</th>
                          </tr>
                        </thead>
                        <tbody className=" align-middle">
                          <TrPlanSize
                            plan={plan}
                            viewQrList={viewQrList}
                            handleSelPlanSize={handleSelPlanSize}
                            checkStatus={checkStatus}
                            typeProd="XO"
                          />
                          <TrPlanSizePending
                            plan={plan}
                            viewQrList={viewQrList}
                            handleSelPlanSize={handleSelPlanSize}
                            checkStatus={checkStatus}
                            typeProd="XO"
                          />
                        </tbody>
                      </Table>
                    ) : null}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))
        : null}
    </>
  );
};

const MP = memo(({ plan }) => {
  if (plan.ACT_MP_X_OT === null) {
    return <td className="text-warning">{plan.PLAN_MP_X_OT}</td>;
  }
  return <td>{plan.ACT_MP_X_OT}</td>;
});

export default LisPlanningExtOt;
