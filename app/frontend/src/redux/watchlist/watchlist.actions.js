import { watchlistActionTypes } from "./watchlist.types";

export const watchlistsFetchStart = () => ({
  type: watchlistActionTypes.WATCHLISTS_FETCH_START,
});

export const watchlistsFetchSuccess = (watchlists) => ({
  type: watchlistActionTypes.WATCHLISTS_FETCH_SUCCESS,
  payload: watchlists,
});

export const watchlistsFetchFailure = (error) => ({
  type: watchlistActionTypes.WATCHLISTS_FETCH_FAILURE,
  payload: error,
});

export const watchlistChange = (watchlist) => ({
  type: watchlistActionTypes.WATCHLIST_CHANGE,
  payload: watchlist,
});

export const watchlistStockAddStart = (stockDetails) => ({
  type: watchlistActionTypes.WATCHLIST_STOCK_ADD_START,
  payload: stockDetails,
});

export const watchlistStockAddSuccess = (stockDetails) => ({
  type: watchlistActionTypes.WATCHLIST_STOCK_ADD_SUCCESS,
  payload: stockDetails,
});

export const watchlistStockAddFailure = (error) => ({
  type: watchlistActionTypes.WATCHLIST_STOCK_ADD_FAILURE,
  payload: error,
});

export const watchlistStockDeleteStart = (details) => ({
  type: watchlistActionTypes.WATCHLIST_STOCK_DELETE_START,
  payload: details,
});

export const watchlistStockDeleteSuccess = (stock) => ({
  type: watchlistActionTypes.WATCHLIST_STOCK_DELETE_SUCCESS,
  payload: stock,
});

export const watchlistStockDeleteFailure = (error) => ({
  type: watchlistActionTypes.WATCHLIST_STOCK_DELETE_FAILURE,
  payload: error,
});

export const watchlistCreateStart = (details) => ({
  type: watchlistActionTypes.WATCHLIST_CREATE_START,
  payload: details,
});

export const watchlistCreateSuccess = (details) => ({
  type: watchlistActionTypes.WATCHLIST_CREATE_SUCCESS,
  payload: details,
});

export const watchlistCreateFailure = (error) => ({
  type: watchlistActionTypes.WATCHLIST_CREATE_FAILURE,
  payload: error,
});

export const watchlistDeleteStart = (details) => ({
  type: watchlistActionTypes.WATCHLIST_DELETE_START,
  payload: details,
});

export const watchlistDeleteSuccess = (details) => ({
  type: watchlistActionTypes.WATCHLIST_DELETE_SUCCESS,
  payload: details,
});

export const watchlistDeleteFailure = (error) => ({
  type: watchlistActionTypes.WATCHLIST_DELETE_FAILURE,
  payload: error,
});

export const watchlistDeleteMultipleStart = (details) => ({
  type: watchlistActionTypes.WATCHLIST_DELETE_MULTIPLE_START,
  payload: details,
});

export const watchlistDeleteMultipleSuccess = (details) => ({
  type: watchlistActionTypes.WATCHLIST_DELETE_MULTIPLE_SUCCESS,
  payload: details,
});

export const watchlistDeleteMultipleFailure = (error) => ({
  type: watchlistActionTypes.WATCHLIST_DELETE_MULTIPLE_FAILURE,
  payload: error,
});
