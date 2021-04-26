import React, { createContext } from "react";
import {
  websocketConnectionDisconnect,
  websocketConnectionSuccess,
  websocketSubSuccess,
  websocketUnubSuccess,
} from "../redux/websocket/websocket.actions";

import io from "socket.io-client";
import jwt from "jsonwebtoken";
import { WS_BASE } from "./config";
import { useDispatch } from "react-redux";

const WebSocketContext = createContext(null);

export { WebSocketContext };

const Websocket = ({ children }) => {
  let socket;
  let ws;

  const dispatch = useDispatch();

  const token = jwt.sign({ user: "hari" }, "asdf");

  const subMessage = (stocks) => {
    socket.emit("sub", stocks);
    console.log(stocks, "sub from socket");
    dispatch(websocketSubSuccess(stocks));
  };

  const unsubMessage = (stocks) => {
    socket.emit("unsub", stocks);
    console.log(stocks, "unsub from socket");
    dispatch(websocketUnubSuccess(stocks));
  };

  if (!socket) {
    socket = io.connect(WS_BASE, { transports: ["websocket"], forceNew: true });

    socket.on("connect", () => {
      console.log("connected");
      socket.emit("auth", token);
      console.log("emitted");
      dispatch(websocketConnectionSuccess(socket));
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
      dispatch(websocketConnectionDisconnect());
    });

    ws = {
      socket: socket,
      subMessage,
      unsubMessage,
    };
  }

  return (
    <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
  );
};

export default Websocket;
