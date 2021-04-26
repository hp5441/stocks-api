import React from "react";

import WebsocketProvider from "../../utils/websocketConnection.utils";

const WebsocketWrapper = (WrappedComponent) => {
  const ReturnedComponent = ({ ...props }) => {
    return (
      <WebsocketProvider>
        <WrappedComponent {...props} />
      </WebsocketProvider>
    );
  };
  return ReturnedComponent;
};

export default WebsocketWrapper;
