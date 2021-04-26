import React from "react";
import { Link, useRouteMatch } from "react-router-dom";

const PortfolioPastTableStock = ({
  stock: { ltp, scrip },
  quantity,
  avgCost,
  avgSellPrice,
  children,
  totalInvestment,
  totalExpenditure,
  id,
}) => {
  const { url } = useRouteMatch();

  return (
    <tr>
      <td>
        <Link to={`${url}/${id}`}>{scrip}</Link>
      </td>
      <td>{ltp}</td>
      <td>{quantity}</td>
      <td>{avgCost.toFixed(2)}</td>
      <td>{totalInvestment}</td>
      <td>{avgSellPrice.toFixed(2)}</td>
      <td>
        {Math.abs(totalExpenditure - totalInvestment).toString() +
          "_" +
          (((totalExpenditure - totalInvestment) / totalInvestment) * 100)
            .toFixed(2)
            .toString() +
          "%"}
      </td>
      <td>{children}</td>
    </tr>
  );
};

export default PortfolioPastTableStock;
