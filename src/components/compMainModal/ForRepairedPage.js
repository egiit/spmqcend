import { useState } from "react";
import { useContext } from "react";
import { Row, Col, Button, ListGroup } from "react-bootstrap";
import { BsCheckLg } from "react-icons/bs";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { QcEndlineContex } from "../../provider/QcEndProvider";

const ForRepairedPage = () => {
  const { state, handlePageActive, proccessRepaird } =
    useContext(QcEndlineContex);
  const [defSel, setDefSel] = useState([]);

  function selectDefList(def) {
    const boxsel = document.getElementById(def.ENDLINE_OUT_ID);
    boxsel.classList.toggle("selected");

    //jika  defsel memiliki length
    if (defSel.length > 0) {
      //buat array id endline out
      const listID = defSel.map((ids) => ids.ENDLINE_OUT_ID);
      //cek jika terdapat idnya maka remove
      if (listID.includes(def.ENDLINE_OUT_ID)) {
        const newDefSel = defSel.filter(
          (deflist) => deflist.ENDLINE_OUT_ID !== def.ENDLINE_OUT_ID
        );
        return setDefSel(newDefSel);
      }
      const newDefSel = [...defSel, def];
      return setDefSel(newDefSel);
    }
    return setDefSel([def]);
  }

  return (
    <div>
      <Row className="">
        <Col className="border-1 border p-2 mx-2 shadow-sm">
          <div className="fw-bold mb-2 border text-center bg-primary text-light">
            DEFECTIVIES LIST TO RECTIFIED
          </div>
          <div style={{ height: "82vh", overflow: "scroll" }}>
            <ul className="list-group">
              {state.dataDefectForRep
                ? state.dataDefectForRep.map((def, i) => (
                    <li key={i} className="list-group-item">
                      <Row>
                        <Col sm={1} className="pt-3">
                          <div
                            className="def-checked"
                            id={def.ENDLINE_OUT_ID}
                            onClick={() => selectDefList(def)}
                          >
                            <BsCheckLg
                              size={20}
                              color="white"
                              className="ms-1 mt-1"
                            />
                          </div>
                        </Col>
                        <Col>
                          <Row>
                            <Col>
                              <div className="fw-bold">
                                {def.PART_NAME} - {def.DEFECT_NAME}
                              </div>
                              <div className="">
                                <ListGroup horizontal>
                                  <ListGroup.Item className="py-1">
                                    Add Time :{" "}
                                  </ListGroup.Item>
                                  <ListGroup.Item className="py-1">
                                    {def.ADD_DATE}
                                  </ListGroup.Item>
                                  <ListGroup.Item className="py-1">
                                    {def.ENDLINE_TIME}
                                  </ListGroup.Item>
                                </ListGroup>
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </Col>
      </Row>
      <Row className="align-items-baseline justify-content-between mt-2">
        <Col sm={2} className="text-start">
          <Button
            className="me-2"
            variant="primary"
            onClick={() => handlePageActive("")}
          >
            <IoIosArrowBack size={20} /> <span>Back</span>
          </Button>
        </Col>
        <Col sm={2} className="text-end">
          <Button
            variant="primary"
            disabled={defSel.length === 0}
            onClick={() => proccessRepaird(defSel)}
          >
            <span>Next</span> <IoIosArrowForward size={20} />
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ForRepairedPage;
