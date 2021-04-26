import { portfolioActionTypes } from "./portfolio.types";

const INITIAL_STATE = {
  portfolio: {},
  transactions: {},
  newsItems: {},
  transactionChanges: false,
  isLoading: true,
  error: null,
};

const portfolioReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case portfolioActionTypes.PORTFOLIO_STOCK_TRANSACTION_START:
      return {
        ...state,
        transactionChanges: true,
        isLoading: true,
        error: null,
      };
    case portfolioActionTypes.PORTFOLIO_FETCH_START:
      return {
        ...state,
        transactionChanges: true,
        isLoading: true,
      };
    case portfolioActionTypes.PORTFOLIO_FETCH_SUCCESS:
      return {
        ...state,
        portfolio: action.payload,
        transactionChanges: false,
        isLoading: false,
        error: null,
      };
    case portfolioActionTypes.FETCH_TRANSACTION_START:
      return {
        ...state,
        isLoading: true,
      };
    case portfolioActionTypes.FETCH_TRANSACTION_SUCCESS:
      return {
        ...state,
        transactions: action.payload,
        error: null,
      };
    case portfolioActionTypes.PORTFOLIO_STOCK_TRANSACTION_SUCCESS:
      const pstockId =
        action.payload.portfolio.toString() + "_" + action.payload.stock;
      if (pstockId in state.transactions) {
        state.transactions[pstockId].push(action.payload);
      } else {
        state.transactions[pstockId] = [];
        state.transactions[pstockId].push(action.payload);
        state.portfolio[action.payload.portfolio].portfolioStocks.push({
          portfolio: action.payload.portfolio,
          pstock_id: pstockId,
          quantity: action.payload.quantity,
          stock: action.payload.stockDetails,
        });
      }
      return {
        ...state,
        transactionChanges: false,
        isLoading: false,
        error: null,
      };
    case portfolioActionTypes.FETCH_NEWS_SUCCESS:
      return {
        ...state,
        newsItems: action.payload,
      };
    case portfolioActionTypes.PORTFOLIO_FETCH_FAILURE:
    case portfolioActionTypes.FETCH_TRANSACTION_FAILURE:
    case portfolioActionTypes.PORTFOLIO_STOCK_TRANSACTION_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default portfolioReducer;
