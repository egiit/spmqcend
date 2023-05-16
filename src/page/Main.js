// import { useOutletContext } from "react-router-dom";

import { Row, Col, Nav } from "react-bootstrap";
import ListPlanning from "../components/ListPlanning";
import { useContext } from "react";
import { QcEndlineContex } from "../provider/QcEndProvider";
import { _ACTION } from "../provider/QcEndAction";
import ListPlanningOt from "../components/ListPlanningOt";
import ModalUpdtHC from "../components/ModalUpdtHC";
import MainModalInput from "../components/MainModalInput";
import ModalQrForTfr from "../components/ModalQrForTfr";
import TableListPendding from "../components/TableListPendding";
import MdlAddRemark from "../components/MdlAddRemark";
import MdlMeasurement from "../components/MdlMeasurement";
import MdlConfReturn from "../components/MdlConfReturn";
import { flash } from "react-universal-flash";
import LisPlanningExtOt from "../components/LisPlanningExtOt";

const Main = () => {
  const {
    state,
    dispatch,
    planSizeSelected,
    handleAddRemark,
    mdlMasurement,
    measCkCountRfrs,
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
  function handleSelPlanSize(bundleQr, type, SCHD) {
    if (bundleQr.RETURN_COUNT)
      return flash(
        `You Have ${bundleQr.RETURN_COUNT} Box Return, Please Confirm To Preparation`,
        4000,
        "warning"
      );

    const databundle = { ...bundleQr, type: type };
    planSizeSelected(databundle, SCHD);
  }

  function viewQrList(planz) {
    const getPlanzunix = planz.SCHD_ID + planz.ORDER_SIZE;
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
              <Nav.Link className="" eventKey="normal">
                Normal
              </Nav.Link>
            </Nav.Item>
            <Nav.Item onClick={() => handleTabs("ot")}>
              <Nav.Link className="" eventKey="ot">
                Over Time
              </Nav.Link>
            </Nav.Item>
            <Nav.Item onClick={() => handleTabs("extOt")}>
              <Nav.Link className="" eventKey="extOt">
                Extra OT
              </Nav.Link>
            </Nav.Item>
            <Nav.Item onClick={() => handleTabs("pendding")}>
              <Nav.Link className="" eventKey="pendding">
                List Pendding
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {state.activeTab === "normal" ? (
            <div>
              <div className="bg-primary text-center my-1 fw-bold fs-5 text-light">
                Normal Time
              </div>
              <ListPlanning
                selectHc={selectHc}
                handleSelPlanSize={handleSelPlanSize}
                viewQrList={viewQrList}
                openMdlRemark={openMdlRemark}
              />
            </div>
          ) : null}
          {state.activeTab === "ot" ? (
            <div>
              <div className="bg-warning text-center my-1 fw-bold fs-5 ">
                Over Time
              </div>
              <ListPlanningOt
                dataDailyPlan={state.dataDailyPlan}
                selectHc={selectHc}
                handleSelPlanSize={handleSelPlanSize}
                viewQrList={viewQrList}
                openMdlRemark={openMdlRemark}
              />
            </div>
          ) : null}
          {state.activeTab === "extOt" ? (
            <div>
              <div className="bg-danger text-center my-1 fw-bold fs-5 text-light">
                Extra Over Time
              </div>
              <LisPlanningExtOt
                dataDailyPlan={state.dataDailyPlan}
                selectHc={selectHc}
                handleSelPlanSize={handleSelPlanSize}
                viewQrList={viewQrList}
                openMdlRemark={openMdlRemark}
              />
            </div>
          ) : null}
          {state.activeTab === "pendding" ? (
            <TableListPendding viewQrList={viewQrList} />
          ) : null}
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
    </>
  );
};

export default Main;
