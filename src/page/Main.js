// import { useOutletContext } from "react-router-dom";

import { Row, Col, Nav } from "react-bootstrap";
import ListPlanning from "../components/ListPlanning";
import { useContext } from "react";
import { QcEndlineContex } from "../provider/QcEndProvider";
import { _ACTION } from "../provider/QcEndAction";
// import ListPlanningOt from "../components/ListPlanningOt";
import ModalUpdtHC from "../components/ModalUpdtHC";
import MainModalInput from "../components/MainModalInput";
import ModalQrForTfr from "../components/ModalQrForTfr";
import TableListPendding from "../components/TableListPendding";
import MdlAddRemark from "../components/MdlAddRemark";
import MdlMeasurement from "../components/MdlMeasurement";
import MdlConfReturn from "../components/MdlConfReturn";
import { flash } from "react-universal-flash";
import axios from "../axios/axios";
import MdlDetailQr from "../components/MdlDetailQr";
// import LisPlanningExtOt from "../components/LisPlanningExtOt";

const Main = () => {
  const {
    state,
    dispatch,
    qrSelected,
    handleAddRemark,
    mdlMasurement,
    measCkCountRfrs,
    refrehAll,
  } = useContext(QcEndlineContex);
  // const { handleShow } = useOutletContext();

  //fucntion change tab
  function handleTabs(tab) {
    dispatch({
      type: _ACTION._SET_TAB_ACTIVE,
      payload: tab,
    });
  }

  //function for filter data only OT in tabs ot
  // function filterOtSch(plan) {
  //   if (plan.length) {
  //     return plan.filter((sch) => sch.PLAN_TARGET_OT !== null);
  //   }
  //   return plan;
  // }

  //function for active Modal HC
  function handleMdlHc() {
    dispatch({
      type: _ACTION._SET_MDL_HC,
      payload: true,
    });
  }
  //function for diactive Modal HC
  function handleMdlHcClose() {
    dispatch({
      type: _ACTION._SET_MDL_HC,
      payload: false,
    });
  }

  //function for diactive Modal Remark
  function handleMdlRmkClose() {
    dispatch({
      type: _ACTION._SET_MDL_REMARK,
      payload: false,
    });
    dispatch({
      type: _ACTION._SET_PLAN_REMARK,
      payload: { data: {} },
    });
  }

  // function set dataHCSelect
  function selectHc(data, type) {
    const dataWithType = { ...data, type: type };
    dispatch({
      type: _ACTION._SET_DATA_HC,
      payload: { data: dataWithType },
    });
    handleMdlHc();
  }

  //function for select bundle
  async function handleSelPlanSize(bundleQr, type, SCHD) {
    // console.log({ bundleQr, type, SCHD });
    if (bundleQr.RETURN_STATUS)
      return flash(
        `Box ini telah return, Mohon konfirmasi ke Preparation`,
        4000,
        "warning"
      );

    //check jika schedule(SCHD_ID) daily tidak dihapus adm produksi
    await axios
      .get(`/qc-endline/check-schedule/${SCHD.SCHD_ID}`)
      .then((res) => {
        if (res.data.existSchedule) {
          const databundle = {
            ...bundleQr,
            type: type,
            ORDER_STYLE: SCHD.ORDER_STYLE_DESCRIPTION,
          };
          qrSelected(databundle, SCHD);
        } else {
          flash(
            `Schedule Telah diperbaharui Adm Produksi System akan melakukan syncronize data terbaru`,
            4000,
            "warning"
          );
          return refrehAll();
        }
      })
      .catch((err) => {
        flash(`Error saat melakukan pengecekan schedule daily`, 4000, "danger");
      });
  }

  function viewQrList(planz) {
    const getPlanzunix = `${planz.SCH_ID}${planz.SIZE_CODE}`;
    const trlisqr = document.getElementsByClassName(getPlanzunix)[0];
    trlisqr.classList.toggle("shows");
  }

  //function open modal remark
  function openMdlRemark(plan) {
    dispatch({
      type: _ACTION._SET_PLAN_REMARK,
      payload: { data: plan },
    });
    dispatch({
      type: _ACTION._SET_MDL_REMARK,
      payload: true,
    });
  }

  function handleCloseMeas() {
    measCkCountRfrs();
    mdlMasurement(false);
    dispatch({
      type: _ACTION._GET_MEASUREMENT_SPECT,
      payload: { data: [] },
    });
    dispatch({
      type: _ACTION._GET_MEASUREMENT_SPECT,
      payload: { data: {} },
    });
  }
  return (
    <>
      {/* <TitleHeaderScan handleShow={handleShow} /> */}

      <Row className="row-main">
        <Col className="">
          <Nav
            variant="tabs"
            defaultActiveKey={state.activeTab}
            className="mt-3 mb-0 border-bottom border-secondary border-opacity-50"
          >
            <Nav.Item onClick={() => handleTabs("normal")}>
              <Nav.Link className="py-1" eventKey="normal">
                Normal
              </Nav.Link>
            </Nav.Item>
            <Nav.Item onClick={() => handleTabs("ot")}>
              <Nav.Link className="py-1" eventKey="ot">
                Over Time
              </Nav.Link>
            </Nav.Item>
            <Nav.Item onClick={() => handleTabs("extOt")}>
              <Nav.Link className="py-1" eventKey="extOt">
                Extra OT
              </Nav.Link>
            </Nav.Item>
            <Nav.Item onClick={() => handleTabs("pendding")}>
              <Nav.Link className="py-1" eventKey="pendding">
                List Pendding
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {state.activeTab === "normal" ? (
            <div>
              <div className="styleBgsite text-center my-1 fw-bold fs-5">
                Normal Time
              </div>
              <ListPlanning
                selectHc={selectHc}
                handleSelPlanSize={handleSelPlanSize}
                viewQrList={viewQrList}
                openMdlRemark={openMdlRemark}
                prodType={"normal"}
              />
            </div>
          ) : null}
          {state.activeTab === "ot" ? (
            <div>
              <div className="styleBgOt text-center my-1 fw-bold fs-5 ">
                Over Time
              </div>
              <ListPlanning
                selectHc={selectHc}
                handleSelPlanSize={handleSelPlanSize}
                viewQrList={viewQrList}
                openMdlRemark={openMdlRemark}
                prodType={"ot"}
              />
            </div>
          ) : null}
          {state.activeTab === "extOt" ? (
            <div>
              <div className="bg-danger text-center my-1 fw-bold fs-5 text-light">
                Extra Over Time
              </div>
              <ListPlanning
                selectHc={selectHc}
                handleSelPlanSize={handleSelPlanSize}
                viewQrList={viewQrList}
                openMdlRemark={openMdlRemark}
                prodType={"extOt"}
              />
            </div>
          ) : null}
          {state.activeTab === "pendding" ? <TableListPendding /> : null}
        </Col>
      </Row>
      {state.mdlHC ? <ModalUpdtHC handleClose={handleMdlHcClose} /> : null}
      {state.mdlInput ? <MainModalInput /> : null}
      {state.mdlTfr ? <ModalQrForTfr /> : null}
      {state.mdlConfirReturn ? <MdlConfReturn /> : null}
      {state.mdlRemark ? (
        <MdlAddRemark
          show={state.mdlRemark}
          plan={state.planForRemark}
          handleClose={handleMdlRmkClose}
          typeProd={state.activeTab}
          handleAddRemark={handleAddRemark}
        />
      ) : null}
      {state.mdlMeas ? <MdlMeasurement handleClose={handleCloseMeas} /> : null}
      {state.mdlDetailQr ? <MdlDetailQr /> : null}
    </>
  );
};

export default Main;
