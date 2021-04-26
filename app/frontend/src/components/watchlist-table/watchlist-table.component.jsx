import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import "./watchlist-table.styles.scss";
import WatchListTableStock from "../watchlist-table-stock/watchlist-table-stock.component";
import SearchBar from "../search-bar/search-bar.component";
import ContextMenu from "../context-menu/context-menu.component";
import {
  websocketSubStart,
  websocketUnsubStart,
} from "../../redux/websocket/websocket.actions";
import WatchlistHeader from "../watchlist-table-header/watchlist-table-header.component";
import { orderWatchlist } from "../../utils/watchlist.utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import WatchlistModal from "../watchlist-modal/watchlist-modal.component";
import { showModal } from "../../redux/user/user.actions";
import WatchlistDeleteModal from "../watchlist-delete-modal/watchlist-delete-modal.component";
import { Checkbox } from "@material-ui/core";
import Tabs from "../tabs/tabs.component";
import WatchlistTabs from "../watchlist-tabs/watchlist-tabs.component";
import WatchliststocksDeleteModal from "../watchliststocks-delete-modal/watchliststocks-delete-modal";

//import StocksData from "./watchlist-stocks";

const WatchListTable = (props) => {
  const [isMounted, setIsMounted] = useState(false);
  const [stockState, setStockState] = useState(new Set());
  const [orderedBy, setOrderedBy] = useState("scrip");
  const [orderDir, setOrderDir] = useState(1);
  const [watchlistStocks, setWatchlistStocks] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);
  const [stocksSelected, setStocksSelected] = useState({});

  const {
    watchlists,
    currentWatchlist,
    stocks,
    ws,
    isWebsocketConnected,
    websocketSubscriptions,
    watchlistChanges,
    isModalActive,
    showModal,
  } = props;

  const watchlist = watchlists[currentWatchlist];

  useEffect(() => {
    if (watchlist) {
      setWatchlistStocks(
        orderWatchlist(watchlist.watchlistStocks, orderedBy, orderDir)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderedBy, orderDir, watchlistChanges, currentWatchlist]);

  /*const websocketCallback = () => {
    if (ws && watchlist.watchlistStocks.length) {
      ws.subMessage(watchlist.watchlistStocks.map(({ stock }) => stock));
      return () => {
        ws.unsubMessage(watchlist.watchlistStocks.map(({ stock }) => stock));
      };
    }
  };*/
  stockState.add("NIFTY");
  stockState.add("SENSEX")
  const websocketHelper = async () => {
    if (isWebsocketConnected && stockState && ws) {
      console.log(websocketSubscriptions, stockState);
      const subList = new Set();
      stockState.forEach((stock) => {
        if (!websocketSubscriptions.has(stock)) {
          subList.add(stock);
        }
      });
      const unsubList = new Set();
      websocketSubscriptions.forEach((stock) => {
        if (!stockState.has(stock)) {
          unsubList.add(stock);
        }
      });
      if (unsubList.size > 0) {
        await ws.unsubMessage(Array.from(unsubList));
      }
      if (subList.size > 0) {
        await ws.subMessage(Array.from(subList));
      }
    }
  };

  useEffect(() => {
    setStocksSelected({});
  }, [currentWatchlist, watchlistChanges]);

  useEffect(() => {
    if (!isIndeterminate && !isAllChecked && watchlist) {
      const tempState = {};
      watchlist.watchlistStocks.forEach(
        ({ wstock_id }) => (tempState[wstock_id] = false)
      );
      setStocksSelected((prevState) => ({ ...prevState, ...tempState }));
      setIsAllChecked(false);
      setIsIndeterminate(false);
    }
  }, [isIndeterminate, watchlist, watchlistChanges, isAllChecked]);

  useEffect(() => {
    if (watchlist) {
      const every = watchlist.watchlistStocks
        .map(({ wstock_id }) => wstock_id)
        .every((val) => stocksSelected[val]);
      const some = watchlist.watchlistStocks
        .map(({ wstock_id }) => wstock_id)
        .some((val) => stocksSelected[val]);
      console.log(stocksSelected);
      if (every && Object.keys(stocksSelected).length > 0) {
        setIsAllChecked(true);
        setIsIndeterminate(false);
      } else if (some) {
        setIsAllChecked(false);
        setIsIndeterminate(true);
      } else {
        setIsAllChecked(false);
        setIsIndeterminate(false);
      }
    }
  }, [stocksSelected, watchlist]);

  const handleCheck = (e) => {
    const name = e.target.name;
    const isChecked = e.target.checked;
    setStocksSelected((prevState) => ({ ...prevState, [name]: isChecked }));
  };

  const toggleCheckbox = (e) => {
    const isChecked = e.target.checked;
    const indeterminate = e.target.indeterminate;
    console.log(isChecked, indeterminate);
    if (isChecked) {
      const tempState = {};
      watchlist.watchlistStocks.forEach(
        ({ wstock_id }) => (tempState[wstock_id] = true)
      );
      setStocksSelected((prevState) => ({ ...prevState, ...tempState }));
      setIsAllChecked(isChecked);
    } else {
      const tempState = {};
      watchlist.watchlistStocks.forEach(
        ({ wstock_id }) => (tempState[wstock_id] = false)
      );
      setStocksSelected((prevState) => ({ ...prevState, ...tempState }));
      setIsAllChecked(isChecked);
      setIsIndeterminate(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    console.log("mounted");
    return () => {
      setIsMounted(false);
      console.log("unmounted");
    };
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  //useEffect(websocketCallback, []);

  useEffect(() => {
    if (currentWatchlist && watchlist) {
      const tempState = new Set();
      watchlist.watchlistStocks.forEach(({ stock: { scrip } }) => {
        tempState.add(scrip);
      });
      setStockState(tempState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWatchlist, watchlistChanges]);

  useEffect(() => {
    websocketHelper();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockState, isWebsocketConnected]);

  const handleMultipleDelete = () => {
    showModal("watchlistStocksDelete");
  };

  console.log("rendersss");
  console.log(watchlistStocks);
  return (
    <React.Fragment>
      <Tabs>
        <WatchlistTabs />
      </Tabs>
      <WatchlistHeader stocks={watchlistStocks} />

      <div className="watchlist-table-container">
        <table className="watchlist-table">
          <thead>
            <tr>
              <th
                onClick={() => {
                  if (orderedBy !== "date") {
                    setOrderedBy("date");
                    setOrderDir(1);
                  } else {
                    setOrderDir(orderDir * -1);
                  }
                }}
              >
                added on date <FontAwesomeIcon icon={faSort} />
              </th>
              <th
                onClick={() => {
                  if (orderedBy !== "addPrice") {
                    setOrderedBy("addPrice");
                    setOrderDir(1);
                  } else {
                    setOrderDir(orderDir * -1);
                  }
                }}
              >
                added on price <FontAwesomeIcon icon={faSort} />
              </th>
              <th
                onClick={() => {
                  if (orderedBy !== "scrip") {
                    setOrderedBy("scrip");
                    setOrderDir(1);
                  } else {
                    setOrderDir(orderDir * -1);
                  }
                }}
              >
                stock <FontAwesomeIcon icon={faSort} />
              </th>
              <th
                onClick={() => {
                  if (orderedBy !== "ltp") {
                    setOrderedBy("ltp");
                    setOrderDir(1);
                  } else {
                    setOrderDir(orderDir * -1);
                  }
                }}
              >
                LTP <FontAwesomeIcon icon={faSort} />
              </th>
              <th
                onClick={() => {
                  if (orderedBy !== "change") {
                    setOrderedBy("change");
                    setOrderDir(1);
                  } else {
                    setOrderDir(orderDir * -1);
                  }
                }}
              >
                change <FontAwesomeIcon icon={faSort} />
              </th>
              <th
                onClick={() => {
                  if (orderedBy !== "changePercent") {
                    setOrderedBy("changePercent");
                    setOrderDir(1);
                  } else {
                    setOrderDir(orderDir * -1);
                  }
                }}
              >
                change % <FontAwesomeIcon icon={faSort} />
              </th>
              <th
                onClick={() => {
                  if (orderedBy !== "changePercentSpan") {
                    setOrderedBy("changePercentSpan");
                    setOrderDir(1);
                  } else {
                    setOrderDir(orderDir * -1);
                  }
                }}
              >
                chg % since added <FontAwesomeIcon icon={faSort} />
              </th>
              <th>
                Select All
                <Checkbox
                  name="select-all"
                  onChange={toggleCheckbox}
                  checked={isAllChecked}
                  indeterminate={isIndeterminate}
                />
                {isIndeterminate || isAllChecked ? (
                  <FontAwesomeIcon
                    onClick={handleMultipleDelete}
                    icon={faTrashAlt}
                  />
                ) : null}
              </th>
            </tr>
          </thead>
          <tbody id="watchlist-tbody">
            {watchlist
              ? watchlistStocks.map(
                  ({ wstock_id, stock, date_added, price_when_added }) => (
                    <WatchListTableStock
                      key={wstock_id}
                      stock={stock}
                      stockId={wstock_id}
                      addedOnDate={date_added}
                      addedOnPrice={price_when_added}
                    >
                      <Checkbox
                        name={wstock_id}
                        onChange={handleCheck}
                        checked={stocksSelected[wstock_id] ? true : false}
                      />
                    </WatchListTableStock>
                  )
                )
              : ""}
            <tr>
              <td colSpan="8">
                <SearchBar stocks={stocks} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <FontAwesomeIcon
        icon={faTrashAlt}
        onClick={() => {
          showModal("watchlistDelete");
        }}
      />
      {isMounted ? <ContextMenu pos={1} elem="watchlist-table-stock" /> : ""}
      {isModalActive === "watchlistCreate" ? (
        <WatchlistModal modalText={"hello"} />
      ) : null}
      {isModalActive === "watchlistDelete" ? (
        <WatchlistDeleteModal
          watchlistId={currentWatchlist}
          watchlistName={watchlist.watchlist_name}
        />
      ) : null}
      {isModalActive === "watchlistStocksDelete" ? (
        <WatchliststocksDeleteModal
          watchlistId={currentWatchlist}
          stocks={Object.keys(stocksSelected).filter(
            (val) => stocksSelected[val]
          )}
        />
      ) : null}
    </React.Fragment>
  );
};

const mapStateToProps = ({
  userReducer: { stocks, showModal },
  watchlistReducer: { watchlists, currentWatchlist, watchlistChanges },
  websocketReducer: { connected, subscribed, socket },
}) => ({
  stocks: stocks,
  watchlists: watchlists,
  currentWatchlist: currentWatchlist,
  isWebsocketConnected: connected,
  websocketSubscriptions: subscribed,
  socket: socket,
  watchlistChanges: watchlistChanges,
  isModalActive: showModal,
});

const mapDispatchToProps = (dispatch) => ({
  websocketSub: (subList) => {
    dispatch(websocketSubStart(subList));
  },
  websocketUnsub: (unsubList) => {
    dispatch(websocketUnsubStart(unsubList));
  },
  showModal: (modalType) => {
    dispatch(showModal(modalType));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(WatchListTable);
