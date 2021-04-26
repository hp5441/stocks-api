import React from "react";
import { connect } from "react-redux";
import { closeModal } from "../../redux/user/user.actions";
import { watchlistDeleteMultipleStart } from "../../redux/watchlist/watchlist.actions";

import CustomButton from "../custom-button/custom-button.component";
import ModalWrapper from "../modal-wrapper/modal-wrapper.component";

const WatchlistStocksDeleteModal = (props) => {
  const {
    watchlistId,
    stocks,
    deleteWatchlistStocks,
    closeModal,
    csrftoken,
  } = props;

  const handleClick = () => {
    deleteWatchlistStocks(watchlistId, csrftoken, stocks);
    closeModal();
  };
  return (
    <ModalWrapper>
      <p>Would you like to delete ?</p>
      <CustomButton onClick={handleClick} />
    </ModalWrapper>
  );
};

const mapStateToProps = ({ userReducer: { csrftoken } }) => ({
  csrftoken: csrftoken,
});
const mapDispatchToProps = (dispatch) => ({
  deleteWatchlistStocks: (watchlistId, csrftoken, stocks) => {
    dispatch(watchlistDeleteMultipleStart({ watchlistId, csrftoken, stocks }));
  },
  closeModal: () => {
    dispatch(closeModal());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WatchlistStocksDeleteModal);
