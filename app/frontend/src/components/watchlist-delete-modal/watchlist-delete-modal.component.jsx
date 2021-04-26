import React from "react";
import { connect } from "react-redux";
import { closeModal } from "../../redux/user/user.actions";
import { watchlistDeleteStart } from "../../redux/watchlist/watchlist.actions";

import CustomButton from "../custom-button/custom-button.component";
import ModalWrapper from "../modal-wrapper/modal-wrapper.component";
import "./watchlist-delete-modal.styles.scss";

const WatchlistDeleteModal = (props) => {
  const {
    watchlistName,
    watchlistId,
    deleteWatchlist,
    closeModal,
    csrftoken,
  } = props;

  const handleClick = () => {
    deleteWatchlist(watchlistId, csrftoken);
    closeModal();
  };
  return (
    <ModalWrapper>
      <p>Would you like to delete {watchlistName} ?</p>
      <CustomButton onClick={handleClick} />
    </ModalWrapper>
  );
};

const mapStateToProps = ({ userReducer: { csrftoken } }) => ({
  csrftoken: csrftoken,
});
const mapDispatchToProps = (dispatch) => ({
  deleteWatchlist: (watchlistId, csrftoken) => {
    dispatch(watchlistDeleteStart({ watchlistId, csrftoken }));
  },
  closeModal: () => {
    dispatch(closeModal());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WatchlistDeleteModal);
