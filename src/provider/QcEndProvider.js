import { createContext, useContext, useReducer, useEffect } from "react";
import { AuthContext } from "../auth/AuthProvider";
import moment from "moment";
import axios from "../axios/axios";
import { _QCReducer } from "./QcEndReducer";
import { _ACTION } from "./QcEndAction";
import { flash } from "react-universal-flash";
import CheckNilai from "../partial/CheckNilai";
export const QcEndlineContex = createContext(null);

const intialqrqty = { BS: 0, DEFECT: 0, REPAIRED: 0, RTT: 0 };

export const QcEndProvider = ({ children }) => {
  const { value } = useContext(AuthContext);
  const { userId, qcName, qcType, siteName, lineName, shift, idSiteLine } =
    value;

  const reducer = _QCReducer;

  const initialstate = {
    date: moment().format("YYYY-MM-DD"),
    // schDate: "2023-01-27",
    schDate: moment().format("YYYY-MM-DD"),
    dataDailyPlan: [],
    dataPlanBySize: [],
    dataHCselect: [],
    dataDefectForRep: [],
    planSizeSelect: [],
    listDefect: [],
    listPart: [],
    qrQtyResult: [intialqrqty],
    siteActive: siteName,
    activeTab: "normal",
    mdlHC: false,
    pageActive: "",
    mdlInput: false,
    mdlTfr: false,
    multipleRtt: "",
    defPrev: {},
    qrForTfr: {},
    // listLine: [],
    // listResultScan: [],
    // lineActive: "",
  };

  //funct get data main planing
  async function getDailyPlanning(
    schDate,
    siteName,
    lineName,
    idSiteLine,
    shift
  ) {
    await axios
      .get(
        `/planning/planning-daily-qcend/${schDate}/${siteName}/${lineName}/${idSiteLine}/${shift}/`
      )
      .then((res) => {
        dispatch({
          type: _ACTION._GET_SCH_DAILY,
          payload: { data: res.data },
        });
      })
      .catch((err) => console.log(err));
  }

  //function get data size planning
  async function getSizePlaning(date, siteName, lineName) {
    await axios
      .get(`/qc/endline/plan-by-size/${date}/${siteName}/${lineName}`)
      .then((res) => {
        if (res.status === 200) {
          dispatch({
            type: _ACTION._GET_PLANNING_BYSIZE,
            payload: { data: res.data.data },
          });
        }
      })
      .catch((err) => console.log(err));
  }

  //get data qr bundle
  async function getQrBundle(date, siteName, lineName) {
    await axios
      .get(`/qc/endline/qr-sewing-in/${date}/${siteName}/${lineName}/%25%25`)
      .then((res) => {
        if (res.status === 200) {
          dispatch({
            type: _ACTION._GET_SCH_QR_BUNDLE,
            payload: { data: res.data.data },
          });
        }
      })
      .catch((err) => console.log(err));
  }

  //get Part list
  async function getListPart() {
    await axios.get(`/qc/part`).then((res) => {
      dispatch({
        type: _ACTION._GET_LIST_PART,
        payload: { data: res.data },
      });
    });
  }

  //get Defect code/name list
  async function getListDefect() {
    await axios.get(`/qc/defect`).then((res) => {
      dispatch({
        type: _ACTION._GET_LIST_DEFECT,
        payload: { data: res.data },
      });
    });
  }

  // declare state and dispatch
  const [state, dispatch] = useReducer(reducer, initialstate);

  const refreshPlanning = () =>
    getDailyPlanning(state.schDate, siteName, lineName, idSiteLine, shift);

  const refrehBundle = () => getQrBundle(state.schDate, siteName, lineName);

  const refrehAll = () => {
    getDailyPlanning(state.schDate, siteName, lineName, idSiteLine, shift);
    getQrBundle(state.schDate, siteName, lineName);
    getSizePlaning(state.schDate, siteName, lineName);
  };

  useEffect(() => {
    getListPart();
    getListDefect();
  }, []);

  useEffect(() => {
    getDailyPlanning(state.schDate, siteName, lineName, idSiteLine, shift);
    getQrBundle(state.schDate, siteName, lineName);
    getSizePlaning(state.schDate, siteName, lineName);
  }, [state.schDate, siteName, lineName, idSiteLine, shift]);

  //function if plan per size taped
  function planSizeSelected(planz) {
    getQrQtyResult(planz.SCHD_ID, planz.ORDER_SIZE);
    getListDefForRep(planz.SCHD_ID, planz.ORDER_SIZE);
    postPlanSize(planz);
    dispatch({
      type: _ACTION._SET_PLNZ_SELECT,
      payload: { data: planz },
    });
  }
  //function bundleUnSelect
  function planSizeUnSelected() {
    refrehAll();
    dispatch({
      type: _ACTION._SET_PLNZ_SELECT,
      payload: { data: [] },
    });
    dispatch({
      type: _ACTION._SET_MDL_INPUT,
      payload: false,
    });
    dispatch({
      type: _ACTION._SET_DEF_PAGE,
      payload: "",
    });
    dispatch({
      type: _ACTION._GET_QR_RESULT,
      payload: { data: [intialqrqty] },
    });
    dispatch({
      type: _ACTION._GET_DEF_4_REPAIRD,
      payload: { data: [] },
    });
    savePrevDef({});
  }

  //fucntion postPlanSize
  async function postPlanSize(plan) {
    const plansize = {
      ...plan,
      PLANSIZE_ADD_ID: userId,
      PLANSIZE_MOD_ID: userId,
    };
    await axios
      .post("/qc/endline/plansize", plansize)
      .then((res) => {
        if (res.status === 200) {
          dispatch({
            type: _ACTION._SET_MDL_INPUT,
            payload: true,
          });
        }
      })
      .catch((err) => flash(err.message, 2000, "danger"));
  }

  //function getQrQtyResult
  async function getQrQtyResult(schdid, size) {
    await axios
      .get(`/qc/endline/planz/${schdid}/${size}`)
      .then((res) => {
        dispatch({
          type: _ACTION._GET_QR_RESULT,
          payload: { data: res.data },
        });
      })
      .catch((err) => flash(err.message, 2000, "danger"));
  }

  //function on handlepage avtive
  function handlePageActive(page) {
    if (page === "REPAIRED") {
      if (state.dataDefectForRep.length === 0) {
        return flash("No Data For Repaird !", 2000, "danger");
      }
    }
    dispatch({
      type: _ACTION._SET_DEF_PAGE,
      payload: page,
    });
  }

  //handle postoutput on click main button
  async function postOutput(type, dataOutput) {
    const bdl = state.planSizeSelect;
    const qr = state.qrQtyResult[0];

    const dataBasic = {
      ENDLINE_PLAN_SIZE: bdl.ORDER_SIZE,
      ENDLINE_OUT_QTY: 1,
      ENDLINE_ID_SITELINE: idSiteLine,
      ENDLINE_LINE_NAME: lineName,
      ENDLINE_PORD_TYPE: bdl.type,
      ENDLINE_SCH_ID: bdl.SCH_ID,
      ENDLINE_SCHD_ID: bdl.SCHD_ID,
      ENDLINE_SCHD_DATE: bdl.SCHD_PROD_DATE,
      ENDLINE_SEQUANCE: 0,
      ENDLINE_TIME: moment().format("hh:mm:ss"),
      ENDLINE_ADD_ID: userId,
    };

    const qtyPush = parseInt(qr.TOTAL_CHECK) + dataBasic.ENDLINE_OUT_QTY;

    if (qtyPush > bdl.QTY) {
      return flash(
        `Can't Input Grather Theen Sum Of Bundle QTY`,
        2000,
        "danger"
      );
    }

    switch (type) {
      case "RTT":
        const qtyRtt =
          state.multipleRtt === "0" || state.multipleRtt === ""
            ? 1
            : state.multipleRtt;
        const compQtyTotal = parseInt(qr.TOTAL_CHECK) + parseInt(qtyRtt);

        if (compQtyTotal > bdl.QTY) {
          return flash(
            `Can't Input Grather Theen Sum Of Bundle QTT`,
            2000,
            "danger"
          );
        }

        const dataRtt = {
          ...dataBasic,
          ENDLINE_OUT_QTY: qtyRtt,
          ENDLINE_OUT_TYPE: "RTT",
        };

        return submitData(dataRtt);
      case "DEFECT":
        const dataDefect = {
          ...dataBasic,
          ...dataOutput,
          ENDLINE_OUT_TYPE: "DEFECT",
        };
        submitData(dataDefect);
        savePrevDef(dataOutput);
        return handlePageActive("");
      case "DEFECT_PREV":
        if (!state.defPrev.ENDLINE_DEFECT_CODE)
          return flash("No Data Previous", 2000, "danger");
        const dataDefectPrev = {
          ...dataBasic,
          ...state.defPrev,
          ENDLINE_OUT_TYPE: "DEFECT",
        };
        return submitData(dataDefectPrev);
      case "BS":
        const databs = {
          ...dataBasic,
          ...dataOutput,
          ENDLINE_OUT_TYPE: "BS",
        };
        submitData(databs);
        return handlePageActive("");
      default:
        break;
    }
  }

  //function submit output
  async function submitData(data) {
    await axios
      .post("/qc/endline/output", data)
      .then((res) => {
        if (res.data.ENDLINE_ADD_ID) {
          getQrQtyResult(res.data.ENDLINE_SCHD_ID, res.data.ENDLINE_PLAN_SIZE);
          //jika type post defect maka ambil data untuk repaird
          addUndoFrtEndEvryPost(res.data.ENDLINE_OUT_TYPE);
          if (res.data.ENDLINE_OUT_TYPE === "DEFECT") {
            getListDefForRep(
              res.data.ENDLINE_SCHD_ID,
              res.data.ENDLINE_PLAN_SIZE
            );
          }
        }
      })
      .catch((err) => flash(err.message, 2000, "danger"));
  }

  //save data def prev
  function savePrevDef(dataPrev) {
    dispatch({
      type: _ACTION._SET_DEF_PREV,
      payload: dataPrev,
    });
  }

  //get list qty defect for repaird
  async function getListDefForRep(schdi, size) {
    await axios
      .get(`/qc/endline/defect/${schdi}/${size}`)
      .then((res) => {
        if (res.data) {
          dispatch({
            type: _ACTION._GET_DEF_4_REPAIRD,
            payload: { data: res.data },
          });
        }
      })
      .catch((err) => flash(err.message, 2000, "danger"));
  }

  //for proccess repair
  async function proccessRepaird(deftoRepair) {
    await axios
      .patch("/qc/endline/repaired", deftoRepair)
      .then((res) => {
        getQrQtyResult(
          state.planSizeSelect.SCHD_ID,
          state.planSizeSelect.ORDER_SIZE
        );
        getListDefForRep(
          state.planSizeSelect.SCHD_ID,
          state.planSizeSelect.ORDER_SIZE
        );
        // refrehBundle();
        addUndoFrtEndEvryPost("REPAIR");

        handlePageActive("");
        if (res.status === 200) return flash(res.data.message, 2000, "success");
      })
      .catch((err) => flash(err.message, 2000, "danger"));
  }

  //for validasi saldo undo
  async function handleUndoDefRejGood(type) {
    const { UNDO_RTT, UNDO_DEFECT, UNDO_BS, UNDO_REPAIR } =
      state.planSizeSelect;
    switch (type) {
      case "RTT":
        if (UNDO_RTT > 0) {
          dispatch({
            type: _ACTION._SET_PLNZ_SELECT,
            payload: {
              data: { ...state.planSizeSelect, UNDO_RTT: UNDO_RTT - 1 },
            },
          });
          undo(type);
        }
        break;
      case "DEFECT":
        if (UNDO_DEFECT > 0) {
          dispatch({
            type: _ACTION._SET_PLNZ_SELECT,
            payload: {
              data: { ...state.planSizeSelect, UNDO_DEFECT: UNDO_DEFECT - 1 },
            },
          });
          undo(type);
        }
        break;
      case "BS":
        if (UNDO_BS > 0) {
          dispatch({
            type: _ACTION._SET_PLNZ_SELECT,
            payload: {
              data: { ...state.planSizeSelect, UNDO_BS: UNDO_BS - 1 },
            },
          });
          undo(type);
        }
        break;
      case "REPAIR":
        if (UNDO_REPAIR > 0) {
          dispatch({
            type: _ACTION._SET_PLNZ_SELECT,
            payload: {
              data: { ...state.planSizeSelect, UNDO_REPAIR: UNDO_REPAIR - 1 },
            },
          });
          undo(type);
        }
        break;
      default:
        break;
    }
  }

  //undo eksekusi
  async function undo(type) {
    const dataUndo = {
      ...state.planSizeSelect,
      ENDLINE_OUT_TYPE: type,
    };
    await axios
      .patch(`/qc/endline/undo/`, dataUndo)
      .then((res) => {
        getQrQtyResult(dataUndo.SCHD_ID, dataUndo.ORDER_SIZE);
        //jika type post defect maka ambil data untuk repaird
        if (type === "DEFECT" || type === "REPAIR") {
          getListDefForRep(dataUndo.SCHD_ID, dataUndo.ORDER_SIZE);
        }
        flash(res.data.message, 2000, "success");
      })
      .catch((err) => flash(err.message, 2000, "danger"));
  }

  //function untuk menambah saldo di Front End setiap melakukan post agar tidak lewat front end
  function addUndoFrtEndEvryPost(type) {
    const { UNDO_RTT, UNDO_DEFECT, UNDO_BS, UNDO_REPAIR } =
      state.planSizeSelect;
    switch (type) {
      case "RTT":
        if (UNDO_RTT < 3) {
          dispatch({
            type: _ACTION._SET_PLNZ_SELECT,
            payload: {
              data: { ...state.planSizeSelect, UNDO_RTT: UNDO_RTT + 1 },
            },
          });
        }
        break;
      case "DEFECT":
        if (UNDO_DEFECT < 3) {
          dispatch({
            type: _ACTION._SET_PLNZ_SELECT,
            payload: {
              data: { ...state.planSizeSelect, UNDO_DEFECT: UNDO_DEFECT + 1 },
            },
          });
        }
        break;
      case "BS":
        if (UNDO_BS < 3) {
          dispatch({
            type: _ACTION._SET_PLNZ_SELECT,
            payload: {
              data: { ...state.planSizeSelect, UNDO_BS: UNDO_BS + 1 },
            },
          });
        }
        break;
      case "REPAIR":
        if (UNDO_REPAIR < 3) {
          dispatch({
            type: _ACTION._SET_PLNZ_SELECT,
            payload: {
              data: { ...state.planSizeSelect, UNDO_REPAIR: UNDO_REPAIR + 1 },
            },
          });
        }
        break;
      default:
        break;
    }
  }

  //function untuk open modal transfer QR
  function handlMdlTfrActv(planz, bdl, type) {
    const databundle = { ...planz, type: type };
    const bal = CheckNilai(planz.GOOD) - CheckNilai(planz.TFR_QTY);
    console.log(bal);
    if (bal < bdl.ORDER_QTY) {
      return flash("No Balance For Transfer", 2000, "danger");
    }

    const qrData = {
      ...bdl,
      SCH_ID: planz.SCH_ID,
      SCHD_ID: planz.SCHD_ID,
      SEWING_SCAN_BY: userId,
      SEWING_SCAN_LOCATION: siteName,
    };
    dispatch({
      type: _ACTION._SET_QR_4_TFR,
      payload: qrData,
    });
    dispatch({
      type: _ACTION._SET_PLNZ_SELECT,
      payload: { data: databundle },
    });
    dispatch({
      type: _ACTION._SET_MDL_TFR,
      payload: true,
    });
  }

  //function untuk close modal transfer QR
  function closedModalTf() {
    dispatch({
      type: _ACTION._SET_QR_4_TFR,
      payload: {},
    });
    dispatch({
      type: _ACTION._SET_PLNZ_SELECT,
      payload: { data: {} },
    });
    dispatch({
      type: _ACTION._SET_MDL_TFR,
      payload: false,
    });
  }

  //function untuk transfer
  async function handleTrfrQr() {
    await axios
      .post("/qc/endline/qr/transfer", state.qrForTfr)
      .then((res) => {
        if (res.status === 200) {
          flash(res.data.message, 2000, res.data.qrstatus);
          refrehAll();
          closedModalTf();
        }
      })
      .catch((err) => {
        flash(err.message, 2000, "danger");
        closedModalTf();
      });
  }

  return (
    <QcEndlineContex.Provider
      value={{
        state,
        dispatch,
        userId,
        qcName,
        qcType,
        siteName,
        lineName,
        shift,
        refreshPlanning,
        refrehBundle,
        refrehAll,
        planSizeSelected,
        planSizeUnSelected,
        handlePageActive,
        postOutput,
        getQrQtyResult,
        proccessRepaird,
        handleUndoDefRejGood,
        handlMdlTfrActv,
        closedModalTf,
        handleTrfrQr,
      }}
    >
      {children}
    </QcEndlineContex.Provider>
  );
};