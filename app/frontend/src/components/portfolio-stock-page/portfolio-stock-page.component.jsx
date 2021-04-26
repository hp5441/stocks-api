import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@material-ui/core";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect, useParams } from "react-router";
import GraphTab from "../real-stock-graph-tab/real-stock-graph-tab.component";
import Tabs from "../tabs/tabs.component";

import "./portfolio-stock-page.styles.scss";

const PstockPage = (props) => {
  const { portfolio, transactions } = props;
  const { pstockId } = useParams();

  const [currentTab, setCurrentTab] = useState("transaction history");
  const portfolioStocks = Object.values(portfolio)[0]
    ? Object.values(portfolio)[0].portfolioStocks
    : null;

  const listOfTabs = [
    "profit and loss",
    "transaction history",
    "graph",
    "alerts",
  ];

  let check = false;
  let portfolioStock = null;

  if (portfolioStocks) {
    portfolioStocks.forEach((stock) => {
      console.log(stock.pstock_id, pstockId);
      if (stock.pstock_id === pstockId) {
        check = true;
        portfolioStock = stock;
      }
    });
  }

  const TransactionRow = ({ date, transaction_type, quantity, price }) => (
    <tr>
      <td>{date}</td>
      <td>{transaction_type === "B" ? "Buy" : "Sell"}</td>
      <td>{quantity}</td>
      <td>{price}</td>
      <td>{quantity * price}</td>
      <td></td>
    </tr>
  );

  const transactionHistory = (
    <table className="portfolio-stock-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Quantity</th>
          <th>Unit Price</th>
          <th>Amount</th>
          <th>Select All</th>
        </tr>
      </thead>
      <tbody>
        {transactions[pstockId].map((transaction) => {
          return <TransactionRow {...transaction} />;
        })}
      </tbody>
    </table>
  );

  const profitLossStock = (
    <div>
      <Accordion>
        <AccordionSummary>details</AccordionSummary>
        <AccordionDetails>test</AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary>details</AccordionSummary>
        <AccordionDetails>test2</AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary>details</AccordionSummary>
        <AccordionDetails>test3</AccordionDetails>
      </Accordion>
    </div>
  );

  if (check) {
    return (
      <div className="portfolio-stock-page">
        <h3>{portfolioStock.stock.name}</h3>
        <Tabs>
          <ul className="tabrow">
            {listOfTabs.map((tabName) => {
              return (
                <li
                  className={currentTab === tabName ? "selected-tab" : null}
                  onClick={() => {
                    setCurrentTab(tabName);
                  }}
                >
                  {tabName}
                </li>
              );
            })}
          </ul>
        </Tabs>
        {currentTab === "profit and loss" ? profitLossStock : null}
        {currentTab === "transaction history" ? transactionHistory : null}
        {currentTab === "graph" ? (
          <GraphTab
            stock={portfolioStock.stock.scrip}
            transactions={transactions[pstockId]}
          />
        ) : null}
      </div>
    );
  } else {
    return <Redirect to="/not-found" />;
  }
};

const mapStateToProps = ({
  portfolioReducer: { portfolio, transactions },
}) => ({
  portfolio: portfolio,
  transactions: transactions,
});
export default connect(mapStateToProps)(PstockPage);
