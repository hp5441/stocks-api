import { takeLatest, put, call, all } from "redux-saga/effects";
import {
  createUserWithEmailAndPassword,
  extractCSRF,
  getCurrentUser,
  signInUserWithEmailAndPassword,
  signInUserWithGoogle,
  signOutUser,
} from "../../auth/auth.utils";

import { UserActionTypes } from "./user.types";

import {
  signUpSuccess,
  signUpFailure,
  signInSuccess,
  signInFailure,
  signOutFailure,
  signOutSuccess,
  fetchStocksSuccess,
  fetchStocksFailure,
  csrfSuccess,
  csrfFailure,
} from "./user.actions";
import { fetchStockList } from "../../utils/watchlist.utils";

export function* signInWithGoogle() {
  try {
    const user = yield signInUserWithGoogle();
    yield put(signInSuccess(user));
  } catch (error) {
    yield put(signInFailure(error));
  }
}

export function* signInWithEmail({ payload: { email, password } }) {
  try {
    const user = yield signInUserWithEmailAndPassword({ email, password });
    yield put(signInSuccess(user));
  } catch (error) {
    yield put(signInFailure(error));
  }
}

export function* signUp({ payload: { email, password, name } }) {
  try {
    yield createUserWithEmailAndPassword({
      email: email,
      password: password,
      name: name,
    });
    yield put(signUpSuccess({ email: email, password: password }));
  } catch (error) {
    yield put(signUpFailure(error));
  }
}

export function* signInAfterSignUp({ payload: { email, password } }) {
  try {
    const user = yield signInUserWithEmailAndPassword({
      email: email,
      password: password,
    });
    yield put(signInSuccess(user));
  } catch (error) {
    yield put(signInFailure(error));
  }
}

export function* fetchAfterSignin() {
  try {
    const stocks = yield fetchStockList();
    yield put(fetchStocksSuccess(stocks));
  } catch (error) {
    yield put(fetchStocksFailure(error));
  }
}

export function* setCSRF() {
  try {
    const csrftoken = yield extractCSRF("csrftoken");
    yield put(csrfSuccess(csrftoken));
  } catch (error) {
    yield put(csrfFailure(error));
  }
}

export function* signOut() {
  try {
    yield signOutUser();
    yield put(signOutSuccess());
    yield localStorage.clear();
  } catch (error) {
    yield put(signOutFailure(error));
  }
}

export function* isUserAuthenticated() {
  try {
    const user = yield getCurrentUser();
    return user;
  } catch (error) {
    yield put(signInFailure(error));
  }
}

export function* onGoogleSignInStart() {
  yield takeLatest(UserActionTypes.GOOGLE_SIGN_IN_START, signInWithGoogle);
}

export function* onEmailSignInStart() {
  yield takeLatest(UserActionTypes.EMAIL_SIGN_IN_START, signInWithEmail);
}

export function* onCheckUserSession() {
  yield takeLatest(UserActionTypes.CHECK_USER_SESSION, isUserAuthenticated);
}

export function* onSignOutStart() {
  yield takeLatest(UserActionTypes.SIGN_OUT_START, signOut);
}

export function* onSignUpStart() {
  yield takeLatest(UserActionTypes.SIGN_UP_START, signUp);
}

export function* onSignUpSuccess() {
  yield takeLatest(UserActionTypes.SIGN_UP_SUCCESS, signInAfterSignUp);
}

export function* onSignUpSuccessForFetch() {
  yield takeLatest(UserActionTypes.SIGN_IN_SUCCESS, fetchAfterSignin);
}

export function* onSignUpSuccessForCSRF() {
  yield takeLatest(UserActionTypes.SIGN_IN_SUCCESS, setCSRF);
}

export function* userSagas() {
  yield all([
    call(onGoogleSignInStart),
    call(onEmailSignInStart),
    call(onCheckUserSession),
    call(onSignOutStart),
    call(onSignUpStart),
    call(onSignUpSuccess),
    call(onSignUpSuccessForFetch),
    call(onSignUpSuccessForCSRF),
  ]);
}
