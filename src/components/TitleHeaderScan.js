// import moment from "moment";
import { useContext, useState } from "react";
import { Row, Col, NavDropdown } from "react-bootstrap";
import useInterval from "use-interval";
import { BiRefresh } from "react-icons/bi";
import LogoSumbiri from "../asset/logos.png";
import { QcEndlineContex } from "../provider/QcEndProvider";

const TitleHeaderScan = ({ handleShow }) => {
  const { qcName, qcType, siteName, lineName, shift } =
    useContext(QcEndlineContex);
  let time = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  const [currentTime, setCurrentTime] = useState(time);

  const updateTime = () => {
    let time = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    setCurrentTime(time);
  };

  useInterval(() => {
    updateTime();
  }, 1000);

  return (
    <Row className="m-0 title-header shadow">
      <Col sm={1} className="text-center pt-2">
        <img
          src={LogoSumbiri}
          alt="sumbiri"
          style={{ widht: "120px", height: "35px" }}
        ></img>
      </Col>
      <Col
        sm={3}
        className="d-none d-sm-block text-center text border-end border-3 border-info"
      >
        <div className="fw-bold">
          {currentTime}
          <div
            className="spinner-grow spinner-grow-sm text-primary"
            role="status"
          >
            {/* <span class="visually-hidden">Loading...</span> */}
          </div>
        </div>
        <div style={{ fontSize: "0.9rem" }}>
          {new Date().toLocaleString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </Col>
      <Col sm={2} className="border-end border-3 border-info">
        <p className="text fs-5 fw-bold mb-0">QC {qcType}</p>
        <p className="text fs-6 fw-bold mb-0">Inspection</p>
      </Col>
      <Col onClick={() => handleShow()}>
        <p className="text  fw-bold mb-0">{shift}</p>
        <p className="text  fw-bold mb-0">{qcName}</p>
      </Col>
      <Col
        sm={3}
        className="text-center fs-4 fw-bold pt-2 text-light styleBgsite"
      >
        <NavDropdown
          className="ps-0"
          id="nav-dropdown-line"
          title={`${siteName} - ${lineName}`}
          // title={siteActive}
          // onSelect={handleSiteSelect}
        >
          {/* {listSite.map((site, i) => (
            <NavDropdown.Item key={i} eventKey={site.SITE_NAME}>
              {site.SITE_NAME}
            </NavDropdown.Item>
          ))} */}
        </NavDropdown>
      </Col>
      <Col sm={1} className="pe-0 me-0 text-center">
        <BiRefresh size={45} color="blue" style={{ cursor: "pointer" }} />
      </Col>
    </Row>
  );
};

export default TitleHeaderScan;
