import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../App.css";
import DeviceOrientation, { Orientation } from "react-screen-orientation";

import axios from "../axios/axios";
import "axios-progress-bar/dist/nprogress.css";

import TitleHeaderScan from "./TitleHeaderScan";
import MenuOffCanvas from "./MenuOffCanvas";

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
    <>
      <DeviceOrientation lockOrientation={"landscape"}>
        <Orientation orientation="landscape" alwaysRender={false}>
          <div className="app">
            <TitleHeaderScan handleShow={handleShow} />
            <Outlet />
          </div>
          <MenuOffCanvas
            show={show}
            handleClose={handleClose}
            logout={logout}
          />
        </Orientation>
        {/* <Orientation orientation="portrait">
        <Row>
          <Col className="text-center fs-4 fw-bold">
            <p className="text-center">Please rotate your device</p>
          </Col>
        </Row>
      </Orientation> */}
      </DeviceOrientation>
    </>
  );
};

export default MainLayout;
