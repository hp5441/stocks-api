import { faEdit, faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Route, Switch, useRouteMatch } from "react-router";
import { portfolioFetchStart } from "../../redux/portfolio/portfolio.actions";
import { showModal } from "../../redux/user/user.actions";
import { filterOpenTransactions } from "../../utils/portfolio.utils";
import AddTransactionModal from "../transaction-modal/add-transaction-modal.component";
import NewsTab from "../news-tab/news-tab.component";
import PstockPage from "../portfolio-stock-page/portfolio-stock-page.component";
import PortfolioTableHeader from "../portfolio-table-header/portfolio-table-header.component";
import PortfolioAllTableStock from "../portfolio-table-stock/portfolio-all-table-stock.component";
import PortfolioPastTableStock from "../portfolio-table-stock/portfolio-past-table-stock.component";
import PortfolioTableStock from "../portfolio-table-stock/portfolio-table-stock.component";
import Tabs from "../tabs/tabs.component";
import { Pie } from "react-chartjs-2";

import "./portfolio-table.styles.scss";

const PortfolioTable = (props) => {
  const {
    portfolio,
    transactions,
    showModal,
    modal,
    transactionChanges,
  } = props;

  const listOfTabs = ["basic", "news & ann", "profit & loss"];

  const [orderedBy, setOrderedBy] = useState("scrip");
  const [orderDir, setOrderDir] = useState(1);
  const [openPositions, setOpenPositions] = useState(null);
  const [closedPositions, setClosedPositions] = useState(null);
  const [portfolioStocks, setPortfolioStocks] = useState(null);
  const [totalInvestment, setTotalInvestment] = useState(null);
  const [totalCurrentValue, setTotalCurrentValue] = useState(null);
  const [totalDaysGainLoss, setTotalDaysGainLoss] = useState(null);
  const [totalRealizedGainLoss, setTotalRealizedGainLoss] = useState(null);
  const [portfolioTableRadio, setPortolioTableRadio] = useState("current");
  const [currentTab, setCurrentTab] = useState("basic");
  const sectorData = {};

  const getPortfolioStocks = Object.values(portfolio)[0]
    ? Object.values(portfolio)[0].portfolioStocks
    : null;

  const handleRadioChange = (e) => {
    if (e.target.value) {
      setPortolioTableRadio(e.target.value);
    }
  };

  useEffect(() => {
    if (getPortfolioStocks) {
      setPortfolioStocks(getPortfolioStocks);
    }
  }, [transactionChanges, getPortfolioStocks]);

  useEffect(() => {
    if (Object.keys(transactions).length > 0) {
      const [open, closed] = filterOpenTransactions(transactions);
      console.log(open, closed, "from setting open close");
      setOpenPositions(open);
      setClosedPositions(closed);
    }
  }, [transactionChanges, transactions]);

  useEffect(() => {
    let tempTotal = 0;
    if (openPositions) {
      Object.values(openPositions).forEach((stock) => {
        stock.forEach(({ quantity, price }) => {
          tempTotal += quantity * price;
        });
      });
      setTotalInvestment(tempTotal);
      console.log(tempTotal, "from tot inv");
    }
  }, [openPositions]);

  useEffect(() => {
    let tempTotal = 0;
    let tempDaysGain = 0;
    let tempRealized = 0;
    if (portfolioStocks && openPositions && closedPositions) {
      portfolioStocks.forEach(({ stock: { ltp, change }, pstock_id }) => {
        if (openPositions[pstock_id].length > 0) {
          openPositions[pstock_id].forEach(({ quantity }) => {
            tempTotal += quantity * ltp;
            tempDaysGain += quantity * change;
          });
        }
        if (closedPositions[pstock_id].length > 0) {
          closedPositions[pstock_id].forEach(
            ({ quantity, price, transaction_type }) => {
              if (transaction_type === "B") {
                tempRealized -= quantity * price;
              } else {
                tempRealized += quantity * price;
              }
            }
          );
        }
      });
      setTotalCurrentValue(tempTotal);
      setTotalDaysGainLoss(tempDaysGain);
      setTotalRealizedGainLoss(tempRealized);
      console.log(tempTotal, "from tot cur val");
    }
  }, [openPositions, closedPositions, portfolioStocks]);

  const notationalGainLoss = (totalCurrentValue - totalInvestment).toFixed(2);

  const currentHoldingTable = (
    <table className="portfolio-table">
      <thead>
        <tr>
          <th
            onClick={() => {
              if (orderedBy !== "scrip") {
                setOrderedBy("scrip");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            stock <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "ltp") {
                setOrderedBy("ltp");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            LTP <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "quantity") {
                setOrderedBy("date");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            Quantity <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "avgCost") {
                setOrderedBy("avgCost");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            Avg Cost <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "amountInvested") {
                setOrderedBy("amountInvested");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            Amount Invested <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "daysChange") {
                setOrderedBy("daysChange");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            Days Change <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "daysChangePercent") {
                setOrderedBy("daysChangePercent");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            Days Change(%) <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "currentNetworth") {
                setOrderedBy("currentNetworth");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            Current Networth <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "todaysGainLoss") {
                setOrderedBy("todaysGainLoss");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            Todays Gain/Loss <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "notationalGainLoss") {
                setOrderedBy("notationalGainLoss");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            Notional Gain/Loss <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "notationalGainLossPercent") {
                setOrderedBy("notationalGainLossPercent");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            Notional Gain/Loss (%) <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "costContribution") {
                setOrderedBy("costContribution");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            Cost Contribution (%) <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "currentValueContribution") {
                setOrderedBy("currentValueContribution");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            Current Value Contribution (%) <FontAwesomeIcon icon={faSort} />
          </th>
          <th>Target Price</th>
          <th>
            Select All
            <Checkbox name="select-all" />
          </th>
        </tr>
      </thead>
      <tbody>
        {portfolioStocks && openPositions
          ? portfolioStocks.map(({ pstock_id, stock }) => {
              let totalQuantity = 0;
              let totalPrice = 0;
              //console.log(pstock_id, openPositions);
              if (openPositions[pstock_id].length > 0) {
                openPositions[pstock_id].forEach(({ quantity, price }) => {
                  totalQuantity += quantity;
                  totalPrice += quantity * price;
                });
                if (sectorData[stock.sector]) {
                  sectorData[stock.sector] += totalPrice;
                } else {
                  sectorData[stock.sector] = totalPrice;
                }

                return (
                  <PortfolioTableStock
                    key={pstock_id}
                    table="current"
                    id={pstock_id}
                    stock={stock}
                    avg_price={totalQuantity ? totalPrice / totalQuantity : 0}
                    quantity={totalQuantity}
                    totalInvestment={totalInvestment}
                    totalCurrentValue={totalCurrentValue}
                  >
                    <div className="td-end">
                      <Checkbox />
                      <IconButton
                        size="small"
                        onClick={() => {
                          showModal({
                            pstock_id,
                            modalType: "addTransaction",
                            name: stock.name,
                          });
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </IconButton>
                    </div>
                  </PortfolioTableStock>
                );
              } else {
                return null;
              }
            })
          : null}
      </tbody>
    </table>
  );

  const pastHoldingsTable = (
    <table className="portfolio-table">
      <thead>
        <tr>
          <th
            onClick={() => {
              if (orderedBy !== "scrip") {
                setOrderedBy("scrip");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            stock <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "ltp") {
                setOrderedBy("ltp");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            LTP <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "quantity") {
                setOrderedBy("date");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            Quantity <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "avgCost") {
                setOrderedBy("avgCost");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            Avg Cost <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "amountInvested") {
                setOrderedBy("amountInvested");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            Amount Invested <FontAwesomeIcon icon={faSort} />
          </th>
          <th>Avg. Sell Price</th>
          <th>Realized Gain Loss</th>
          <th>
            Select All
            <Checkbox name="select-all" />
          </th>
        </tr>
      </thead>
      <tbody>
        {portfolioStocks && openPositions
          ? portfolioStocks.map(({ pstock_id, stock }) => {
              let soldQuantity = 0;
              let totalSoldPrice = 0;
              let totalBoughtPrice = 0;
              //console.log(pstock_id, openPositions);
              if (openPositions[pstock_id].length === 0) {
                closedPositions[pstock_id].forEach(
                  ({ quantity, price, transaction_type }) => {
                    if (transaction_type === "S") {
                      totalSoldPrice += quantity * price;
                      soldQuantity += quantity;
                    } else {
                      totalBoughtPrice += quantity * price;
                    }
                  }
                );
                return (
                  <PortfolioPastTableStock
                    key={pstock_id}
                    table="past"
                    stock={stock}
                    avgCost={soldQuantity ? totalBoughtPrice / soldQuantity : 0}
                    avgSellPrice={
                      soldQuantity ? totalSoldPrice / soldQuantity : 0
                    }
                    quantity={soldQuantity}
                    totalInvestment={totalBoughtPrice}
                    totalExpenditure={totalSoldPrice}
                    id={pstock_id}
                  >
                    <div className="td-end">
                      <Checkbox />
                      <IconButton
                        size="small"
                        onClick={() => {
                          showModal({
                            pstock_id,
                            modalType: "addTransaction",
                            name: stock.name,
                          });
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </IconButton>
                    </div>
                  </PortfolioPastTableStock>
                );
              } else {
                return null;
              }
            })
          : null}
      </tbody>
    </table>
  );

  const AllHoldingsTable = (
    <table className="portfolio-table">
      <thead>
        <tr>
          <th
            onClick={() => {
              if (orderedBy !== "scrip") {
                setOrderedBy("scrip");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            stock <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "ltp") {
                setOrderedBy("ltp");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            LTP <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "quantity") {
                setOrderedBy("date");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            Current Quantity <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "avgCost") {
                setOrderedBy("avgCost");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            Avg Cost <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "amountInvested") {
                setOrderedBy("amountInvested");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            Amount Invested <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "daysChange") {
                setOrderedBy("daysChange");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            Days Change <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "daysChangePercent") {
                setOrderedBy("daysChangePercent");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            Days Change(%) <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "currentNetworth") {
                setOrderedBy("currentNetworth");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            Current Networth <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "todaysGainLoss") {
                setOrderedBy("todaysGainLoss");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            Todays Gain/Loss <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "notationalGainLoss") {
                setOrderedBy("notationalGainLoss");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            Notional Gain/Loss <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "sellPrice") {
                setOrderedBy("sellPrice");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            Avg. Sell Price <FontAwesomeIcon icon={faSort} />
          </th>
          <th
            onClick={() => {
              if (orderedBy !== "currentValueContribution") {
                setOrderedBy("currentValueContribution");
                setOrderDir(1);
              } else {
                setOrderDir(orderDir * -1);
              }
            }}
          >
            Sold Qty <FontAwesomeIcon icon={faSort} />
          </th>
          <th>Realized Gain/Loss</th>
          <th>
            Select All
            <Checkbox name="select-all" />
          </th>
        </tr>
      </thead>
      <tbody>
        {portfolioStocks && openPositions
          ? portfolioStocks.map(({ pstock_id, stock }) => {
              let totalQuantity = 0;
              let totalPrice = 0;
              let soldQuantity = 0;
              let soldPrice = 0;
              let boughtPrice = 0;
              //console.log(pstock_id, openPositions);
              if (openPositions[pstock_id].length > 0) {
                openPositions[pstock_id].forEach(({ quantity, price }) => {
                  totalQuantity += quantity;
                  totalPrice += quantity * price;
                });
              }

              if (closedPositions[pstock_id].length > 0) {
                closedPositions[pstock_id].forEach(
                  ({ quantity, price, transaction_type }) => {
                    if (transaction_type === "S") {
                      soldQuantity += quantity;
                      soldPrice += quantity * price;
                    } else {
                      boughtPrice += quantity * price;
                    }
                  }
                );
              }
              return (
                <PortfolioAllTableStock
                  key={pstock_id}
                  table="all"
                  stock={stock}
                  avg_price={totalQuantity ? totalPrice / totalQuantity : 0}
                  avg_sell_price={soldQuantity ? soldPrice / soldQuantity : 0}
                  quantity={totalQuantity}
                  totalBoughtPrice={boughtPrice}
                  totalSoldPrice={soldPrice}
                  soldQuantity={soldQuantity}
                  id={pstock_id}
                >
                  <div className="td-end">
                    <Checkbox />
                    <IconButton
                      size="small"
                      onClick={() => {
                        showModal({
                          pstock_id,
                          modalType: "addTransaction",
                          name: stock.name,
                        });
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </IconButton>
                  </div>
                </PortfolioAllTableStock>
              );
            })
          : null}
      </tbody>
    </table>
  );

  const pieData = {
    labels: Object.keys(sectorData),
    datasets: [
      {
        label: "sector distribution",
        data: Object.values(sectorData),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChart = (
    <div style={{ width: "300px", marginLeft: "50px" }}>
      <h3>sector distribution</h3>
      <Pie data={pieData} />
    </div>
  );
  const basicTabComp = (
    <div style={{ width: "100%" }}>
      <div className="portfolio-header-transaction">
        <div
          className="rounded-border-button"
          onClick={() => {
            showModal({ modalType: "addTransaction" });
          }}
        >
          <span>Add new transaction</span>
        </div>
      </div>
      <FormControl component="fieldset">
        <RadioGroup row value={portfolioTableRadio} onClick={handleRadioChange}>
          <FormControlLabel
            value="current"
            control={<Radio color="primary" />}
            label="Current Holdings"
          />
          <FormControlLabel
            value="past"
            control={<Radio color="primary" />}
            label="Past Holdings"
          />
          <FormControlLabel
            value="all"
            control={<Radio color="primary" />}
            label="All Holdings"
          />
        </RadioGroup>
      </FormControl>

      {portfolioTableRadio === "current" ? currentHoldingTable : null}
      {portfolioTableRadio === "current" ? pieChart : null}
      {portfolioTableRadio === "past" ? pastHoldingsTable : null}
      {portfolioTableRadio === "all" ? AllHoldingsTable : null}

      {modal ? (
        modal.modalType === "addTransaction" ? (
          <AddTransactionModal />
        ) : null
      ) : null}
    </div>
  );
  console.log(portfolioStocks);

  const portfolioTableContainer = (
    <div className="portfolio-table-container">
      <h2 style={{ marginBottom: "5px" }}>
        {Object.values(portfolio)[0].portfolio_name
          ? Object.values(portfolio)[0].portfolio_name
          : null}
      </h2>
      <div style={{ width: "fit-content" }}>
        <p style={{ cursor: "pointer", fontSize: "12px", marginTop: "0px" }}>
          edit name
        </p>
      </div>
      <PortfolioTableHeader
        totalCurrentValue={totalCurrentValue}
        totalInvestment={totalInvestment}
        totalDaysGainLoss={totalDaysGainLoss}
        totalRealizedGainLoss={totalRealizedGainLoss}
        notationalGainLoss={notationalGainLoss}
      />
      <Tabs>
        <ul className="tabrow">
          {listOfTabs.map((tabName) => {
            return (
              <li
                key={tabName}
                onClick={() => {
                  setCurrentTab(tabName);
                }}
                className={currentTab === tabName ? "selected-tab" : ""}
              >
                {tabName}
              </li>
            );
          })}
        </ul>
      </Tabs>

      {currentTab === "basic" ? basicTabComp : null}
      {currentTab === "news & ann" ? (
        <NewsTab stocks={portfolioStocks} />
      ) : null}
    </div>
  );

  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path}>
        {portfolioTableContainer}
      </Route>
      <Route path={`${path}/:pstockId`}>
        <PstockPage />
      </Route>
    </Switch>
  );
};

const mapStateToProps = ({
  userReducer: { showModal },
  portfolioReducer: { portfolio, transactions, transactionChanges },
}) => ({
  portfolio: portfolio,
  transactions: transactions,
  modal: showModal,
  transactionChanges: transactionChanges,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (modal) => {
    dispatch(showModal(modal));
  },
  fetchPortfolio: () => {
    dispatch(portfolioFetchStart());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioTable);
