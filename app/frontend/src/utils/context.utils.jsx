import React from "react";
import { connect } from "react-redux";

import { websocketConnectionStart } from "../redux/websocket/websocket.actions";

const websocketContext = React.createContext(null);

export { websocketContext };

const Websocket = ({ children, props: { websocketConnectionStart } }) => {
  return <websocketContext.Provider>{children}</websocketContext.Provider>;
};

const mapDispatchToProps = (dispatch) => ({
  websocketConnectionStart: (websocketAddress) =>
    dispatch(websocketConnectionStart(websocketAddress)),
});

const mapStateToProps = ({ websocketAddress }) => ({
  websocketAddress: websocketAddress,
});
export default connect(mapStateToProps, mapDispatchToProps)(Websocket);
