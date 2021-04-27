import React from "react";
import { Link, useRouteMatch } from "react-router-dom";

const PortfolioTableStock = ({
  stock: { ltp, scrip, change },
  quantity,
  avg_price,
  children,
  totalInvestment,
  totalCurrentValue,
  id,
}) => {
  const amountInvested = (avg_price * quantity).toFixed(2);
  const absoluteChangePercent = ((ltp / (ltp - change) - 1) * 100).toFixed(2);
  const currentNetworth = (ltp * quantity).toFixed(2);
  const todaysGainLoss = (change * quantity).toFixed(2);
  const notationalGainLoss = (currentNetworth - amountInvested).toFixed(2);
  const notationalGainLossPercent = (
    notationalGainLoss / currentNetworth
  ).toFixed(2);
  const costContribution = totalInvestment
    ? ((amountInvested / totalInvestment) * 100).toFixed(2)
    : 0;
  const currentValueContribution = totalCurrentValue
    ? ((currentNetworth / totalCurrentValue) * 100).toFixed(2)
    : 0;

  const { url } = useRouteMatch();

  return (
    <tr>
      <td>
        <Link to={`${url}/${id}`}>{scrip}</Link>
      </td>
      <td>{ltp}</td>
      <td>{quantity}</td>
      <td>{avg_price.toFixed(2)}</td>
      <td>{amountInvested}</td>
      <td>{change.toFixed(2)}</td>
      <td>{absoluteChangePercent}</td>
      <td>{currentNetworth}</td>
      <td>{todaysGainLoss}</td>
      <td>{notationalGainLoss}</td>
      <td>{notationalGainLossPercent}</td>
      <td>{costContribution}</td>
      <td>{currentValueContribution}</td>
      <td></td>
      <td>{children}</td>
    </tr>
  );
};

export default PortfolioTableStock;
