import { websocketActionTypes } from "./websocket.types";

export const websocketConnectionStart = () => ({
  type: websocketActionTypes.WEBSOCKET_CONNECTION_START,
});

export const websocketConnectionSuccess = (websocket) => ({
  type: websocketActionTypes.WEBSOCKET_CONNECTION_SUCCESS,
  payload: websocket,
});

export const websocketConnectionDisconnect = (websocket) => ({
  type: websocketActionTypes.WEBSOCKET_CONNECTION_DISCONNECT,
  payload: websocket,
});

export const websocketConnectionFailure = (error) => ({
  type: websocketActionTypes.WEBSOCKET_CONNECTION_FAILURE,
  payload: error,
});

export const websocketSubStart = (subscriptions) => ({
  type: websocketActionTypes.WEBSOCKET_SUB_START,
  payload: subscriptions,
});

export const websocketSubSuccess = (subscriptions) => ({
  type: websocketActionTypes.WEBSOCKET_SUB_SUCCESS,
  payload: subscriptions,
});

export const websocketUnubSuccess = (subscriptions) => ({
  type: websocketActionTypes.WEBSOCKET_UNSUB_SUCCESS,
  payload: subscriptions,
});

export const websocketUnsubStart = (subscriptions) => ({
  type: websocketActionTypes.WEBSOCKET_UNSUB_START,
  payload: subscriptions,
});
