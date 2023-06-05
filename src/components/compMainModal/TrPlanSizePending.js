import { Button, Table } from "react-bootstrap";
import { IoMdDoneAll } from "react-icons/io";
import { RiFileEditFill } from "react-icons/ri";
import { BiTransferAlt } from "react-icons/bi";
import { BsViewList } from "react-icons/bs";
import React, { useContext } from "react";
import { QcEndlineContex } from "../../provider/QcEndProvider";
import { FcRuler } from "react-icons/fc";
import { ImUndo2 } from "react-icons/im";

const TrPlanSizePending = ({
  plan,
  viewQrList,
  handleSelPlanSize,
  checkStatus,
  typeProd,
}) => {
  const { state, handlMdlTfrActv, getSpectList, handlMdlReturn, measCountVal } =
    useContext(QcEndlineContex);

  return (
    <>
      {state.dataPlanBySizePend.length !== 0
        ? state.dataPlanBySizePend
            .filter((planz) => planz.SCH_ID === plan.SCH_ID)
            .map((plnz, i) => (
              <React.Fragment key={i}>
                <tr className="text-center">
                  {/* <td>{plnz.BUNDLE_SEQUENCE}</td> */}
                  {/* <td>{plnz.BARCODE_SERIAL}</td> */}
                  <td className="text-danger">{plnz.SCHD_PROD_DATE}</td>
                  <td style={{ maxWidth: "200px" }}>{plnz.ORDER_STYLE}</td>
                  <td>{plnz.ORDER_SIZE}</td>
                  <td>{plnz.BDL_TOTAL}</td>
                  <td>{plnz.QTY}</td>
                  <td>{plnz.TOTAL_CHECKED}</td>
                  <td>{plnz.RTT}</td>
                  <td>{plnz.DEFECT}</td>
                  <td>{plnz.REPAIRED}</td>
                  <td>{plnz.BS}</td>
                  <td>
                    {plnz.TOTAL_CHECKED ? plnz.QTY - plnz.TOTAL_CHECKED : null}
                  </td>
                  <td>{checkStatus(plnz.QTY, plnz.TOTAL_CHECKED)}</td>
                  <td>
                    <Button
                      size="sm"
                      className="btn-transfer me-2"
                      onClick={() => viewQrList(plnz, typeProd)}
                    >
                      <BsViewList size={20} />
                    </Button>
                    <Button
                      size="sm"
                      className="btn-input"
                      onClick={() => handleSelPlanSize(plnz, typeProd, plan)}
                    >
                      <RiFileEditFill size={20} />
                    </Button>
                  </td>
                </tr>
                <tr className={`listqrview ${plnz.SCHD_ID + plnz.ORDER_SIZE}`}>
                  <td colSpan={13} className="table-secondary">
                    <div className="fw-bold">
                      Total Good : {plnz.GOOD} {"   "} | Total Transfer :{" "}
                      {plnz.TFR_QTY} {"   "} | Balance :{" "}
                      {plnz.TFR_QTY ? plnz.GOOD - plnz.TFR_QTY : null}
                    </div>
                    <Table size="sm" bordered responsive>
                      <thead>
                        <tr className="table-light text-center">
                          <th>BOX</th>
                          <th>QR SERIAL</th>
                          <th>ORDER REF</th>
                          <th>SIZE</th>
                          <th>QTY</th>
                          <th>SCANIN DATE</th>
                          {/* <th>SCH DATE</th> */}
                          <th>MEAS CHECK</th>
                          <th>TFR STATUS</th>
                          <th>ACT</th>
                        </tr>
                      </thead>
                      <tbody className="table-light">
                        {state.dataQrBundlePend
                          ? state.dataQrBundlePend
                              .filter(
                                (bdls) =>
                                  bdls.SCHD_ID === plnz.SCHD_ID &&
                                  bdls.ORDER_STYLE === plnz.ORDER_STYLE &&
                                  bdls.ORDER_SIZE === plnz.ORDER_SIZE &&
                                  bdls.ORDER_COLOR === plnz.ORDER_COLOR
                              )
                              .map((bdl, idx) => (
                                <tr key={idx} className="text-center">
                                  <td>{bdl.BUNDLE_SEQUENCE}</td>
                                  <td>{bdl.BARCODE_SERIAL}</td>
                                  <td>{bdl.ORDER_REF}</td>
                                  <td>{bdl.ORDER_SIZE}</td>
                                  <td>{bdl.ORDER_QTY}</td>
                                  <td>{bdl.SCAN_DATE}</td>
                                  <td>
                                    {measCountVal(
                                      state.measCheckCount,
                                      bdl.BARCODE_SERIAL
                                    )}
                                  </td>
                                  {/* <td>{bdl.SCHD_PROD_DATE}</td> */}
                                  <td>
                                    {bdl.BARCODE_TRANSFER ? (
                                      <IoMdDoneAll size={20} color="#00a814" />
                                    ) : null}
                                  </td>
                                  <td>
                                    <Button
                                      size="sm"
                                      className="btn-transfer me-2"
                                      disabled={
                                        bdl.BARCODE_SERIAL ===
                                        bdl.BARCODE_TRANSFER
                                      }
                                      onClick={() =>
                                        handlMdlReturn(plnz, bdl, typeProd)
                                      }
                                    >
                                      <ImUndo2 size={16} />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline-secondary"
                                      className="me-2"
                                      disabled={
                                        bdl.BARCODE_SERIAL ===
                                        bdl.BARCODE_TRANSFER
                                      }
                                      onClick={() =>
                                        getSpectList(bdl, plnz.SCHD_ID)
                                      }
                                    >
                                      <FcRuler size={16} />
                                    </Button>
                                    <Button
                                      size="sm"
                                      disabled={
                                        bdl.BARCODE_SERIAL ===
                                        bdl.BARCODE_TRANSFER
                                      }
                                      onClick={() =>
                                        handlMdlTfrActv(plnz, bdl, typeProd)
                                      }
                                    >
                                      <BiTransferAlt size={16} />
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
        : null}
    </>
  );
};

export default TrPlanSizePending;
