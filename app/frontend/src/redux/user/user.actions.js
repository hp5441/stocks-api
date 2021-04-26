import { UserActionTypes } from "./user.types";

export const signInSuccess = (user) => ({
  type: UserActionTypes.SIGN_IN_SUCCESS,
  payload: user,
});

export const signInFailure = (error) => ({
  type: UserActionTypes.SIGN_IN_FAILURE,
  payload: error,
});

export const signOutSuccess = () => ({
  type: UserActionTypes.SIGN_OUT_SUCCESS,
});

export const signUpFailure = (error) => ({
  type: UserActionTypes.SIGN_UP_FAILURE,
  payload: error,
});

export const signOutFailure = (error) => ({
  type: UserActionTypes.SIGN_OUT_FAILURE,
  payload: error,
});

export const googleSignInStart = () => ({
  type: UserActionTypes.GOOGLE_SIGN_IN_START,
});

export const emailSignInStart = (userCredentials) => {
  return {
    type: UserActionTypes.EMAIL_SIGN_IN_START,
    payload: userCredentials,
  };
};

export const signUpStart = (userCredentials) => ({
  type: UserActionTypes.SIGN_UP_START,
  payload: userCredentials,
});

export const signUpSuccess = (userCredentials) => ({
  type: UserActionTypes.SIGN_UP_SUCCESS,
  payload: userCredentials,
});

export const checkUserSession = () => ({
  type: UserActionTypes.CHECK_USER_SESSION,
});

export const signOutStart = () => ({
  type: UserActionTypes.SIGN_OUT_START,
});

export const fetchStocksSuccess = (stocks) => ({
  type: UserActionTypes.FETCH_STOCKS_SUCCESS,
  payload: stocks,
});

export const fetchStocksFailure = (error) => ({
  type: UserActionTypes.FETCH_STOCKS_FAILURE,
  payload: error,
});

export const csrfSuccess = (csrftoken) => ({
  type: UserActionTypes.CSRF_SET_SUCCESS,
  payload: csrftoken,
});

export const csrfFailure = (error) => ({
  type: UserActionTypes.CSRF_SET_FAILURE,
  payload: error,
});

export const showModal = (modalType) => ({
  type: UserActionTypes.SHOW_MODAL,
  payload: modalType,
});

export const closeModal = () => ({
  type: UserActionTypes.CLOSE_MODAL,
});
