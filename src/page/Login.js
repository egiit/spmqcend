import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Form, Button } from "react-bootstrap";
import axios from "../axios/axios.js";
import logo from "../asset/logos.png";
import bckg from "../asset/backgroundlogin.jpg";
// import bgcolor from "../asset/bgcolor.jpg";
import "../styles/Login.css";
// import jwtDecode from "jwt-decode";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  // const location = useLocation();

  useEffect(() => {
    const cekLogin = async () => {
      return await axios
        .get("/tokenQc")
        .then((response) => {
          // const decode = jwtDecode(response.data.accessToken);

          // if (decode.userPath) {
          //   return navigate(decode.userPath);
          // }
          navigate("/maininput");
        })
        .catch((error) => {
          if (error.response) return "";
        });
    };
    cekLogin();
  }, [navigate]);

  const onChangeUsername = (e) => {
    const value = e.target.value;
    setUsername(value.toLowerCase());
  };

  const onChangePassword = (e) => {
    const value = e.target.value;
    setPassword(value);
  };

  const Auth = async (e) => {
    try {
      e.preventDefault();
      await axios
        .post("/loginqc13", {
          QC_USERNAME: username,
          QC_USER_PASSWORD: password,
        })
        .then((response) => {
          // const decode = jwtDecode(response.data.accessToken);

          // if (decode.userPath) {
          //   return navigate(decode.userPath);
          // }
          // if (decode.userLevel === "ADM") return navigate("/sewingoutput");
          // if (decode.userLevel === "LBO") return navigate("/qc-lbo");
          navigate("/maininput");
        });
    } catch (error) {
      if (error.message === "Network Error")
        return setMsg(`${error.message}, Please Contact Your Administrator`);
      if (error.response) return setMsg(error.response.data.message);
    }
  };

  return (
    <section className="login-body">
      <Row
        className="m-0 p-0"
        style={{
          height: "111vh",
          backgroundImage: `url(${bckg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Col style={{ height: "111vh" }}>
          <Row className="d-flex align-items-center justify-content-center h-80 mt-3 mt-lg-5">
            <Col className="col-10 col-md-8 col-xl-6 h-100 mt-1 mt-lg-5">
              <Row className="rounded-3 bg-light p-0 shadow cards-form">
                <Col className="cards-logo py-md-4  d-none d-md-block ">
                  <div className="d-block text-center my-md-4 mt-xl-5 ">
                    <img
                      className="img-fluid"
                      style={{ width: "16rem" }}
                      src={logo}
                      alt=""
                    />
                  </div>
                  <div className="bg-secondary shadow-sm rounded bg-opacity-10 p-2 mx-2">
                    <h1 className="text-center fst-italic fs-3 font-weight-light">
                      SUMMIT
                    </h1>
                    <h2 className="text-center fst-italic fs-5 font-weight-light mb-3">
                      (Sumbiri Management IT System)
                    </h2>
                  </div>
                  <div className="text-center text-muted fst-italic font-weight-light mt-5 text-version">
                    Version 1.3
                  </div>
                </Col>
                <Col className="cards-login rounded-end py-5 px-3">
                  <div className="d-block d-md-none text-center mb-1">
                    <img
                      className="img-fluid"
                      style={{ width: "12rem" }}
                      src={logo}
                      alt=""
                    />
                    <h3 className="text-center text-muted mt-2 fst-italic fs-6 font-weight-light">
                      SUMMIT - QC Endline Module
                    </h3>
                  </div>
                  <h2 className="text-center d-none d-md-block fst-italic fs-5 font-weight-light mt-4 mt-xl-5 mb-3">
                    QC Endline Module
                  </h2>
                  <Form onSubmit={Auth} className="px-3">
                    <Form.Floating className="mb-3">
                      <Form.Control
                        className="rounded-pill ps-3 border-0 shadow-sm"
                        name="username"
                        type="text"
                        placeholder="Username"
                        required
                        value={username}
                        onChange={onChangeUsername}
                      />
                      <Form.Label className=" ps-3 text-muted">
                        User Name
                      </Form.Label>
                    </Form.Floating>
                    <Form.Floating className="mb-3">
                      <Form.Control
                        className="rounded-pill ps-3 border-0 shadow-sm"
                        name="password"
                        type="password"
                        required
                        placeholder="*******"
                        value={password}
                        onChange={onChangePassword}
                        autoComplete="on"
                      />
                      <Form.Label className="ps-3 text-muted">
                        Password
                      </Form.Label>
                    </Form.Floating>
                    <div>
                      <p className="ps-3 fst-italic text-danger">{msg}</p>
                    </div>
                    <div className="d-grid align-items-center mt-3 mb-2">
                      <Button
                        className="rounded-pill border-0 shadow-sm fw-bold"
                        variant="secondary"
                        type="submit"
                      >
                        Login
                      </Button>
                    </div>
                  </Form>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </section>
  );
};

export default Login;
