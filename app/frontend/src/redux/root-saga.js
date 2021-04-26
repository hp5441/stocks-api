import { all, call } from "redux-saga/effects";

import { userSagas } from "./user/user.sagas";
import { watchlistSagas } from "./watchlist/watchlist.sagas";
import { websocketSagas } from "./websocket/websocket.sagas";
import { portfolioSagas } from "./portfolio/portfolio.sagas";

export default function* rootSaga() {
  yield all([
    call(userSagas),
    call(watchlistSagas),
    call(websocketSagas),
    call(portfolioSagas),
  ]);
}
