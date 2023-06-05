import { Button, Table } from "react-bootstrap";
import { IoMdDoneAll, IoMdTimer } from "react-icons/io";
import { GiCheckMark } from "react-icons/gi";
// import { RiFileEditFill } from "react-icons/ri";
import { BiTransferAlt } from "react-icons/bi";
import { BsViewList } from "react-icons/bs";
import React, { useContext } from "react";
import { QcEndlineContex } from "../provider/QcEndProvider";
import { ImUndo2 } from "react-icons/im";

const TableListPendding = ({
  //   plan,
  viewQrList,
}) => {
  const { state, handlMdlTfrActv, handlMdlReturn } =
    useContext(QcEndlineContex);
  function checkStatus(qty, checked) {
    if (checked) {
      if (checked === qty) return <GiCheckMark size={20} color="#00a814" />;
      if (checked !== qty) return <IoMdTimer size={20} color="#fcba03" />;
    }
    return null;
  }
  return (
    <div className="mt-2">
      <Table size="sm" bordered responsive hover className="tbl-qc-detail">
        <thead>
          <tr className="table-warning text-center align-middle">
            {/* <th>BOX</th> */}
            {/* <th>QR SERIAL</th> */}
            <th>SCHEDULE DATE</th>
            <th>STYLE</th>
            <th>COLOR</th>
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
          {state.dataPlanBySizePend.length !== 0 ? (
            state.dataPlanBySizePend.map((plnz, i) => (
              <React.Fragment key={i}>
                <tr className="text-center table-light">
                  {/* <td>{plnz.BUNDLE_SEQUENCE}</td> */}
                  {/* <td>{plnz.BARCODE_SERIAL}</td> */}
                  <td>{plnz.SCHD_PROD_DATE}</td>
                  <td>{plnz.ORDER_STYLE}</td>
                  <td>{plnz.ORDER_COLOR}</td>
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
                      onClick={() => viewQrList(plnz, "N")}
                    >
                      <BsViewList size={20} />
                    </Button>
                    {/* <Button
                      size="sm"
                      className="btn-input"
                      onClick={() => handleSelPlanSize(plnz, "N", plan)}
                    >
                      <RiFileEditFill size={20} />
                    </Button> */}
                  </td>
                </tr>
                <tr className={`listqrview ${plnz.SCHD_ID + plnz.ORDER_SIZE}`}>
                  <td colSpan={14} className="table-secondary">
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
                          <th>SCH DATE</th>
                          <th>SCANIN DATE</th>
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
                                  <td>{bdl.SCHD_PROD_DATE}</td>
                                  <td>{bdl.SCAN_DATE}</td>
                                  <td>
                                    {bdl.BARCODE_TRANSFER ? (
                                      <IoMdDoneAll size={20} color="#00a814" />
                                    ) : null}
                                  </td>
                                  <td>
                                    <Button
                                      size="sm"
                                      className="btn-transfer me-2"
                                      onClick={() => handlMdlReturn(plnz, bdl)}
                                      disabled={
                                        bdl.BARCODE_SERIAL ===
                                        bdl.BARCODE_TRANSFER
                                      }
                                    >
                                      <ImUndo2 size={16} />
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="btn-transfer"
                                      disabled={
                                        bdl.BARCODE_SERIAL ===
                                        bdl.BARCODE_TRANSFER
                                      }
                                      onClick={() =>
                                        handlMdlTfrActv(plnz, bdl, "N")
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
          ) : (
            <tr>
              <td colSpan={13} className="text-center fst-italic">
                No Data Pendding
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default TableListPendding;
