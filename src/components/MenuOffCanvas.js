import { useContext } from "react";
import { Row, Col, Button, Offcanvas } from "react-bootstrap";
import { GrRefresh, GrLogout } from "react-icons/gr";
import { QcEndlineContex } from "../provider/QcEndProvider";

const MenuOffCanvas = ({ show, handleClose, logout }) => {
  const { refrehAll } = useContext(QcEndlineContex);
  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton className="pb-1">
        <Offcanvas.Title>SPM-QC End Line</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="pt-1 vh-100">
        <div className="d-grid">
          <Button variant="secondary" onClick={() => refrehAll()}>
            Refresh <GrRefresh size={20} />
          </Button>
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
