import { takeLatest, put, call, all } from "redux-saga/effects";
import {
  websocketConnectionFailure,
  websocketConnectionStart,
} from "./websocket.actions";
import { websocketActionTypes } from "./websocket.types";

export function* startWebsocketSubscribe({ payload: { pk, email, name } }) {
  try {
    yield put(websocketConnectionStart());
  } catch (error) {
    yield put(websocketConnectionFailure(error));
  }
}

export function* onWebsocketSubStart() {
  yield takeLatest(
    websocketActionTypes.WEBSOCKET_SUB_START,
    startWebsocketSubscribe
  );
}

export function* websocketSagas() {
  yield all([call(onWebsocketSubStart)]);
}
