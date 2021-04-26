import React, { useEffect, useState } from "react";
import AreaChart from "../chart/stock-area-chart.component";
import StockChart from "../chart/stock-chart.component";

const GraphTab = (props) => {
  const { stock, transactions } = props;
  const [stockPriceData, setStockPriceData] = useState([]);
  console.log(stock);
  useEffect(() => {
    if (transactions.length) {
      fetch(
        `/api/stock/stockprice/${stock}/?period&from_date=${transactions[0].date}`
      )
        .then((res) => res.json())
        .then((res) => {
          setStockPriceData(
            res
              .map((val) => {
                return {
                  ...val,
                  close: val.adj_close,
                  open: val.adj_close - (val.close_price - val.open_price),
                  high: val.adj_close - val.close_price + val.high,
                  low: val.adj_close - val.close_price + val.low,
                  date: new Date(val.date),
                };
              })
              .reverse()
          );
        });
    }
  }, [stock, transactions]);

  console.log(stockPriceData);
  if (stockPriceData.length) {
    return (
      <div>
        <AreaChart data={stockPriceData} transactions={transactions} />
        <StockChart data={stockPriceData} />
      </div>
    );
  } else {
    return null;
  }
};

export default GraphTab;
