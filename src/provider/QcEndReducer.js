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
    case _ACTION._SET_BDL_SELECT:
      return {
        ...state,
        bdlSelect: action.payload.data,
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

    default:
      return state;
  }
};
