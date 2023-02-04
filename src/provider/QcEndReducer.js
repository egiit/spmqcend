import { _ACTION } from "./QcEndAction";

export const _QCReducer = (state, action) => {
  switch (action.type) {
    case _ACTION._SET_SCH_DATE:
      return {
        ...state,
        schDate: action.payload,
      };
    case _ACTION._SET_TAB_ACTIVE:
      return {
        ...state,
        activeTab: action.payload,
      };
    case _ACTION._SET_DATA_HC:
      return {
        ...state,
        dataHCselect: action.payload.data,
      };
    case _ACTION._SET_PLNZ_SELECT:
      return {
        ...state,
        planSizeSelect: action.payload.data,
      };
    case _ACTION._SET_MDL_INPUT:
      return {
        ...state,
        mdlInput: action.payload,
      };
    case _ACTION._SET_MDL_HC:
      return {
        ...state,
        mdlHC: action.payload,
      };
    case _ACTION._GET_SCH_DAILY:
      return {
        ...state,
        dataDailyPlan: action.payload.data,
      };
    case _ACTION._GET_SCH_QR_BUNDLE:
      return {
        ...state,
        dataQrBundle: action.payload.data,
      };
    case _ACTION._GET_LIST_DEFECT:
      return {
        ...state,
        listDefect: action.payload.data,
      };
    case _ACTION._GET_LIST_PART:
      return {
        ...state,
        listPart: action.payload.data,
      };
    case _ACTION._SET_DEF_PAGE:
      return {
        ...state,
        pageActive: action.payload,
      };
    case _ACTION._SET_MULTIPLE_RTT:
      return {
        ...state,
        multipleRtt: action.payload,
      };
    case _ACTION._GET_QR_RESULT:
      return {
        ...state,
        qrQtyResult: action.payload.data,
      };
    case _ACTION._GET_PLANNING_BYSIZE:
      return {
        ...state,
        dataPlanBySize: action.payload.data,
      };
    case _ACTION._SET_DEF_PREV:
      return {
        ...state,
        defPrev: action.payload,
      };
    case _ACTION._GET_DEF_4_REPAIRD:
      return {
        ...state,
        dataDefectForRep: action.payload.data,
      };
    case _ACTION._SET_MDL_TFR:
      return {
        ...state,
        mdlTfr: action.payload,
      };
    case _ACTION._SET_QR_4_TFR:
      return {
        ...state,
        qrForTfr: action.payload,
      };

    default:
      return state;
  }
};
