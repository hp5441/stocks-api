import { portfolioActionTypes } from "./portfolio.types";

export const portfolioFetchStart = () => ({
  type: portfolioActionTypes.PORTFOLIO_FETCH_START,
});

export const portfolioFetchSuccess = (portfolio) => ({
  type: portfolioActionTypes.PORTFOLIO_FETCH_SUCCESS,
  payload: portfolio,
});

export const portfolioFetchFailure = (error) => ({
  type: portfolioActionTypes.PORTFOLIO_FETCH_FAILURE,
  payload: error,
});

export const portfolioStockTransactionStart = (stockDetails) => ({
  type: portfolioActionTypes.PORTFOLIO_STOCK_TRANSACTION_START,
  payload: stockDetails,
});

export const portfolioStockTransactionSuccess = (stockDetails) => ({
  type: portfolioActionTypes.PORTFOLIO_STOCK_TRANSACTION_SUCCESS,
  payload: stockDetails,
});

export const portfolioStockTransactionFailure = (error) => ({
  type: portfolioActionTypes.PORTFOLIO_STOCK_TRANSACTION_FAILURE,
  payload: error,
});

export const fetchTransactionStart = (stockDetails) => ({
  type: portfolioActionTypes.FETCH_TRANSACTION_START,
  payload: stockDetails,
});

export const fetchTransactionSuccess = (stockDetails) => ({
  type: portfolioActionTypes.FETCH_TRANSACTION_SUCCESS,
  payload: stockDetails,
});

export const fetchTransactionFailure = (stockDetails) => ({
  type: portfolioActionTypes.FETCH_TRANSACTION_FAILURE,
  payload: stockDetails,
});

export const fetchNewsStart = (stockDetails) => ({
  type: portfolioActionTypes.FETCH_NEWS_START,
  payload: stockDetails,
});

export const fetchNewsSuccess = (stockDetails) => ({
  type: portfolioActionTypes.FETCH_NEWS_SUCCESS,
  payload: stockDetails,
});

export const fetchNewsFailure = (stockDetails) => ({
  type: portfolioActionTypes.FETCH_NEWS_FAILURE,
  payload: stockDetails,
});