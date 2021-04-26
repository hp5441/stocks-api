import { takeLatest, all, call, put } from "@redux-saga/core/effects";
import {
  addTransaction,
  fetchNews,
  fetchTransactions,
  fetchUserPortfolio,
} from "../../utils/portfolio.utils";
import {
  fetchNewsFailure,
  fetchNewsSuccess,
  fetchTransactionFailure,
  fetchTransactionSuccess,
  portfolioFetchFailure,
  portfolioFetchSuccess,
  portfolioStockTransactionFailure,
  portfolioStockTransactionSuccess,
} from "./portfolio.actions";
import { portfolioActionTypes } from "./portfolio.types";

export function* portfolioFetch() {
  try {
    const portfolio = yield fetchUserPortfolio();
    yield put(portfolioFetchSuccess(portfolio));
  } catch (error) {
    yield put(portfolioFetchFailure(error));
  }
}

export function* fetchTransaction({ payload: { portfolioId } }) {
  try {
    const transactions = yield fetchTransactions(portfolioId);
    yield put(fetchTransactionSuccess(transactions));
  } catch (error) {
    yield put(fetchTransactionFailure(error));
  }
}

export function* addStockTransaction({
  payload: { transactionDetails, csrftoken, stockDetails },
}) {
  try {
    const transaction = yield addTransaction({
      ...transactionDetails,
      csrftoken,
    });
    yield put(
      portfolioStockTransactionSuccess({ ...transaction, stockDetails })
    );
  } catch (error) {
    yield put(portfolioStockTransactionFailure(error));
  }
}

export function* fetchStockNews({ payload: { stockDetails, csrftoken } }) {
  try {
    const news = yield fetchNews(stockDetails, csrftoken);
    yield put(fetchNewsSuccess(news));
  } catch (error) {
    yield put(fetchNewsFailure(error));
  }
}

export function* onPortfolioFetchStart() {
  yield takeLatest(portfolioActionTypes.PORTFOLIO_FETCH_START, portfolioFetch);
}

export function* onTransactionsFetchStart() {
  yield takeLatest(
    portfolioActionTypes.FETCH_TRANSACTION_START,
    fetchTransaction
  );
}

export function* onTransactionAddStart() {
  yield takeLatest(
    portfolioActionTypes.PORTFOLIO_STOCK_TRANSACTION_START,
    addStockTransaction
  );
}

export function* onNewsFetchStart() {
  yield takeLatest(portfolioActionTypes.FETCH_NEWS_START, fetchStockNews);
}

export function* portfolioSagas() {
  yield all([
    call(onPortfolioFetchStart),
    call(onTransactionsFetchStart),
    call(onTransactionAddStart),
    call(onNewsFetchStart),
  ]);
}
