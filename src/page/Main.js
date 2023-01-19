import { useOutletContext } from "react-router-dom";

import { Row, Col, Nav } from "react-bootstrap";
import ListPlanning from "../components/ListPlanning";
import TitleHeaderScan from "../components/TitleHeaderScan";
import { useContext } from "react";
import { QcEndlineContex } from "../provider/QcEndProvider";
import { _ACTION } from "../provider/QcEndAction";
import ListPlanningOt from "../components/ListPlanningOt";
const Main = () => {
  const { state, dispatch } = useContext(QcEndlineContex);
  const { handleShow } = useOutletContext();

  function handleTabs(tab) {
    dispatch({
      type: _ACTION._SET_TAB_ACTIVE,
      payload: tab,
    });
  }

  function filterOtSch(plan) {
    if (plan.length) {
      return plan.filter((sch) => sch.PLAN_TARGET_OT !== null);
    }
    return plan;
  }

  return (
    <>
      <TitleHeaderScan handleShow={handleShow} />
      {/* <TitleHeaderScan /> */}
      <Row className="row-main">
        <Col className="">
          <Nav
            variant="tabs"
            defaultActiveKey={state.activeTab}
            className="mt-3 mb-0 border-bottom border-secondary border-opacity-50"
          >
            <Nav.Item>
              <Nav.Link
                className="py-1"
                eventKey="normal"
                onClick={() => handleTabs("normal")}
              >
                Normal
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                className="py-1"
                eventKey="ot"
                onClick={() => handleTabs("ot")}
              >
                Over Time
              </Nav.Link>
            </Nav.Item>
          </Nav>
          {state.activeTab === "normal" ? (
            <ListPlanning />
          ) : (
            <ListPlanningOt dataDailyPlan={filterOtSch(state.dataDailyPlan)} />
          )}
        </Col>
      </Row>
    </>
  );
};

export default Main;
