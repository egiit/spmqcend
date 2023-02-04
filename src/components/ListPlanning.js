import React, { memo } from "react";
import { Card, Button, Table, Row, Col } from "react-bootstrap";
import { FaUserPlus } from "react-icons/fa";
import { IoIosArrowDown, IoMdTimer, IoMdDoneAll } from "react-icons/io";
import { GiCheckMark } from "react-icons/gi";
import { RiFileEditFill } from "react-icons/ri";
import { BiTransferAlt } from "react-icons/bi";
import { BsViewList } from "react-icons/bs";
import { useContext } from "react";
import { QcEndlineContex } from "../provider/QcEndProvider";
import { flash } from "react-universal-flash";

const ListPlanning = ({ selectHc, handleSelPlanSize }) => {
  const { state, handlMdlTfrActv } = useContext(QcEndlineContex);

  function accordOpen(plan) {
    if (plan.ACT_MP === null)
      return flash("Please Set Actual Manpower First!", 2000, "warning");
    const getUnixId = plan.SCHD_ID + plan.SCHD_QTY;
    const arrow = document.getElementsByClassName(`arrow${getUnixId}`)[0];
    const rowListline = document.getElementsByClassName(
      `row-planid-${getUnixId}`
    )[0];
    arrow.classList.toggle("opened");
    rowListline.classList.toggle("opened");
  }

  function viewQrList(planz) {
    const getPlanzunix = planz.SCHD_ID + planz.ORDER_SIZE;
    const trlisqr = document.getElementsByClassName(getPlanzunix)[0];
    trlisqr.classList.toggle("shows");
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
                      <td rowSpan={2} className="noborder">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => selectHc(plan, "normal")}
                        >
                          <FaUserPlus size="20" color="#FFF" />
                        </Button>
                      </td>
                      <td
                        rowSpan={2}
                        className="noborder"
                        onClick={() => accordOpen(plan, "normal")}
                      >
                        <IoIosArrowDown
                          size="20"
                          className={`arrow${plan.SCHD_ID + plan.SCHD_QTY}`}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>{plan.CUSTOMER_NAME}</td>
                      <td>{plan.ORDER_REFERENCE_PO_NO}</td>
                      <td>{plan.ORDER_STYLE_DESCRIPTION}</td>
                      {/* <td>{plan.PRODUCT_ITEM_DESCRIPTION}</td> */}
                      <td>{plan.ITEM_COLOR_NAME}</td>
                      <td>{plan.PLAN_WH}</td>
                      <MP plan={plan} />
                      <td>
                        {plan.ACT_TARGET ? plan.ACT_TARGET : plan.PLAN_TARGET}
                      </td>
                      <td>{plan.NORMAL_OUTPUT}</td>
                      <td>
                        {plan.ACT_TARGET
                          ? plan.ACT_TARGET - plan.NORMAL_OUTPUT
                          : 0}
                      </td>
                    </tr>
                  </tbody>
                </Table>
                {/* detail bundle planning */}
                <Row
                  className={`mt-2 row-planed row-planid-${
                    plan.SCHD_ID + plan.SCHD_QTY
                  }`}
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
                            <th>STYLE</th>
                            <th>SIZE</th>
                            <th>T.BUNDLE</th>
                            <th>QTY</th>
                            <th>CHECKED</th>
                            <th>RFT</th>
                            <th>DEFECT</th>
                            <th>REPAIRD</th>
                            <th>BS</th>
                            <th>PENDING</th>
                            <th>STATUS</th>
                            <th>ACT</th>
                          </tr>
                        </thead>
                        <tbody className=" align-middle">
                          {state.dataPlanBySize.length !== 0 ? (
                            state.dataPlanBySize
                              .filter((planz) => planz.SCHD_ID === plan.SCHD_ID)
                              .map((plnz, i) => (
                                <React.Fragment key={i}>
                                  <tr className="text-center">
                                    {/* <td>{plnz.BUNDLE_SEQUENCE}</td> */}
                                    {/* <td>{plnz.BARCODE_SERIAL}</td> */}
                                    <td>{plnz.ORDER_STYLE}</td>
                                    <td>{plnz.ORDER_SIZE}</td>
                                    <td>{plnz.BDL_TOTAL}</td>
                                    <td>{plnz.QTY}</td>
                                    <td>{plnz.TOTAL_CHECKED}</td>
                                    <td>{plnz.RTT}</td>
                                    <td>{plnz.DEFECT}</td>
                                    <td>{plnz.REPAIRED}</td>
                                    <td>{plnz.BS}</td>
                                    <td>
                                      {plnz.TOTAL_CHECKED
                                        ? plnz.QTY - plnz.TOTAL_CHECKED
                                        : null}
                                    </td>
                                    <td>
                                      {checkStatus(
                                        plnz.QTY,
                                        plnz.TOTAL_CHECKED
                                      )}
                                    </td>
                                    <td>
                                      <Button
                                        size="sm"
                                        className="btn-transfer me-2"
                                        onClick={() => viewQrList(plnz, "N")}
                                      >
                                        <BsViewList size={20} />
                                      </Button>
                                      <Button
                                        size="sm"
                                        className="btn-input"
                                        onClick={() =>
                                          handleSelPlanSize(plnz, "N")
                                        }
                                      >
                                        <RiFileEditFill size={20} />
                                      </Button>
                                    </td>
                                  </tr>
                                  <tr
                                    className={`listqrview ${
                                      plnz.SCHD_ID + plnz.ORDER_SIZE
                                    }`}
                                  >
                                    <td
                                      colSpan={12}
                                      className="table-secondary"
                                    >
                                      <div className="fw-bold">
                                        Total Good : {plnz.GOOD} {"   "} | Total
                                        Transfer : {plnz.TFR_QTY} {"   "} |{" "}
                                        Balance :{" "}
                                        {plnz.TFR_QTY
                                          ? plnz.GOOD - plnz.TFR_QTY
                                          : null}
                                      </div>
                                      <Table size="sm" bordered responsive>
                                        <thead>
                                          <tr className="table-light text-center">
                                            <th>BOX</th>
                                            <th>QR SERIAL</th>
                                            <th>ORDER REF</th>
                                            <th>SIZE</th>
                                            <th>QTY</th>
                                            <th>SCH DATE</th>
                                            <th>SCANIN DATE</th>
                                            <th>TFR STATUS</th>
                                            <th>ACT</th>
                                          </tr>
                                        </thead>
                                        <tbody className="table-light">
                                          {state.dataQrBundle
                                            ? state.dataQrBundle
                                                .filter(
                                                  (bdls) =>
                                                    bdls.ORDER_STYLE ===
                                                      plnz.ORDER_STYLE &&
                                                    bdls.ORDER_SIZE ===
                                                      plnz.ORDER_SIZE &&
                                                    bdls.ORDER_COLOR ===
                                                      plnz.ORDER_COLOR
                                                )
                                                .map((bdl, idx) => (
                                                  <tr
                                                    key={idx}
                                                    className="text-center"
                                                  >
                                                    <td>
                                                      {bdl.BUNDLE_SEQUENCE}
                                                    </td>
                                                    <td>
                                                      {bdl.BARCODE_SERIAL}
                                                    </td>
                                                    <td>{bdl.ORDER_REF}</td>
                                                    <td>{bdl.ORDER_SIZE}</td>
                                                    <td>{bdl.ORDER_QTY}</td>
                                                    <td>
                                                      {bdl.SCHD_PROD_DATE}
                                                    </td>
                                                    <td>{bdl.SCAN_DATE}</td>
                                                    <td>
                                                      {bdl.BARCODE_TRANSFER ? (
                                                        <IoMdDoneAll
                                                          size={20}
                                                          color="#00a814"
                                                        />
                                                      ) : null}
                                                    </td>
                                                    <td>
                                                      <Button
                                                        size="sm"
                                                        className="btn-transfer"
                                                        disabled={
                                                          bdl.BARCODE_SERIAL ===
                                                          bdl.BARCODE_TRANSFER
                                                        }
                                                        onClick={() =>
                                                          handlMdlTfrActv(
                                                            plnz,
                                                            bdl,
                                                            "N"
                                                          )
                                                        }
                                                      >
                                                        <BiTransferAlt
                                                          size={16}
                                                        />
                                                      </Button>
                                                    </td>
                                                  </tr>
                                                ))
                                            : null}
                                        </tbody>
                                      </Table>
                                    </td>
                                  </tr>
                                </React.Fragment>
                              ))
                          ) : (
                            <tr>
                              <td
                                colSpan={12}
                                className="text-center fst-italic"
                              >
                                No Bundle Loading
                              </td>
                            </tr>
                          )}
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
  if (plan.ACT_MP == null) {
    return <td className="text-warning">{plan.PLAN_MP}</td>;
  }
  return <td>{plan.ACT_MP}</td>;
});

export default ListPlanning;
