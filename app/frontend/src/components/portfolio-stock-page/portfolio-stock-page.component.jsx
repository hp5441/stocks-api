import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
} from "@material-ui/core";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect, useParams } from "react-router";
import { showModal } from "../../redux/user/user.actions";
import AddTransactionModal from "../transaction-modal/add-transaction-modal.component";
import GraphTab from "../real-stock-graph-tab/real-stock-graph-tab.component";
import Tabs from "../tabs/tabs.component";

import "./portfolio-stock-page.styles.scss";
import DeleteTransactionModal from "../transaction-modal/delete-transaction-modal.component";

const PstockPage = (props) => {
  const { portfolio, transactions, modal, showModal } = props;
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

  const TransactionRow = ({
    date,
    transaction_type,
    quantity,
    price,
    pstockId,
    id,
  }) => (
    <tr>
      <td>{date}</td>
      <td>{transaction_type === "B" ? "Buy" : "Sell"}</td>
      <td>{quantity}</td>
      <td>{price}</td>
      <td>{quantity * price}</td>
      <td>
        <IconButton
          size="small"
          onClick={() => {
            showModal({
              pstock_id: pstockId,
              id: id,
              modalType: "editTransaction",
              name: portfolioStock.stock.name,
              date,
              transaction_type,
              quantity,
              price,
              stock: portfolioStock.stock,
            });
          }}
        >
          <FontAwesomeIcon icon={faEdit} />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => {
            showModal({
              pstock_id: pstockId,
              id: id,
              modalType: "deleteTransaction",
            });
          }}
        >
          <FontAwesomeIcon icon={faTrash} />
        </IconButton>
      </td>
    </tr>
  );

  const transactionHistory = (
    <div>
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
          {transactions[pstockId]
            ? transactions[pstockId].map((transaction) => {
                return (
                  <TransactionRow
                    key={transaction.id}
                    {...transaction}
                    pstockId={pstockId}
                  />
                );
              })
            : null}
        </tbody>
      </table>
      {modal ? (
        modal.modalType === "editTransaction" ? (
          <AddTransactionModal />
        ) : null
      ) : null}
      {modal ? (
        modal.modalType === "deleteTransaction" ? (
          <DeleteTransactionModal />
        ) : null
      ) : null}
    </div>
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
    return <Redirect to="/portfolio" />;
  }
};

const mapStateToProps = ({
  userReducer: { showModal },
  portfolioReducer: { portfolio, transactions },
}) => ({
  portfolio: portfolio,
  transactions: transactions,
  modal: showModal,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (modal) => {
    dispatch(showModal(modal));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(PstockPage);
