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
    schDate: moment().format("YYYY-MM-DD"),
    dataDailyPlan: [],
    siteActive: siteName,
    activeTab: "normal",
    // dataQrBundle: [],
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

  const [state, dispatch] = useReducer(reducer, initialstate);

  useEffect(() => {
    getDailyPlanning(state.schDate, siteName, lineName, idSiteLine, shift);
    getQrBundle(state.schDate, siteName, lineName);
  }, [state.schDate, siteName, lineName, idSiteLine, shift]);

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
      }}
    >
      {children}
    </QcEndlineContex.Provider>
  );
};
