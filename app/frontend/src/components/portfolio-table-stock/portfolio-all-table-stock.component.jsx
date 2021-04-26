import React from "react";
import { Link, useRouteMatch } from "react-router-dom";

const PortfolioAllTableStock = ({
  stock: { ltp, scrip, change },
  quantity,
  avg_price,
  avg_sell_price,
  totalBoughtPrice,
  totalSoldPrice,
  children,
  soldQuantity,
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
      <td>{change}</td>
      <td>{absoluteChangePercent}</td>
      <td>{currentNetworth}</td>
      <td>{todaysGainLoss}</td>
      <td>{notationalGainLoss}</td>
      <td>{avg_sell_price ? avg_sell_price.toFixed(2) : 0}</td>
      <td>{soldQuantity}</td>
      <td>{totalSoldPrice - totalBoughtPrice}</td>
      <td>{children}</td>
    </tr>
  );
};

export default PortfolioAllTableStock;
