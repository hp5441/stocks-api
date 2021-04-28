import React, { useContext, useEffect } from "react";
import { connect } from "react-redux";
import PortfolioTable from "../../components/portfolio-table/portfolio-table.component";
import Sidenav from "../../components/sidenav/sidenav.component";
import withSpinner from "../../components/spinner/with-spinner.component";
import TopBar from "../../components/top-bar/top-bar.component";
import {
  fetchTransactionStart,
  portfolioFetchStart,
} from "../../redux/portfolio/portfolio.actions";
import { closeModal } from "../../redux/user/user.actions";
import { WebSocketContext } from "../../utils/websocketConnection.utils";
import "./portfolio.styles.scss";

const WrappedPortfolioTable = withSpinner(PortfolioTable);

const Portfolio = (props) => {
  const ws = useContext(WebSocketContext);
  const { loading, fetchPortfolio, fetchTransactions, portfolio } = props;

  const portfolioLength = Object.keys(portfolio)[0];
  console.log(portfolioLength, "hh");

  useEffect(() => {
    fetchPortfolio();
    return () => {
      ws.socket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (portfolioLength) {
      fetchTransactions(portfolioLength);
    }
  }, [portfolioLength]);
  return (
    <React.Fragment>
      <Sidenav />
      <TopBar />
      <div className="portfolio">
        <WrappedPortfolioTable ws={ws} isLoading={loading} />
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = ({ portfolioReducer: { isLoading, portfolio } }) => ({
  loading: isLoading,
  portfolio: portfolio,
});

const mapDispatchToProps = (dispatch) => ({
  fetchPortfolio: () => {
    dispatch(portfolioFetchStart());
  },
  fetchTransactions: (portfolioId) => {
    dispatch(fetchTransactionStart({ portfolioId }));
  },
  closeModal: () => {
    dispatch(closeModal());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
