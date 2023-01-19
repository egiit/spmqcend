import { Card, Button, Table, Row, Col } from "react-bootstrap";
import { FaUserPlus } from "react-icons/fa";
import { IoIosArrowDown, IoMdTimer } from "react-icons/io";
import { GiCheckMark } from "react-icons/gi";
import { RiFileEditFill } from "react-icons/ri";
import { useContext } from "react";
import { QcEndlineContex } from "../provider/QcEndProvider";

const ListPlanningOt = ({ dataDailyPlan }) => {
  const { state } = useContext(QcEndlineContex);
  function accordOpen(planId) {
    const arrow = document.getElementsByClassName(`arrow${planId}-ot`)[0];
    const rowListline = document.getElementsByClassName(
      `row-planid-${planId}-ot`
    )[0];
    arrow.classList.toggle("opened");
    rowListline.classList.toggle("opened");
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
                      <td rowSpan={2} className="noborder">
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => console.log("Danger")}
                        >
                          <FaUserPlus size="20" color="#FFF" />
                        </Button>
                      </td>
                      <td
                        rowSpan={2}
                        className="noborder"
                        onClick={() => accordOpen(plan.SCHD_ID + plan.SCHD_QTY)}
                      >
                        <IoIosArrowDown
                          size="20"
                          className={`arrow${plan.SCHD_ID + plan.SCHD_QTY}-ot`}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>{plan.CUSTOMER_NAME}</td>
                      <td>{plan.ORDER_REFERENCE_PO_NO}</td>
                      <td>{plan.PRODUCT_ITEM_CODE}</td>
                      {/* <td>{plan.PRODUCT_ITEM_DESCRIPTION}</td> */}
                      <td>{plan.ITEM_COLOR_NAME}</td>
                      <td>{plan.PLAN_WH_OT}</td>
                      <td>{plan.PLAN_MP_OT}</td>
                      <td>{plan.PLAN_TARGET_OT}</td>
                      <td>45</td>
                      <td>-300</td>
                    </tr>
                    <tr>
                      <td colSpan={10}></td>
                    </tr>
                  </tbody>
                </Table>
                {/* detail bundle planning */}
                <Row
                  className={`mt-2 row-planed row-planid-${
                    plan.SCHD_ID + plan.SCHD_QTY
                  }-ot`}
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
                            <th>BOX</th>
                            <th>QR SERIAL</th>
                            <th>STYLE</th>
                            <th>SIZE</th>
                            <th>QTY</th>
                            <th>CHECKED</th>
                            <th>GOOD</th>
                            <th>DEFECT</th>
                            <th>REPAIRD</th>
                            <th>PENDING</th>
                            <th>STATUS</th>
                            <th>ACT</th>
                          </tr>
                        </thead>
                        <tbody className=" align-middle">
                          {state.dataQrBundle
                            .filter((lsbdl) => lsbdl.SCHD_ID === plan.SCHD_ID)
                            .map((bdl, i) => (
                              <tr className="text-center" key={i}>
                                <td>{bdl.BUNDLE_SEQUENCE}</td>
                                <td>{bdl.BARCODE_SERIAL}</td>
                                <td>{bdl.ORDER_STYLE}</td>
                                <td>{bdl.ORDER_SIZE}</td>
                                <td>{bdl.ORDER_QTY}</td>
                                <td>48</td>
                                <td>47</td>
                                <td>1</td>
                                <td>-</td>
                                <td>-</td>
                                <td>
                                  <GiCheckMark size={20} color="#00a814" />
                                </td>
                                <td>
                                  <Button
                                    size="sm"
                                    className="btn-input"
                                    onClick={() => console.log("Primary")}
                                  >
                                    <RiFileEditFill size={20} />
                                  </Button>
                                </td>
                              </tr>
                            ))}
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

export default ListPlanningOt;
