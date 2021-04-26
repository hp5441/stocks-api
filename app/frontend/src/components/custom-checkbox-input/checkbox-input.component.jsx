import React from "react";
import { connect } from "react-redux";

import { Checkbox } from "@material-ui/core";
import {
  deselectAllStocks,
  deselectStock,
  selectAllStocks,
  selectStock,
} from "../../redux/watchlist/watchlist.actions";

class CustomCheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: 0,
    };
  }

  handleChecked = () => {
    const {
      name,
      addStocks,
      addStock,
      removeStocks,
      removeStock,
      watchlists,
      currentWatchlist,
    } = this.props;
    const { isChecked } = this.state;

    const stockList = watchlists[currentWatchlist].watchlistStocks.map(
      ({ stock: { wstock_id } }) => wstock_id
    );

    if (name === "select-all") {
      if (isChecked) {
        removeStocks(stockList);
      } else {
        addStocks(stockList);
      }
    } else {
      if (isChecked) {
        removeStock(name);
      } else {
        addStock(name);
      }
    }
    this.setState({ isChecked: !isChecked ? 1 : 0 });
  };

  render() {
    const { name } = this.props;
    const { isChecked } = this.state;
    return (
      <div className="custom-check">
        <Checkbox
          checked={isChecked}
          onChange={this.handleChecked}
          inputProps={{ name: name }}
        />
      </div>
    );
  }
}
const mapStateToProps = ({
  watchlistReducer: { isSelected, watchlists, currentWatchlist },
}) => ({
  selectedStocks: isSelected,
});

const mapDispatchToProps = (dispatch) => ({
  addStock: (stock) => {
    dispatch(selectStock(stock));
  },
  removeStock: (stock) => {
    dispatch(deselectStock(stock));
  },
  addStocks: (stocks) => {
    dispatch(selectAllStocks(stocks));
  },
  removeStocks: (stocks) => {
    dispatch(deselectAllStocks(stocks));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(CustomCheckbox);
