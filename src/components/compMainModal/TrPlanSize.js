import React, { useContext, useState } from "react";
import { Button, Table, Row, Col, Form } from "react-bootstrap";
import { IoMdDoneAll } from "react-icons/io";
import { RiFileEditFill } from "react-icons/ri";
import { BiTransferAlt } from "react-icons/bi";
import { BsViewList } from "react-icons/bs";
import { QcEndlineContex } from "../../provider/QcEndProvider";
import { FcRuler } from "react-icons/fc";
import { ImUndo2 } from "react-icons/im";
import { TbArrowsSplit } from "react-icons/tb";
import CheckNilai from "../../partial/CheckNilai";

const TrPlanSize = ({
  plan,
  viewQrList,
  handleSelPlanSize,
  checkStatus,
  prodType,
  dataPlanBySize,
}) => {
  const { state, handlMdlTfrActv, getSpectList, handlMdlReturn, measCountVal } =
    useContext(QcEndlineContex);
  const [queryBdl, setQuryBdl] = useState("");

  function filterQrBdl(data, schd, size, qry) {
    if (!data || data.length === 0) return data;
    const newData = [...data];
    if (qry === "")
      return newData.filter(
        (dta) => dta.SCH_ID === schd && dta.ORDER_SIZE === size
      );
    return newData.filter(
      (dta) =>
        dta.SCH_ID === schd &&
        dta.ORDER_SIZE === size &&
        dta.BARCODE_SERIAL.indexOf(qry) > -1
    );
  }

  function handleInptQrSearch(e) {
    const { value } = e.target;
    setQuryBdl(value);
  }

  function checkTfr(bdl) {
    if (parseInt(bdl.TRANSFER_QTY) === bdl.ORDER_QTY) {
      return <IoMdDoneAll size={20} color="#00a814" />;
    } else {
      if (bdl.COUNT_SPLIT) return <TbArrowsSplit size={22} color="#A30000" />;
      return null;
    }
  }

  function CheckDisabled(bdl) {
    // const checkMeas = measCountVal(state.measCheckCount, bdl.BARCODE_SERIAL);
    // console.log(checkMeas);
    if (CheckNilai(bdl.BAL_TRANSFER) < 1 || bdl.RETURN_STATUS !== null) {
      return true;
    }
  }

  return (
    <>
      {dataPlanBySize?.length !== 0 ? (
        dataPlanBySize
          .filter((planz) => planz.SCH_ID === plan.SCH_ID)
          .map((plnz, i) => (
            <React.Fragment key={i}>
              <tr className="text-center">
                {/* <td>{plnz.BUNDLE_SEQUENCE}</td> */}
                {/* <td>{plnz.BARCODE_SERIAL}</td> */}
                {/* <td>{plnz.SCHD_PROD_DATE}</td> */}
                {/* <td style={{ maxWidth: "200px" }}>{plnz.ORDER_STYLE}</td> */}
                <td>{plnz.SIZE_CODE}</td>
                <td>{plnz.BDL_TOTAL}</td>
                <td>{plnz.SCH_QTY}</td>
                <td>{plnz.LOADING_QTY}</td>
                <td>{plnz.TOTAL_CHECKED}</td>
                <td>{plnz.GOOD}</td>
                <td>{plnz.DEFECT_BS}</td>
                <td>{plnz.BALANCE}</td>
                <td>{plnz.TTL_TRANSFER}</td>
                <td>{plnz.BAL_TRANSFER}</td>
                <td>{checkStatus(plnz.BAL_SCHEDULE, plnz.TOTAL_CHECKED)}</td>
                <td>
                  <Button
                    size="sm"
                    className="btn-transfer me-2"
                    onClick={() => viewQrList(plnz, prodType)}
                  >
                    <BsViewList size={20} />
                  </Button>
                </td>
              </tr>
              <tr className={`listqrview ${plnz.SCH_ID + plnz.SIZE_CODE}`}>
                <td colSpan={13} className="table-secondary">
                  <Row className="fw-bold">
                    <Col sm={3}>
                      <Form.Control
                        size="sm"
                        type="text"
                        onChange={handleInptQrSearch}
                        placeholder="QR Search"
                      />
                    </Col>
                  </Row>
                  <Table size="sm" bordered responsive>
                    <thead>
                      <tr className="table-light text-center">
                        <th>BOX NO</th>
                        <th>QR SERIAL</th>
                        {/* <th>ORDER REF</th> */}
                        <th>SIZE</th>
                        <th>QTY</th>
                        <th>SCANIN DATE</th>
                        {/* <th>SCH DATE</th> */}
                        <th>CHECK</th>
                        <th>GOOD</th>
                        <th>DEFECT/BS</th>
                        {/* <th>REPAIRED</th> */}
                        {/* <th>BS</th> */}
                        <th>BALANCE</th>
                        {/* <th>STATUS</th> */}
                        <th>MEAS</th>
                        <th>TFR QTY</th>
                        <th>TFR STATUS</th>
                        <th>ACT</th>
                        <th>INSPECT</th>
                      </tr>
                    </thead>
                    <tbody className="table-light">
                      {state.dataQrBundle
                        ? filterQrBdl(
                            state.dataQrBundle,
                            plnz.SCH_ID,
                            plnz.SIZE_CODE,
                            queryBdl
                          ).map((bdl, idx) => (
                            <tr key={idx} className="text-center">
                              <td>{bdl.BUNDLE_SEQUENCE}</td>
                              <td>{bdl.BARCODE_SERIAL}</td>
                              <td>{bdl.ORDER_SIZE}</td>
                              <td>{bdl.ORDER_QTY}</td>
                              <td>{bdl.SCAN_DATE}</td>
                              <td>{bdl.TOTAL_CHECKED}</td>
                              <td>{bdl.GOOD}</td>
                              <td>{bdl.DEFECT_BS}</td>
                              <td>{bdl.BALANCE}</td>
                              {/* <td>{bdl.SCHD_PROD_DATE}</td> */}
                              <td>
                                {measCountVal(
                                  state.measCheckCount,
                                  bdl.BARCODE_SERIAL
                                )}
                              </td>
                              <td>{bdl.TRANSFER_QTY}</td>
                              <td>{checkTfr(bdl)}</td>
                              <td>
                                <Button
                                  size="sm"
                                  className="btn-transfer me-2"
                                  disabled={bdl.TOTAL_CHECKED !== "0"}
                                  onClick={() => handlMdlReturn(bdl)}
                                >
                                  <ImUndo2 size={16} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-secondary"
                                  className="me-2"
                                  disabled={bdl.TRANSFER_QTY === bdl.ORDER_QTY}
                                  onClick={() => getSpectList(bdl, plan)}
                                >
                                  <FcRuler size={16} />
                                </Button>
                                <Button
                                  size="sm"
                                  // className="btn-transfer"
                                  disabled={CheckDisabled(bdl)}
                                  onClick={() => handlMdlTfrActv(bdl)}
                                >
                                  <BiTransferAlt size={16} />
                                </Button>
                              </td>
                              <td>
                                <Button
                                  size="sm"
                                  className="btn-input"
                                  disabled={
                                    parseInt(bdl.TRANSFER_QTY) === bdl.ORDER_QTY
                                  }
                                  onClick={() =>
                                    handleSelPlanSize(bdl, prodType, plan)
                                  }
                                >
                                  <RiFileEditFill size={20} />
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
          <td colSpan={13} className="text-center fst-italic">
            No Bundle Loading For This Schedule
          </td>
        </tr>
      )}
    </>
  );
};

export default TrPlanSize;
