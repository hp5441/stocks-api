import React, { useContext, useEffect } from "react";
import { connect } from "react-redux";
import Sidenav from "../../components/sidenav/sidenav.component";
import WatchListTable from "../../components/watchlist-table/watchlist-table.component";
import "./watchlist.styles.scss";
import withSpinner from "../../components/spinner/with-spinner.component";
import { WebSocketContext } from "../../utils/websocketConnection.utils";
import { watchlistsFetchStart } from "../../redux/watchlist/watchlist.actions";
import TopBar from "../../components/top-bar/top-bar.component";

const WatchListTableWithSpinner = withSpinner(WatchListTable);

const WatchList = (props) => {
  const ws = useContext(WebSocketContext);
  const { loading, fetchWatchlists } = props;

  useEffect(() => {
    fetchWatchlists();
    return () => {
      ws.socket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(props);
  return (
    <React.Fragment>
      <Sidenav />
      <TopBar />
      <div className="watchlist">
        <WatchListTableWithSpinner isLoading={loading} ws={ws} />
      </div>
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  fetchWatchlists: () => {
    dispatch(watchlistsFetchStart());
  },
});

const mapStateToProps = ({ watchlistReducer: { isLoading } }) => ({
  loading: isLoading,
});

export default connect(mapStateToProps, mapDispatchToProps)(WatchList);
