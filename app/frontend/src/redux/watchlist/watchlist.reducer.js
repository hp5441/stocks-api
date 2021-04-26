import { watchlistActionTypes } from "./watchlist.types";

const INITIAL_STATE = {
  watchlists: {},
  currentWatchlist: 0,
  isLoading: true,
  watchlistChanges: false,
  error: null,
};

const watchlistReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case watchlistActionTypes.WATCHLISTS_FETCH_START:
      return {
        ...state,
        isLoading: true,
      };
    case watchlistActionTypes.WATCHLISTS_FETCH_SUCCESS:
      return {
        ...state,
        watchlists: action.payload,
        currentWatchlist: Object.keys(action.payload)[0],
        isLoading: false,
        error: null,
      };
    case watchlistActionTypes.WATCHLIST_STOCK_ADD_START:
      return {
        ...state,
        watchlistChanges: true,
      };
    case watchlistActionTypes.WATCHLIST_STOCK_ADD_SUCCESS:
      const { ...details } = action.payload;
      state.watchlists[`${details.watchlist}`].watchlistStocks.push(details);
      return {
        ...state,
        watchlistChanges: false,
        error: null,
      };
    case watchlistActionTypes.WATCHLIST_STOCK_DELETE_START:
      return {
        ...state,
        watchlistChanges: true,
      };
    case watchlistActionTypes.WATCHLIST_STOCK_DELETE_SUCCESS:
      const { ...items } = action.payload;
      state.watchlists[`${items.watchlist}`].watchlistStocks.forEach(
        ({ stock: { scrip } }, ind) => {
          if (scrip.localeCompare(items.stock) === 0) {
            state.watchlists[`${items.watchlist}`].watchlistStocks.splice(
              ind,
              1
            );
          }
        }
      );

      return {
        ...state,
        watchlistChanges: false,
        error: null,
      };
    case watchlistActionTypes.WATCHLIST_CREATE_START:
      return {
        ...state,
        watchlistChanges: true,
      };
    case watchlistActionTypes.WATCHLIST_CREATE_SUCCESS:
      const { pk, ...otherProps } = action.payload;
      if (pk) {
        state.watchlists[`${pk}`] = otherProps;
        return {
          ...state,
          watchlistChanges: false,
          currentWatchlist: pk,
          error: null,
        };
      }
      return {
        ...state,
        watchlistChanges: false,
      };
    case watchlistActionTypes.WATCHLIST_DELETE_START:
      return {
        ...state,
        watchlistChanges: true,
      };
    case watchlistActionTypes.WATCHLIST_DELETE_SUCCESS:
      delete state.watchlists[`${action.payload}`];
      return {
        ...state,
        watchlistChanges: false,
        currentWatchlist: Object.keys(state.watchlists)[0],
        error: null,
      };
    case watchlistActionTypes.WATCHLIST_DELETE_MULTIPLE_START:
      return {
        ...state,
        watchlistChanges: true,
      };
    case watchlistActionTypes.WATCHLIST_DELETE_MULTIPLE_SUCCESS:
      const { ...otherItems } = action.payload;
      const tempArray = [];
      state.watchlists[`${otherItems.watchlistId}`].watchlistStocks.forEach(
        (stock) => {
          if (!otherItems.stockSet.has(stock.wstock_id)) {
            tempArray.push(stock);
          }
        }
      );
      state.watchlists[`${otherItems.watchlistId}`].watchlistStocks = tempArray;
      return {
        ...state,
        watchlistChanges: false,
        error: null,
      };
    case watchlistActionTypes.WATCHLISTS_FETCH_FAILURE:
    case watchlistActionTypes.WATCHLIST_STOCK_ADD_FAILURE:
    case watchlistActionTypes.WATCHLIST_STOCK_DELETE_FAILURE:
    case watchlistActionTypes.WATCHLIST_CREATE_FAILURE:
    case watchlistActionTypes.WATCHLIST_DELETE_FAILURE:
    case watchlistActionTypes.WATCHLIST_DELETE_MULTIPLE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case watchlistActionTypes.WATCHLIST_CHANGE:
      return {
        ...state,
        currentWatchlist: action.payload,
        error: null,
      };
    default:
      return state;
  }
};

export default watchlistReducer;
