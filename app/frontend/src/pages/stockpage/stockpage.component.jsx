import React from "react";
import { useParams } from "react-router-dom";
import Sidenav from "../../components/sidenav/sidenav.component";

import "./stockpage.styles.scss";
const StockPage = () => {
  const { stockId } = useParams();
  console.log(stockId);
  return (
    <div>
      <Sidenav />
      <div className="stock-div">
        <div className="stock-header">
          <h1>{stockId}</h1>
        </div>
      </div>
    </div>
  );
};

export default StockPage;
