import { useContext } from "react";
import { Row, Col, Button, Offcanvas } from "react-bootstrap";
import { GrRefresh, GrLogout } from "react-icons/gr";
import { QcEndlineContex } from "../provider/QcEndProvider";
import { useNavigate } from "react-router-dom";
import axios from "../axios/axios";
import { _ACTION } from "../provider/QcEndAction";
import { flash } from "react-universal-flash";

const MenuOffCanvas = ({ show, handleClose, logout }) => {
  const { refrehAll, state, idSiteLine, dispatch } =
    useContext(QcEndlineContex);
  const navigate = useNavigate();

  const handleNavigate = (e, link) => {
    e.stopPropagation();
    navigate(link);
    handleClose();
  };

  const refreshd = (e, link) => {
    refrehAll();
    handleClose();
  };

  const handleOpenReport = async (e) => {
    handleNavigate(e, "/reporting");
    await axios
      .get(`/qc/report/sum-per-hour-tablet/${state.date}/${idSiteLine}`)
      .then((res) => {
        if (res.status === 200) {
          dispatch({
            type: _ACTION._GET_REP_PER_HOURLY,
            payload: { data: res.data.data },
          });
        }
      })
      .catch((err) => flash(err.message, 2000, "danger"));

    await axios
      .get(`/qc/report/sum-part-def-tablet/${state.date}/${idSiteLine}`)
      .then((res) => {
        if (res.status === 200) {
          dispatch({
            type: _ACTION._GET_REP_DET_HOUR_DEF,
            payload: { data: res.data.data },
          });
        }
      })
      .catch((err) => flash(err.message, 2000, "danger"));
    handleClose();
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton className="pb-1">
        <Offcanvas.Title>SUMMIT-QC End Line</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="pt-1">
        <div className="d-grid">
          <Button variant="secondary" onClick={() => refreshd()}>
            Refresh <GrRefresh size={20} />
          </Button>
        </div>
        <div className="mt-3 div-contain-menu p-2">
          <div className="text-center fw-bold mb-2">MENU</div>
          <div className="d-grid gap-2 border rounded bg-light px-1 py-2">
            <Button
              variant="primary"
              onClick={(e) => handleNavigate(e, "maininput")}
            >
              Main Input
            </Button>
            <Button variant="success" onClick={(e) => handleOpenReport(e)}>
              Reporting
            </Button>
            <Button variant="secondary" onClick={() => console.log()}>
              Input Log
            </Button>
          </div>
        </div>
        <div className="d-grid mt-2">
          <Button variant="warning" onClick={() => logout()}>
            logout <GrLogout size={20} />
          </Button>
        </div>
        <Row>
          <Col></Col>
        </Row>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default MenuOffCanvas;
