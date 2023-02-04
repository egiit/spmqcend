import React, { useState, useContext } from "react";
import { Row, Col, Card, Button, InputGroup, Form } from "react-bootstrap";
// import { GiBackwardTime } from 'react-icons/gi';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { QcEndlineContex } from "../../provider/QcEndProvider";
import { flash } from "react-universal-flash";

const PartAndDefectChoice = ({ type }) => {
  const { state, handlePageActive, postOutput } = useContext(QcEndlineContex);
  const [partSelected, setPartSelected] = useState("");
  const [defectSelected, setDefectSelected] = useState("");
  const [queryPart, setQueryPart] = useState("");
  const [queryDefect, setQueryDefect] = useState("");

  //function handleset part
  function handleSetPart(id) {
    setPartSelected(id);
  }
  //function handleset defect
  function handleSetDefect(id) {
    setDefectSelected(id);
  }
  //function for split prat list
  function filterStartEnd(listPart, seq) {
    if (listPart.length > 10) {
      const endIdx1 = listPart.length / 2 + 1;
      if (seq === 1) {
        const newpart = listPart.filter((parts, i) => i + 1 <= endIdx1);
        return partList(searchPart(newpart));
      }
      if (seq === 2 && endIdx1 !== listPart.length) {
        const newpart = listPart.filter((parts, i) => i + 1 > endIdx1);
        return partList(searchPart(newpart));
      }

      return [];
    }
    return listPart;
  }

  //function component partlist
  const partList = (listpart) => {
    if (listpart.length !== 0)
      return listpart.map((part, i) => (
        <InputGroup
          key={i}
          className="mb-2"
          onClick={() => handleSetPart(part.PART_CODE)}
        >
          <InputGroup.Checkbox
            aria-label="Checkbox for List Part"
            checked={partSelected === part.PART_CODE}
            onChange={(e) => handleSetPart(part.PART_CODE)}
          />
          <InputGroup.Text style={{ fontSize: "12px" }}>
            {part.PART_CODE}
          </InputGroup.Text>
          <InputGroup.Text style={{ fontSize: "12px" }}>
            {part.PART_NAME}
          </InputGroup.Text>
        </InputGroup>
      ));
  };

  function handlePutQueryPart(e) {
    const { value } = e.target;
    setQueryPart(value);
  }

  function handlePutQueryDefect(e) {
    const { value } = e.target;
    setQueryDefect(value);
  }

  //function search part
  function searchPart(rows) {
    if (rows.length === 0) {
      return rows;
    }

    if (queryPart !== "") {
      const newRow = [...rows];
      return newRow.filter(
        (row) =>
          row.PART_CODE.toLowerCase().indexOf(queryPart.toLowerCase()) > -1 ||
          row.PART_NAME.toLowerCase().indexOf(queryPart.toLowerCase()) > -1
      );
    }

    return rows;
  }
  //function search Defect
  function searchDefect(rows) {
    if (rows.length === 0) {
      return rows;
    }

    if (queryDefect !== "") {
      const newRow = [...rows];
      return newRow.filter(
        (row) =>
          row.DEFECT_SEW_CODE.toString().indexOf(queryDefect.toLowerCase()) >
            -1 ||
          row.DEFECT_NAME.toLowerCase().indexOf(queryDefect.toLowerCase()) > -1
      );
    }

    return rows;
  }

  function handlePost() {
    if (defectSelected === "" || partSelected === "")
      return flash("Please Select Part And Issue!", 2000, "danger");
    const dataPost = {
      ENDLINE_DEFECT_CODE: defectSelected,
      ENDLINE_PART_CODE: partSelected,
    };
    postOutput(type, dataPost);
    setPartSelected("");
    setDefectSelected("");
  }

  return (
    <div className="pt-2">
      <Row>
        <Col sm={6}>
          <Card className="border-0 shadow">
            <Card.Body className="py-1">
              <div className="fw-bold mb-3 border-bottom">
                <Row>
                  <Col className={type === "BS" ? "text-danger" : null}>
                    {type} Part
                  </Col>
                  <Col className="mb-1">
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder="Find Code Part/Part Name"
                      onChange={handlePutQueryPart}
                    />
                  </Col>
                </Row>
              </div>
              <div
                style={{ height: "78vh", overflowY: "scroll" }}
                className="px-3"
              >
                <Row className="">
                  <Col className="p-0">{filterStartEnd(state.listPart, 1)}</Col>
                  {state.listPart.length > 10 ? (
                    <Col sm={5} className="p-0">
                      {filterStartEnd(state.listPart, 2)}
                    </Col>
                  ) : null}
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="border-0 shadow">
            <Card.Body className="py-1">
              <div className="fw-bold mb-3 border-bottom">
                <Row>
                  <Col className={type === "BS" ? "text-danger" : null}>
                    {type} Issue
                  </Col>
                  <Col className="mb-1">
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder="Find Code Defect/Defect Name"
                      onChange={handlePutQueryDefect}
                    />
                  </Col>
                </Row>
              </div>
              <div style={{ height: "78vh", overflowY: "scroll" }}>
                {searchDefect(state.listDefect).length !== 0
                  ? searchDefect(state.listDefect).map((def, i) => (
                      <InputGroup
                        key={i}
                        onClick={() => handleSetDefect(def.DEFECT_SEW_CODE)}
                        className="mb-2"
                      >
                        <InputGroup.Checkbox
                          aria-label="Checkbox for List Proccess"
                          checked={defectSelected === def.DEFECT_SEW_CODE}
                          onChange={(e) => handleSetDefect(def.DEFECT_SEW_CODE)}
                        />
                        <InputGroup.Text
                          // id={def.DEFECT_CODE}
                          style={{ fontSize: "12px" }}
                        >
                          {def.DEFECT_SEW_CODE}
                        </InputGroup.Text>
                        <InputGroup.Text
                          // id={def.DEFECT_CODE}
                          style={{ fontSize: "12px" }}
                        >
                          {def.DEFECT_NAME}
                        </InputGroup.Text>
                      </InputGroup>
                    ))
                  : ""}
              </div>
            </Card.Body>
          </Card>
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
            disabled={defectSelected === "" || partSelected === ""}
            onClick={() => handlePost()}
          >
            <span>Save</span> <IoIosArrowForward size={20} />
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default PartAndDefectChoice;
