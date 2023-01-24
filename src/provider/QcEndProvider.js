import { createContext, useContext, useReducer, useEffect } from "react";
import { AuthContext } from "../auth/AuthProvider";
import moment from "moment";
import axios from "../axios/axios";
import { _QCReducer } from "./QcEndReducer";
import { _ACTION } from "./QcEndAction";

export const QcEndlineContex = createContext(null);

export const QcEndProvider = ({ children }) => {
  const { value } = useContext(AuthContext);
  const { userId, qcName, qcType, siteName, lineName, shift, idSiteLine } =
    value;

  const reducer = _QCReducer;

  const initialstate = {
    date: moment().format("YYYY-MM-DD"),
    // schDate: "2023-01-21",
    schDate: moment().format("YYYY-MM-DD"),
    dataDailyPlan: [],
    dataHCselect: [],
    bdlSelect: [],
    listDefect: [],
    listPart: [],
    siteActive: siteName,
    activeTab: "normal",
    mdlHC: false,
    pageActive: "",
    mdlInput: false,
    // listSite: [],
    // listLine: [],
    // listResultScan: [],
    // lineActive: "",
  };

  //funct get data planing
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

  async function getQrBundle(date, siteName, lineName) {
    await axios
      .get(`/cutting/qr/scan-sewing-in/${date}/${siteName}/${lineName}/%25%25`)
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

  async function getListPart() {
    await axios.get(`/qc/part`).then((res) => {
      dispatch({
        type: _ACTION._GET_LIST_PART,
        payload: { data: res.data },
      });
    });
  }
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
    refreshPlanning();
    refrehBundle();
  };

  useEffect(() => {
    getListPart();
    getListDefect();
  }, []);

  useEffect(() => {
    getDailyPlanning(state.schDate, siteName, lineName, idSiteLine, shift);
    getQrBundle(state.schDate, siteName, lineName);
  }, [state.schDate, siteName, lineName, idSiteLine, shift]);

  //function bundleSelect
  function bundleSelected(dataBdl) {
    dispatch({
      type: _ACTION._SET_BDL_SELECT,
      payload: { data: dataBdl },
    });
    dispatch({
      type: _ACTION._SET_MDL_INPUT,
      payload: true,
    });
  }
  //function bundleSelect
  function bdlUnslected() {
    dispatch({
      type: _ACTION._SET_BDL_SELECT,
      payload: { data: [] },
    });
    dispatch({
      type: _ACTION._SET_MDL_INPUT,
      payload: false,
    });
  }

  function handlePageActive(page) {
    dispatch({
      type: _ACTION._SET_DEF_PAGE,
      payload: page,
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
        bundleSelected,
        bdlUnslected,
        handlePageActive,
      }}
    >
      {children}
    </QcEndlineContex.Provider>
  );
};
