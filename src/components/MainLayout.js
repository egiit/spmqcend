import Offcanvas from "react-bootstrap/Offcanvas";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../App.css";
// import TitleHeaderScan from "./TitleHeaderScan";
import axios from "../axios/axios";
import { Row, Col, Button } from "react-bootstrap";
// import { Message } from "../partial/Message";
import "axios-progress-bar/dist/nprogress.css";
import DeviceOrientation, { Orientation } from "react-screen-orientation";

const MainLayout = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const logout = async () => {
    await axios
      .delete("/LogoutQc")
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        // flash(error.message, 5000, "danger");
      });
  };

  return (
    <DeviceOrientation lockOrientation={"landscape"}>
      <Orientation orientation="landscape" alwaysRender={false}>
        <div className="app">
          <Outlet context={{ handleShow: handleShow }} />
        </div>
        <Offcanvas show={show} onHide={handleClose} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>SPM-QC End Line</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Row>
              <Col>
                <Button variant="warning" onClick={() => logout()}>
                  logout
                </Button>
              </Col>
            </Row>
          </Offcanvas.Body>
        </Offcanvas>
      </Orientation>
      {/* <Orientation orientation="portrait">
        <Row>
          <Col className="text-center fs-4 fw-bold">
            <p className="text-center">Please rotate your device</p>
          </Col>
        </Row>
      </Orientation> */}
    </DeviceOrientation>
  );
};

export default MainLayout;
