import io from "socket.io-client";
import jwt from "jsonwebtoken";

export const startWebsocketConnection = () => {
  const socket = io("http://localhost:7000", { transports: ["websocket"] });
  const token = jwt.sign({ user: "hari" }, "asdf");

  socket.on("connect", () => {
    console.log(socket.connected);
  });
  socket.on("disconnect", () => {
    console.log(socket.connected);
  });
  socket.on("stock-client", (stockData) => {
    console.log(stockData);
  });
  socket.emit("auth", token);
  console.log(socket);
  return socket;
};
