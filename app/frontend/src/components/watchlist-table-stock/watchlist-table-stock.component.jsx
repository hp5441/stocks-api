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

  const transformDecimal = (number) => {
    if (Number(number)) {
      return Number(number).toFixed(2);
    } else {
      return Number(0).toFixed(2);
    }
  };

  const [price, setLTP] = useState(transformDecimal(ltp));
  const [absoluteChange, setChange] = useState(transformDecimal(change));
  const [changePercent, setChangePercent] = useState(
    transformDecimal((ltp / (ltp - change) - 1) * 100)
  );
  const changePercentSpan = transformDecimal(
    ((price - addedOnPrice) / addedOnPrice) * 100
  );

  const d = new Date(addedOnDate);
  const formattedDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

  const ws = useContext(WebSocketContext);
  useEffect(() => {
    if (ws.socket) {
      ws.socket.on("stock-client", (stockData) => {
        if (scrip === stockData.ins) {
          setLTP(transformDecimal(stockData.last_price));
          setChangePercent(transformDecimal(stockData.change));
          setChange(
            transformDecimal(
              (stockData.last_price * stockData.change) /
                (100 + stockData.change)
            )
          );
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
        {absoluteChange}
      </td>
      <td style={absoluteChange > 0 ? { color: "green" } : { color: "red" }}>
        {changePercent}
      </td>
      <td style={changePercentSpan > 0 ? { color: "green" } : { color: "red" }}>
        {changePercentSpan}
      </td>
      <td>{props.children}</td>
    </tr>
  );
};

export default WatchListTableStock;
