import { useState } from "react";
import { Button, Table, Row, Col, Form } from "react-bootstrap";
// import { IoMdDoneAll } from "react-icons/io";
// import { GiCheckMark } from "react-icons/gi";
// import { RiFileEditFill } from "react-icons/ri";
// import { BsViewList } from "react-icons/bs";
import React, { useContext } from "react";
import { QcEndlineContex } from "../provider/QcEndProvider";
// import { ImUndo2 } from "react-icons/im";
// import { TbArrowsSplit } from "react-icons/tb";
// import CheckNilai from "../partial/CheckNilai";
import { totalCol } from "../partial/TotalCol";
import { MdOutlineViewCarousel } from "react-icons/md";

const TableListPendding = () => {
  const { state, hdlOpnMdlQrDetail } = useContext(QcEndlineContex);
  const [query, setQuery] = useState({});

  function handleFilter(e, key) {
    const { value } = e.target;
    let dataFilter = { ...query };
    // jika arr typehead kosong retun array kosong
    if (value === "") {
      // delete datafilter
      delete dataFilter[key];
      setQuery(dataFilter);
    } else {
      dataFilter[key] = value;
      setQuery(dataFilter);
    }
  }
  // function checkStatus(qty, checked) {
  //   if (checked) {
  //     if (checked === qty) return <GiCheckMark size={20} color="#00a814" />;
  //     if (checked !== qty) return <IoMdTimer size={20} color="#fcba03" />;
  //   }
  //   return null;
  // }

  // function checkTfr(bdl) {
  //   if (parseInt(bdl.TRANSFER_QTY) === bdl.ORDER_QTY) {
  //     return <IoMdDoneAll size={20} color="#00a814" />;
  //   } else {
  //     if (bdl.COUNT_SPLIT) return <TbArrowsSplit size={22} color="#A30000" />;
  //     return null;
  //   }
  // }

  //function filter data
  function filterData(data, filters) {
    const qrpen = [...data];
    if (qrpen.length === 0) return [];

    return qrpen.filter((obj) => {
      for (let key in filters) {
        const filterValue = filters[key];
        const objValue = obj[key];

        if (Array.isArray(filterValue)) {
          if (
            !Array.isArray(objValue) ||
            !objValue.some((item) => filterValue.includes(item))
          ) {
            return false;
          }
        } else if (
          typeof filterValue === "string" &&
          typeof objValue === "string"
        ) {
          if (!objValue.toLowerCase().includes(filterValue.toLowerCase())) {
            return false;
          }
        } else {
          if (objValue !== filterValue) {
            return false;
          }
        }
      }
      return true;
    });
  }

  return (
    <div className="mt-2 list-table-pending">
      <Row>
        <Col></Col>
      </Row>
      <Table size="sm" bordered hover className="tbl-qc-detail">
        <thead>
          <tr className="table-light text-center row-header-size">
            <th>BOX NO</th>
            <th>SCANIN DATE</th>
            <th>QR SERIAL</th>
            <th>ORDER REF</th>
            <th>COLOR</th>
            <th>SIZE</th>
            <th>QTY</th>
            {/* <th>SCH DATE</th> */}
            {/* <th>CHECK</th>
            <th>GOOD</th>
            <th>DEFECT/BS</th> */}
            {/* <th>REPAIRED</th> */}
            {/* <th>BS</th> */}
            {/* <th>BALANCE</th> */}
            {/* <th>STATUS</th> */}
            {/* <th>MEAS</th> */}
            <th>TFR QTY</th>
            {/*<th>TFR STATUS</th> */}
            <th>VIEW</th>
          </tr>
          <tr className="table-light text-center align-middle">
            <th style={{ maxWidth: "50px" }}>
              <Form.Control
                size="sm"
                type="text"
                onChange={(val) => {
                  handleFilter(val, "BUNDLE_SEQUENCE");
                }}
                // placeholder="Box No"
              />
            </th>
            <th style={{ maxWidth: "80px" }}>
              <Form.Control
                size="sm"
                type="text"
                onChange={(val) => {
                  handleFilter(val, "SCAN_DATE");
                }}
              />
            </th>
            <th style={{ maxWidth: "80px" }}>
              <Form.Control
                size="sm"
                type="text"
                onChange={(val) => {
                  handleFilter(val, "BARCODE_SERIAL");
                }}
              />
            </th>
            <th>
              <Form.Control
                size="sm"
                type="text"
                onChange={(val) => {
                  handleFilter(val, "ORDER_REFERENCE_PO_NO");
                }}
              />
            </th>
            <th>
              <Form.Control
                size="sm"
                type="text"
                onChange={(val) => {
                  handleFilter(val, "ITEM_COLOR_NAME");
                }}
              />
            </th>
            <th style={{ maxWidth: "50px" }}>
              <Form.Control
                size="sm"
                type="text"
                onChange={(val) => {
                  handleFilter(val, "ORDER_SIZE");
                }}
              />
            </th>
            <th>
              {totalCol(
                filterData(state.dataPlanBySizePend, query),
                "ORDER_QTY"
              )}
            </th>
            {/* <th>
              {totalCol(
                filterData(state.dataPlanBySizePend, query),
                "TOTAL_CHECKED"
              )}
            </th>
            <th>
              {totalCol(filterData(state.dataPlanBySizePend, query), "GOOD")}
            </th>
            <th>
              {totalCol(
                filterData(state.dataPlanBySizePend, query),
                "DEFECT_BS"
              )}
            </th>
            <th>
              {totalCol(filterData(state.dataPlanBySizePend, query), "BALANCE")}
            </th> */}
            <th>
              {totalCol(
                filterData(state.dataPlanBySizePend, query),
                "TRANSFER_QTY"
              )}
            </th>
            {/* <th></th> */}
            <th></th>
          </tr>
        </thead>
        <tbody className=" align-middle">
          {state.dataPlanBySizePend.length !== 0 ? (
            filterData(state.dataPlanBySizePend, query).map((bdl, i) => (
              <tr key={i} className="text-center">
                <td>{bdl.BUNDLE_SEQUENCE}</td>
                <td>{bdl.SCAN_DATE}</td>
                <td>{bdl.BARCODE_SERIAL}</td>
                <td>{bdl.ORDER_REFERENCE_PO_NO}</td>
                <td>{bdl.ITEM_COLOR_NAME}</td>
                <td>{bdl.ORDER_SIZE}</td>
                <td>{bdl.ORDER_QTY}</td>
                {/* <td>{bdl.TOTAL_CHECKED}</td>
                <td>{bdl.GOOD}</td>
                <td>{bdl.DEFECT_BS}</td>
                <td>{bdl.BALANCE}</td> */}
                {/* <td>{bdl.SCHD_PROD_DATE}</td> */}
                {/* <td>
                  {measCountVal(state.measCheckCount, bdl.BARCODE_SERIAL)}
                </td> */}
                <td>{bdl.TRANSFER_QTY}</td>
                {/* <td>{checkTfr(bdl)}</td> */}
                <td>
                  {/* <Button
                    size="sm"
                    className="btn-transfer me-2"
                    disabled={bdl.TOTAL_CHECKED !== "0"}
                    onClick={() => handlMdlReturn(bdl)}
                  >
                    <ImUndo2 size={16} />
                  </Button> */}
                  {/* <Button
                      size="sm"
                      variant="outline-secondary"
                      className="me-2"
                      disabled={bdl.BAL_TRANSFER === "0"}
                      onClick={() => getSpectList(bdl, plan)}
                    >
                      <FcRuler size={16} />
                    </Button> */}
                  <Button
                    size="sm"
                    // className="btn-transfer"
                    // disabled={
                    //   CheckNilai(bdl.BAL_TRANSFER) < 1 ||
                    //   bdl.RETURN_STATUS !== null
                    // }
                    // onClick={() => handlMdlTfrActv(bdl)}
                    onClick={() => hdlOpnMdlQrDetail(bdl)}
                  >
                    <MdOutlineViewCarousel size={16} />
                  </Button>
                </td>
              </tr>
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
