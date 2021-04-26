import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import "./portfolio-table-header.styles.scss";

const PortfolioTableHeader = ({
  totalCurrentValue,
  totalInvestment,
  totalDaysGainLoss,
  totalRealizedGainLoss,
  notationalGainLoss,
}) => {
  const numberFormat = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumSignificantDigits: 4,
    compactDisplay: "long",
  });
  return (
    <table className="portfolio-table-header">
      <thead>
        <tr>
          <th>Current Value</th>
          <th>Investments</th>
          <th>Today's Gain/Loss</th>
          <th>Notional Gain/Loss</th>
          <th>Total Realized Gain/Loss</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{numberFormat.format(totalCurrentValue)}</td>
          <td>{numberFormat.format(totalInvestment)}</td>
          <td
            style={
              totalDaysGainLoss > 0 ? { color: "green" } : { color: "red" }
            }
          >
            {totalDaysGainLoss < 0 ? (
              <FontAwesomeIcon icon={faCaretDown} />
            ) : (
              <FontAwesomeIcon icon={faCaretUp} />
            )}{" "}
            {numberFormat.format(Math.abs(totalDaysGainLoss))}
          </td>
          <td
            style={
              notationalGainLoss > 0 ? { color: "green" } : { color: "red" }
            }
          >
            {notationalGainLoss < 0 ? (
              <FontAwesomeIcon icon={faCaretDown} />
            ) : (
              <FontAwesomeIcon icon={faCaretUp} />
            )}{" "}
            {numberFormat.format(Math.abs(notationalGainLoss))}
          </td>
          <td
            style={
              totalRealizedGainLoss > 0 ? { color: "green" } : { color: "red" }
            }
          >
            {totalRealizedGainLoss < 0 ? (
              <FontAwesomeIcon icon={faCaretDown} />
            ) : (
              <FontAwesomeIcon icon={faCaretUp} />
            )}{" "}
            {numberFormat.format(Math.abs(totalRealizedGainLoss))}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default PortfolioTableHeader;
