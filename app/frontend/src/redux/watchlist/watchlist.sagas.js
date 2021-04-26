import { takeLatest, put, call, all } from "redux-saga/effects";
import { watchlistActionTypes } from "./watchlist.types";

import {
  watchlistsFetchSuccess,
  watchlistsFetchFailure,
  watchlistStockAddSuccess,
  watchlistStockAddFailure,
  watchlistStockDeleteSuccess,
  watchlistStockDeleteFailure,
  watchlistCreateSuccess,
  watchlistCreateFailure,
  watchlistDeleteSuccess,
  watchlistDeleteFailure,
  watchlistDeleteMultipleSuccess,
  watchlistDeleteMultipleFailure,
} from "./watchlist.actions";

import {
  fetchUserWatchlists,
  addStockToUserWatchlist,
  deleteStockFromUserWatchlist,
  createUserWatchlist,
  deleteUserWatchlist,
  deleteMultipleWatchlistStocks,
} from "../../utils/watchlist.utils";

export function* fetchWatchlists() {
  try {
    const watchlists = yield fetchUserWatchlists();
    yield put(watchlistsFetchSuccess(watchlists));
  } catch (error) {
    yield put(watchlistsFetchFailure(error));
  }
}

export function* addStockToWatchlist({
  payload: { watchlist, stock, csrftoken },
}) {
  try {
    const stockDetails = yield addStockToUserWatchlist({
      watchlist: watchlist,
      stock: stock,
      csrftoken: csrftoken,
    });

    yield put(watchlistStockAddSuccess(stockDetails));
    console.log(stockDetails);
  } catch (error) {
    yield put(watchlistStockAddFailure(error));
  }
}

export function* deleteStockFromWatchlist({
  payload: { watchlist, stock, csrftoken },
}) {
  try {
    const statusCode = yield deleteStockFromUserWatchlist({
      watchlist: watchlist,
      stock: stock,
      csrftoken: csrftoken,
    });
    if (statusCode === 204) {
      yield put(watchlistStockDeleteSuccess({ watchlist, stock }));
    } else {
      yield put(watchlistStockDeleteFailure(`got status code ${statusCode}`));
    }
  } catch (error) {
    yield put(watchlistStockDeleteFailure(error));
  }
}

export function* createWatchlist({ payload: { watchlistName, csrftoken } }) {
  try {
    const watchlistDetails = yield createUserWatchlist({
      watchlistName,
      csrftoken,
    });
    yield put(watchlistCreateSuccess(watchlistDetails));
  } catch (error) {
    yield put(watchlistCreateFailure(error));
  }
}

export function* deleteWatchlist({ payload: { watchlistId, csrftoken } }) {
  try {
    yield deleteUserWatchlist({ watchlistId, csrftoken });
    yield put(watchlistDeleteSuccess(watchlistId));
  } catch (error) {
    yield put(watchlistDeleteFailure(error));
  }
}

export function* deleteWatchlistMultipleStocks({
  payload: { watchlistId, stocks, csrftoken },
}) {
  try {
    const statusCode = yield deleteMultipleWatchlistStocks({
      csrftoken,
      watchlistId,
      stocks,
    });
    const stockSet = new Set(stocks);
    yield put(
      watchlistDeleteMultipleSuccess({ watchlistId, stockSet, statusCode })
    );
  } catch (error) {
    yield put(watchlistDeleteMultipleFailure(error));
  }
}
export function* onWatchlistFetchStart() {
  yield takeLatest(
    watchlistActionTypes.WATCHLISTS_FETCH_START,
    fetchWatchlists
  );
}

export function* onWatchlistStockAddStart() {
  yield takeLatest(
    watchlistActionTypes.WATCHLIST_STOCK_ADD_START,
    addStockToWatchlist
  );
}

export function* onWatchlistStockDeleteStart() {
  yield takeLatest(
    watchlistActionTypes.WATCHLIST_STOCK_DELETE_START,
    deleteStockFromWatchlist
  );
}

export function* onWatchlistCreateStart() {
  yield takeLatest(
    watchlistActionTypes.WATCHLIST_CREATE_START,
    createWatchlist
  );
}

export function* onWatchlistDeleteStart() {
  yield takeLatest(
    watchlistActionTypes.WATCHLIST_DELETE_START,
    deleteWatchlist
  );
}

export function* onWatchlistDeleteMultipleStart() {
  yield takeLatest(
    watchlistActionTypes.WATCHLIST_DELETE_MULTIPLE_START,
    deleteWatchlistMultipleStocks
  );
}

export function* watchlistSagas() {
  yield all([
    call(onWatchlistFetchStart),
    call(onWatchlistStockAddStart),
    call(onWatchlistStockDeleteStart),
    call(onWatchlistCreateStart),
    call(onWatchlistDeleteStart),
    call(onWatchlistDeleteMultipleStart),
  ]);
}
