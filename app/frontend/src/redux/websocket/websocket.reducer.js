import { websocketActionTypes } from "./websocket.types";

const INITIAL_STATE = {
  websocket: null,
  connected: false,
  subscribed: new Set(),
  error: null,
};

const websocketReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case websocketActionTypes.WEBSOCKET_CONNECTION_SUCCESS:
      return {
        ...state,
        websocket: action.payload,
        connected: true,
        error: null,
      };
    case websocketActionTypes.WEBSOCKET_CONNECTION_FAILURE:
      return { ...state, error: action.payload };
    case websocketActionTypes.WEBSOCKET_CONNECTION_DISCONNECT:
      state.subscribed.clear();
      return { ...state, connected: false, error: null };
    case websocketActionTypes.WEBSOCKET_SUB_SUCCESS:
      action.payload.forEach((stock) => {
        state.subscribed.add(stock);
      });
      return { ...state, error: null };
    case websocketActionTypes.WEBSOCKET_UNSUB_SUCCESS:
      action.payload.forEach((stock) => {
        state.subscribed.delete(stock);
      });
      return { ...state, error: null };
    default:
      return { ...state };
  }
};

export default websocketReducer;
