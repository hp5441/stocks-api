import { combineReducers } from "redux";

import userReducer from "./user/user.reducer";
import watchlistReducer from "./watchlist/watchlist.reducer";
import websocketReducer from "./websocket/websocket.reducer";
import portfolioReducer from "./portfolio/portfolio.reducer";

export const rootReducer = combineReducers({
  userReducer,
  watchlistReducer,
  websocketReducer,
  portfolioReducer,
});
