import React from "react";
import "./watchlist-table-header.styles.scss";
import {
  faArrowDown,
  faArrowUp,
  faRupeeSign,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const WatchlistHeader = (props) => {
  const { stocks } = props;
  let bestPerformer;
  let worstPerformer;
  let bestPerformerPrice = -100;
  let worstPerformerPrice = 100;
  let advances = 0;
  let declines = 0;
  let advancesPercentage = 0;
  let declinesPercentage = 0;

  if (stocks) {
    stocks.forEach((stock) => {
      const {
        stock: { ltp, change },
      } = stock;
      const changePercent = parseFloat(((ltp / (ltp - change) - 1) * 100).toFixed(2));
      if (changePercent >= bestPerformerPrice) {
        bestPerformerPrice = changePercent;
        bestPerformer = stock;
      }
      if (changePercent < worstPerformerPrice) {
        worstPerformerPrice = changePercent;
        worstPerformer = stock;
      }
      if (change < 0) {
        declines += 1;
      }
      if (change >= 0) {
        advances += 1;
      }
    });
    if (
      bestPerformer &&
      worstPerformer &&
      bestPerformer.stock.scrip === worstPerformer.stock.scrip
    ) {
      worstPerformer = null;
    }
  }

  if (advances !== 0) {
    advancesPercentage = (advances / (advances + declines)) * 100;
  }
  if (declines !== 0) {
    declinesPercentage = (declines / (advances + declines)) * 100;
  }

  console.log(advancesPercentage, declinesPercentage);
  return (
    <div className="watchlist-header">
      <table className="watchlist-header-table">
        <thead>
          <tr>
            <th>
              <span>Best Performer</span>
            </th>
            <th>
              <span>Worst Performer</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span>{bestPerformer ? bestPerformer.stock.name : "NA"}</span>
            </td>
            <td>
              <span>{worstPerformer ? worstPerformer.stock.name : "NA"}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span>
                <FontAwesomeIcon icon={faRupeeSign} />{" "}
                {bestPerformer ? bestPerformer.stock.ltp : "NA"}{" "}
                {bestPerformer ? (
                  bestPerformerPrice > 0 ? (
                    <FontAwesomeIcon
                      icon={faArrowUp}
                      style={{ color: "green" }}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faArrowDown}
                      style={{ color: "red" }}
                    />
                  )
                ) : (
                  ""
                )}
                {bestPerformer ? (
                  bestPerformerPrice > 0 ? (
                    <span style={{ color: "green" }}>
                      {bestPerformer.stock.change.toFixed(2) +
                        " (" +
                        bestPerformerPrice +
                        "%)"}
                    </span>
                  ) : (
                    <span style={{ color: "red" }}>
                      {bestPerformer.stock.change.toFixed(2) +
                        " (" +
                        bestPerformerPrice +
                        "%)"}
                    </span>
                  )
                ) : (
                  ""
                )}
              </span>
            </td>
            <td>
              <span>
                <FontAwesomeIcon icon={faRupeeSign} />{" "}
                {worstPerformer ? worstPerformer.stock.ltp : "NA"}{" "}
                {worstPerformer ? (
                  worstPerformerPrice > 0 ? (
                    <FontAwesomeIcon
                      icon={faArrowUp}
                      style={{ color: "green" }}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faArrowDown}
                      style={{ color: "red" }}
                    />
                  )
                ) : (
                  ""
                )}
                {worstPerformer ? (
                  worstPerformerPrice > 0 ? (
                    <span style={{ color: "green" }}>
                      {worstPerformer.stock.change.toFixed(2) +
                        " (" +
                        worstPerformerPrice +
                        "%)"}
                    </span>
                  ) : (
                    <span style={{ color: "red" }}>
                      {worstPerformer.stock.change.toFixed(2) +
                        " (" +
                        worstPerformerPrice +
                        "%)"}
                    </span>
                  )
                ) : (
                  ""
                )}
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <div className="watchlist-header-bar">
                {advancesPercentage ? (
                  <div
                    className="green-bar"
                    style={{ width: advancesPercentage + "%" }}
                  ></div>
                ) : null}
                {declinesPercentage ? (
                  <div
                    className="red-bar"
                    style={{ width: declinesPercentage + "%" }}
                  ></div>
                ) : null}
              </div>
              <div className="watchlist-header-bar-label">
                {advancesPercentage ? (
                  <span style={{ color: "green" }}>
                    {advances +
                      " Advances (" +
                      advancesPercentage.toFixed(2) +
                      "%)"}
                  </span>
                ) : null}
                {declinesPercentage ? (
                  <span style={{ color: "red" }}>
                    {declines +
                      " Declines (" +
                      declinesPercentage.toFixed(2) +
                      "%)"}
                  </span>
                ) : null}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WatchlistHeader;
