import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";

import { WebSocketContext } from "../../utils/websocketConnection.utils";

const WatchListTableStock = (props) => {
  const {
    stockId,
    addedOnDate,
    addedOnPrice,
    stock: { ltp, change, scrip },
  } = props;

  const [price, setLTP] = useState(ltp);
  const [absoluteChange, setChange] = useState(change);
  const changePercernt = ((price / (price - absoluteChange) - 1) * 100).toFixed(
    2
  );
  const changePercentSpan = (
    ((price - addedOnPrice) / addedOnPrice) *
    100
  ).toFixed(2);

  const d = new Date(addedOnDate);
  const formattedDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

  const ws = useContext(WebSocketContext);
  useEffect(() => {
    if (ws.socket) {
      ws.socket.on("stock-client", (stockData) => {
        if (scrip === stockData.ins) {
          setLTP(stockData.last_price);
          setChange(stockData.change);
        }
      });
    }
  }, [ws, scrip]);

  return (
    <tr className="watchlist-table-stock" id={stockId}>
      <td>{formattedDate}</td>
      <td>{addedOnPrice}</td>
      <td>{scrip}</td>
      <td style={absoluteChange > 0 ? { color: "green" } : { color: "red" }}>
        {price}
      </td>
      <td style={absoluteChange > 0 ? { color: "green" } : { color: "red" }}>
        {absoluteChange.toFixed(2)}
      </td>
      <td style={absoluteChange > 0 ? { color: "green" } : { color: "red" }}>
        {changePercernt}
      </td>
      <td style={changePercentSpan > 0 ? { color: "green" } : { color: "red" }}>
        {changePercentSpan}
      </td>
      <td>{props.children}</td>
    </tr>
  );
};

export default WatchListTableStock;
