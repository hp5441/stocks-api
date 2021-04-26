import React from "react";
import { connect } from "react-redux";
import { showModal } from "../../redux/user/user.actions";
import { watchlistChange } from "../../redux/watchlist/watchlist.actions";

const WatchlistTabs = (props) => {
  const {
    showModal,
    watchlists,
    currentWatchlist,
    setWatchlistId,
  } = props;

  let watchlistIds;
  if (watchlists) {
    watchlistIds = Object.keys(watchlists)
      .map((val) => parseInt(val))
      .sort((a, b) => a - b);
  }

  return (
    <ul className="tabrow">
      {watchlistIds
        ? watchlistIds.map((id) => {
            console.log("why??");
            return (
              <li
                key={id}
                onClick={() => setWatchlistId(id)}
                className={
                  id === parseInt(currentWatchlist) ? "selected-tab" : ""
                }
              >
                {watchlists[id].watchlist_name}
              </li>
            );
          })
        : null}
      <li
        onClick={() => {
          showModal("watchlistCreate");
        }}
      >
        +
      </li>
    </ul>
  );
};

const mapStateToProps = ({
  userReducer: { stocks, showModal },
  watchlistReducer: { watchlists, currentWatchlist, watchlistChanges },
}) => ({
  stocks: stocks,
  watchlists: watchlists,
  currentWatchlist: currentWatchlist,
  isModalActive: showModal,
  watchlistChanges: watchlistChanges,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (modalType) => {
    dispatch(showModal(modalType));
  },
  setWatchlistId: (id) => {
    dispatch(watchlistChange(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(WatchlistTabs);
