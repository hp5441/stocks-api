import { UserActionTypes } from "./user.types";

const INITIAL_STATE = {
  currentUser: null,
  stocks: [],
  csrftoken: null,
  error: null,
  showModal: null,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserActionTypes.SIGN_IN_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        error: null,
      };
    case UserActionTypes.SIGN_OUT_SUCCESS:
      return {
        ...state,
        stocks: null,
        csrftoken: null,
        currentUser: null,
        error: null,
      };
    case UserActionTypes.SIGN_IN_FAILURE:
    case UserActionTypes.SIGN_OUT_FAILURE:
    case UserActionTypes.SIGN_UP_FAILURE:
    case UserActionTypes.FETCH_STOCKS_FAILURE:
    case UserActionTypes.CSRF_SET_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case UserActionTypes.FETCH_STOCKS_SUCCESS:
      return {
        ...state,
        stocks: action.payload,
      };
    case UserActionTypes.CSRF_SET_SUCCESS:
      return {
        ...state,
        csrftoken: action.payload,
      };
    case UserActionTypes.SHOW_MODAL:
      return {
        ...state,
        showModal: action.payload,
      };
    case UserActionTypes.CLOSE_MODAL:
      return {
        ...state,
        showModal: null,
      };
    default:
      return state;
  }
};

export default userReducer;
