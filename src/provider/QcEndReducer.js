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

    default:
      return state;
  }
};
