import React from "react";
import { Route, Switch } from "react-router-dom";
import Dashboard from "./pages/dashboard/dashboard.component";
import WatchList from "./pages/watchlist/watchlist.component";
import SignInAndSignUpPage from "./pages/sign-in-sign-up/sign-in-sign-up.component";
import { config, gapiScript } from "./auth/auth.utils";
import "./App.scss";
import Portfolio from "./pages/portfolio/portfolio.component";
import StockPages from "./pages/stockpages/stockpages.component";
import NotFound from "./pages/error-not-found/error-not-found.component";
import WebsocketWrapper from "./components/websocket-wrapper/websocket-wrapper.component";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const WrappedWatchlist = WebsocketWrapper(WatchList);
const WrappedPortfolio = WebsocketWrapper(Portfolio);
const WrappedDashboard = WebsocketWrapper(Dashboard);

class App extends React.Component {
  componentDidMount() {
    gapiScript(config);
  }

  render() {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div className="main">
          <Switch>
            <Route exact path="/" component={SignInAndSignUpPage} />
            <Route path="/portfolio" component={WrappedPortfolio} />
            <Route exact path="/watchlist" component={WrappedWatchlist} />
            <Route exact path="/dashboard" component={WrappedDashboard} />
            <Route path="/stockpages" component={StockPages} />
            <Route path="/*" component={NotFound} />
          </Switch>
        </div>
      </MuiPickersUtilsProvider>
    );
  }
}

export default App;
