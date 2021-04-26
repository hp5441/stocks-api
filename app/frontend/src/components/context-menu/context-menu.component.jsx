import React from "react";
import { connect } from "react-redux";
import { watchlistStockDeleteStart } from "../../redux/watchlist/watchlist.actions";
import "./context-menu.styles.scss";

class ContextMenu extends React.Component {
  state = {
    xPos: "0px",
    yPos: "0px",
    showMenu: false,
    element: null,
  };

  componentDidMount() {
    const x = document.getElementById("watchlist-tbody");
    if (x) {
      x.addEventListener("contextmenu", this.handleContextMenu);
    }
    document.addEventListener("click", this.handleClick);
  }

  componentWillUnmount() {
    const x = document.getElementById("watchlist-tbody");
    if (x) {
      x.removeEventListener("contextmenu", this.handleContextMenu);
    }
    document.removeEventListener("click", this.handleClick);
  }

  handleClick = () => {
    this.setState({ showMenu: false });
  };

  handleContextMenu = (e) => {
    e.preventDefault();
    console.log(e);
    const { pos, elem } = this.props;
    if (elem === e.path[pos].className) {
      console.log(e.path[pos].id);
      this.setState({
        xPos: `${e.pageX}px`,
        yPos: `${e.pageY}px`,
        showMenu: true,
        element: e.path[pos],
      });
    }
  };

  deleteStock = async () => {
    const { element } = this.state;
    const { csrftoken, watchlist, deleteStockStart } = this.props;
    await deleteStockStart(watchlist, element.id.split("_")[1], csrftoken);
  };

  render() {
    const { xPos, yPos, showMenu } = this.state;
    if (showMenu) {
      return (
        <ul
          className="context-menu"
          style={{
            position: "absolute",
            top: yPos,
            left: xPos,
          }}
        >
          <li onClick={this.deleteStock}>Delete</li>
        </ul>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = ({
  userReducer: { csrftoken },
  watchlistReducer: { currentWatchlist },
}) => ({
  csrftoken: csrftoken,
  watchlist: currentWatchlist,
});

const mapDispatchToProps = (dispatch) => ({
  deleteStockStart: (watchlist, stock, csrftoken) => {
    dispatch(
      watchlistStockDeleteStart({
        watchlist,
        stock,
        csrftoken,
      })
    );
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(ContextMenu);
