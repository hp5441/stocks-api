import React from "react";
import { connect } from "react-redux";

import "./search-bar.styles.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { watchlistStockAddStart } from "../../redux/watchlist/watchlist.actions";

import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";

// const formElem = (<form onSubmit={this.handleSubmit}>
//   <div className="autocomplete">
//     <input
//       type="text"
//       placeholder="Add Stock"
//       onChange={this.handleChange}
//       value={value}
//       onKeyDown={this.handleKeyDown}
//     />
//     <div className="autocomplete-items">
//       {filteredStocks.map((stock, ind) => (
//         <div
//           key={stock}
//           onClick={this.handleClickStock}
//           className={ind === activeInd ? "active-stock" : null}
//         >
//           {stock}
//         </div>
//       ))}
//     </div>
//   </div>
// </form>)

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      filteredStocks: [],
      stockMap: {},
      activeInd: -1,
    };
  }

  componentDidMount() {
    let tempStockMap = {};
    this.props.stocks.forEach((stock) => {
      tempStockMap[stock.name] = stock.scrip;
    });
    this.setState({ stockMap: tempStockMap });
    tempStockMap = {};
  }

  // handleChange = (e) => {
  //   this.setState({ value: e.target.value });
  //   if (e.target.value.length >= 3) {
  //     this.showHints(e.target.value);
  //   } else {
  //     this.setState({ filteredStocks: [] });
  //   }
  // };

  componentDidUpdate(prevProps) {
    if (
      prevProps.watchlist !== this.props.watchlist ||
      prevProps.watchlistChanges !== this.props.watchlistChanges
    ) {
      console.log("hello");
      this.setState({ value: "" });
    }
  }
  handleChangeMat = (e, v) => {
    console.log(v);
    this.setState({ value: v });
    if (v.length >= 3) {
      this.showHints(v);
    } else {
      this.setState({ filteredStocks: [] });
    }
  };

  handleSubmit = (e) => {
    const { stockAddStart, csrftoken, watchlist, watchlists } = this.props;
    e.preventDefault();
    console.log(this.state.filteredStocks);
    if (this.state.filteredStocks.length >= 1) {
      if (this.state.value in this.state.stockMap) {
        let check = true;
        watchlists[watchlist].watchlistStocks.forEach(
          ({ stock: { scrip } }) => {
            if (scrip === this.state.stockMap[this.state.value]) {
              window.alert("scrip already exists");
              check = false;
            }
          }
        );
        if (check) {
          stockAddStart(
            watchlist,
            this.state.stockMap[this.state.value],
            csrftoken
          );
          this.setState({ value: "" });
        }
      }
    }
  };

  showHints = (searchTerm) => {
    const tempStocks = [];
    this.props.stocks.forEach((stock) => {
      if (
        stock.scrip.substr(0, searchTerm.length).toUpperCase() ===
          searchTerm.toUpperCase() ||
        stock.name.substr(0, searchTerm.length).toUpperCase() ===
          searchTerm.toUpperCase()
      ) {
        tempStocks.push(stock.name);
      }
    });
    this.setState({ filteredStocks: tempStocks });
  };

  handleClickStock = (e) => {
    this.setState({
      value: e.target.innerText,
      filteredStocks: [],
    });
  };

  handleKeyDown = (e) => {
    if (this.state.filteredStocks.length === 0) return;
    if (e.keyCode === 40) {
      this.setState({ activeInd: this.state.activeInd + 1 });
    } else if (e.keyCode === 38) {
      this.setState({ activeInd: this.state.activeInd - 1 });
    } else if (e.keyCode === 13) {
      e.preventDefault();

      if (this.state.activeInd > -1) {
        this.setState(
          {
            value: this.state.filteredStocks[this.state.activeInd],
          },
          () => this.setState({ filteredStocks: [] })
        );
      } else {
        this.setState(
          {
            value: this.state.filteredStocks[0],
          },
          () => this.setState({ filteredStocks: [] })
        );
      }
    }
    if (this.state.activeInd > this.state.filteredStocks.length - 1) {
      this.setState({ activeInd: 0 });
    } else if (this.state.activeInd < -1) {
      this.setState({ activeInd: this.state.filteredStocks.length - 1 });
    }
  };

  render() {
    const { filteredStocks, value } = this.state;
    console.log(filteredStocks);
    return (
      <div className="auto-complete">
        <form onSubmit={this.handleSubmit}>
          <Autocomplete
            options={filteredStocks}
            value={value}
            onChange={(e, v) => console.log(e, v)}
            onSubmit={this.handleSubmit}
            noOptionsText="Search"
            clearOnEscape={true}
            clearOnBlur={true}
            onInputChange={this.handleChangeMat}
            getOptionSelected={()=>true}
            style={{ width: "300px" }}
            renderInput={(params) => (
              <TextField {...params} label="Add Stock" variant="outlined" />
            )}
          />
        </form>
        <FontAwesomeIcon
          icon={faPlus}
          onClick={this.handleSubmit}
          className="submit-stock"
        />
      </div>
    );
  }
}

const mapStateToProps = ({
  userReducer: { csrftoken },
  watchlistReducer: { currentWatchlist, watchlists, watchlistChanges },
}) => ({
  csrftoken: csrftoken,
  watchlist: currentWatchlist,
  watchlists: watchlists,
  watchlistChanges: watchlistChanges,
});

const mapDispatchToProps = (dispatch) => ({
  stockAddStart: (watchlist, stock, csrftoken) =>
    dispatch(watchlistStockAddStart({ watchlist, stock, csrftoken })),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
