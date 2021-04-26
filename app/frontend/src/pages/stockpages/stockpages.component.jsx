import React from "react";
import { Route, useRouteMatch } from "react-router-dom";
import StockPage from "../stockpage/stockpage.component";

const StockPages = () => {
  const { path } = useRouteMatch();

  return (
    <Route path={`${path}/:stockId`}>
      <StockPage />
    </Route>
  );
};

export default StockPages;
