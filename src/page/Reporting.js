import { useContext, memo } from "react";
import { Row, Col, Card, Table, ListGroup } from "react-bootstrap";
import { IoIosArrowDown } from "react-icons/io";
import { getTimeFromMins } from "../partial/TimeManipulate";
import { QcEndlineContex } from "../provider/QcEndProvider";
import { flash } from "react-universal-flash";
import CheckNilai from "../partial/CheckNilai";

const Reporting = () => {
  const { state } = useContext(QcEndlineContex);

  function findTot(data, colname) {
    if (data.length === 0) return 0;

    return data.reduce(
      (sum, item) =>
        parseInt(CheckNilai(sum)) + parseInt(CheckNilai(item[colname])),
      0
    );
  }

  function findTarget() {
    const actualTarget = state.dataDailyPlan.filter(
      (dat) => dat.ACT_TARGET !== null
    );
    const actualTargetOt = state.dataDailyPlan.filter(
      (dat) => dat.ACT_TARGET_OT !== null
    );
    const actualTargeExtOt = state.dataDailyPlan.filter(
      (dat) => dat.ACT_TARGET_X_OT !== null
    );
    const totTarget =
      findTot(actualTarget, "ACT_TARGET") +
      findTot(actualTargetOt, "ACT_TARGET_OT") +
      findTot(actualTargeExtOt, "ACT_TARGET_X_OT");
    return totTarget;
  }

  function findNOutput() {
    const outputNormal = state.dataDailyPlan.filter(
      (dat) => dat.NORMAL_OUTPUT !== null
    );
    const outputOt = state.dataDailyPlan.filter(
      (dat) => dat.OT_OUTPUT !== null
    );
    const xoutputOt = state.dataDailyPlan.filter(
      (dat) => dat.X_OT_OUTPUT !== null
    );
    const totOutput =
      findTot(outputNormal, "NORMAL_OUTPUT") +
      findTot(outputOt, "OT_OUTPUT") +
      findTot(xoutputOt, "X_OT_OUTPUT");
    return totOutput;
  }

  function findCheckTot() {
    const checkPerhour = state.listRepDefHour.filter(
      (dat) => dat.CHECKED !== null
    );
    return findTot(checkPerhour, "CHECKED");
  }

  function findWip() {
    const allDataPlanSize = [
      ...state.dataPlanBySize,
      ...state.dataPlanBySizePend,
    ];

    if (allDataPlanSize.length === 0) return 0;

    const totalQtyBdl = findTot(allDataPlanSize, "QTY");
    const totalGood = findTot(allDataPlanSize, "GOOD");
    return totalQtyBdl - totalGood;
  }

  function findCheckDef() {
    const checkPerhour = state.listRepDefHour.filter(
      (dat) => dat.DEFECT !== null
    );
    return findTot(checkPerhour, "DEFECT");
  }

  const listCard = [
    { title: "WIP", value: findWip() },
    { title: "TARGET", value: findTarget() },
    { title: "OUTPUT", value: findNOutput() },
    { title: "VARIANCE", value: CheckNilai(findTarget() - findNOutput()) },
    { title: "CHECK", value: findCheckTot() },
    { title: "DEFECT", value: findCheckDef() },
  ];

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

  function findListPartDef(data) {
    if (data.length === 0) return null;
    return data.map((defpar, i) => (
      <ListGroup horizontal key={i}>
        <ListGroup.Item
          className="py-1"
          variant={defpar.TYP === "REPAIR" ? "primary" : "warning"}
        >
          Qty: {defpar.ENDLINE_OUT_QTY}
        </ListGroup.Item>
        <ListGroup.Item className="py-1">
          Defect: {defpar.DEFECT_NAME}
        </ListGroup.Item>
        <ListGroup.Item className="py-1">
          Part: {defpar.PART_NAME}
        </ListGroup.Item>
      </ListGroup>
    ));
  }

  function filterPartDefRep(rows, schdi, time, size, typ) {
    if (!rows) {
      return [];
    }

    const dat = rows.filter(
      (row) =>
        parseInt(row.ENDLINE_ACT_SCHD_ID) === parseInt(schdi) &&
        row.TYP === typ &&
        parseInt(row.ENDLINE_TIME) === parseInt(time) &&
        row.ENDLINE_PLAN_SIZE === size
    );

    return dat;
  }

  const totalCol = (data, schdid, colname) => {
    if (!data.length) return 0;
    const dataSch = data.filter(
      (row) => parseInt(row.ENDLINE_ACT_SCHD_ID) === parseInt(schdid)
    );
    // console.log(data);
    if (!dataSch.length) return 0;
    return dataSch.reduce(
      (sum, item) =>
        parseInt(CheckNilai(sum)) + parseInt(CheckNilai(item[colname])),
      0
    );
  };

  function filterSchd(rows, schdi) {
    if (!rows) {
      return [];
    }
    const dat = rows.filter(
      (row) => parseInt(row.ENDLINE_ACT_SCHD_ID) === parseInt(schdi)
    );

    return dat;
  }

  return (
    <div className="mt-5 pt-3">
      <div className="fw-bold ms-3 fs-5 mb-2 text-center bg-secondary text-light">
        Checked Report
      </div>
      <Row className="px-3 m-0">
        {listCard.map((ls, i) => (
          <Col key={i}>
            <Card className="border-0 shadow">
              <Card.Body className="py-1">
                <div className="text-center">{ls.title}</div>
                <div className="text-center fs-5">{ls.value}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row className="m-0">
        <Col className="mt-3">
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
                          <td>{getTimeFromMins(plan.PLAN_WH)}</td>
                          <MP plan={plan} />
                          <td>
                            {plan.ACT_TARGET
                              ? CheckNilai(plan.ACT_TARGET) +
                                CheckNilai(plan.ACT_TARGET_OT) +
                                CheckNilai(plan.ACT_TARGET_X_OT)
                              : CheckNilai(plan.PLAN_TARGET) +
                                CheckNilai(plan.PLAN_TARGETPLAN_TARGET_OT) +
                                CheckNilai(plan.PLAN_TARGET_X_OT)}
                          </td>
                          <td>
                            {CheckNilai(plan.NORMAL_OUTPUT) +
                              CheckNilai(plan.OT_OUTPUT) +
                              CheckNilai(plan.X_OT_OUTPUT)}
                          </td>
                          <td>
                            {plan.ACT_TARGET
                              ? CheckNilai(plan.ACT_TARGET) +
                                CheckNilai(plan.ACT_TARGET_OT) +
                                CheckNilai(plan.ACT_TARGET_X_OT) -
                                (CheckNilai(plan.PLAN_TARGET) +
                                  CheckNilai(plan.PLAN_TARGETPLAN_TARGET_OT) +
                                  CheckNilai(plan.PLAN_TARGET_X_OT))
                              : 0}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                    {/* detail bundle planning */}
                    <Row
                      className={`mt-2 row-planed row-planid-${
                        plan.SCHD_ID + plan.SCHD_QTY
                      } ps-2 pe-3`}
                    >
                      <Col className="table-responsive ">
                        <Table
                          size="sm"
                          bordered
                          hover
                          className="tbl-qc-detail"
                        >
                          <thead>
                            <tr
                              className="table-secondary text-center"
                              style={{ zIndex: 100 }}
                            >
                              <th>TIME</th>
                              <th>SIZE</th>
                              <th>CHECK</th>
                              <th>GOOD</th>
                              <th>RFT</th>
                              <th>DEFECT</th>
                              <th>AFTER REPAIR</th>
                              <th>BS</th>
                              {/* <th>RFT%</th>
                              <th>DEFECT%</th> */}
                              <th>NAME OF DEFECT</th>
                              <th>REPAIRED</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filterSchd(state.listRepDefHour, plan.SCHD_ID)
                              .length !== 0 ? (
                              filterSchd(
                                state.listRepDefHour,
                                plan.SCHD_ID
                              ).map((check, i) => (
                                <tr
                                  className="text-center align-middle"
                                  key={i}
                                >
                                  <td>{check.ENDLINE_TIME}</td>
                                  <td>{check.ENDLINE_PLAN_SIZE}</td>
                                  <td>{check.CHECKED}</td>
                                  <td>{check.GOOD}</td>
                                  <td>{check.RTT}</td>
                                  <td>{check.DEFECT}</td>
                                  <td>{check.REPAIRED}</td>
                                  <td> {check.BS}</td>
                                  {/* <td>
                                    {check.RTT
                      ? `${CheckNilai(
                          (check.RTT / check.CHECKED) * 100
                        ).toFixed(2)}%`
                      : null}
                                  </td>
                                  <td>
                                    {check.DEFECT
                      ? `${CheckNilai(
                          (check.DEFECT / check.CHECKED) * 100
                        ).toFixed(2)}%`
                      : null}
                                  </td> */}
                                  <td style={{ whiteSpace: "nowrap" }}>
                                    {findListPartDef(
                                      filterPartDefRep(
                                        state.listRepDefDetail,
                                        check.ENDLINE_ACT_SCHD_ID,
                                        check.HOUR_TIME,
                                        check.ENDLINE_PLAN_SIZE,
                                        "DEF"
                                      )
                                    )}
                                  </td>
                                  <td style={{ whiteSpace: "nowrap" }}>
                                    {findListPartDef(
                                      filterPartDefRep(
                                        state.listRepDefDetail,
                                        check.ENDLINE_ACT_SCHD_ID,
                                        check.HOUR_TIME,
                                        check.ENDLINE_PLAN_SIZE,
                                        "REPAIR"
                                      )
                                    )}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan={11}
                                  className="text-center fst-italic fw-bold"
                                >
                                  NO DATA
                                </td>
                              </tr>
                            )}
                            <tr className="gt-row table-secondary fw-bold text-center">
                              <td>TOTAL</td>
                              <td></td>
                              <td>
                                {totalCol(
                                  state.listRepDefHour,
                                  plan.SCHD_ID,
                                  "CHECKED"
                                )}
                              </td>
                              <td>
                                {totalCol(
                                  state.listRepDefHour,
                                  plan.SCHD_ID,
                                  "GOOD"
                                )}
                              </td>
                              <td>
                                {totalCol(
                                  state.listRepDefHour,
                                  plan.SCHD_ID,
                                  "RTT"
                                )}
                              </td>
                              <td>
                                {totalCol(
                                  state.listRepDefHour,
                                  plan.SCHD_ID,
                                  "DEFECT"
                                )}
                              </td>
                              <td>
                                {totalCol(
                                  state.listRepDefHour,
                                  plan.SCHD_ID,
                                  "REPAIRED"
                                )}
                              </td>
                              <td>
                                {totalCol(
                                  state.listRepDefHour,
                                  plan.SCHD_ID,
                                  "BS"
                                )}
                              </td>
                              <td colSpan={2}></td>
                            </tr>
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))
            : null}
        </Col>
      </Row>
    </div>
  );
};

const MP = memo(({ plan }) => {
  if (plan.ACT_MP == null) {
    return <td className="text-warning">{plan.PLAN_MP}</td>;
  }
  return <td>{plan.ACT_MP}</td>;
});

export default Reporting;
