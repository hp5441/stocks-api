import React, { useState } from "react";
import { connect } from "react-redux";

import CustomButton from "../custom-button/custom-button.component";
import { watchlistCreateStart } from "../../redux/watchlist/watchlist.actions";
import ModalWrapper from "../modal-wrapper/modal-wrapper.component";
import { closeModal } from "../../redux/user/user.actions";

const WatchlistModal = (props) => {
  const [watchlistName, setWatchlistName] = useState("");
  const { modalText, addWatchlist, csrftoken, closeModal } = props;

  const handleChange = (e) => {
    setWatchlistName(e.target.value);
    console.log(watchlistName);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (watchlistName.length > 0) {
      addWatchlist(watchlistName, csrftoken);
      setWatchlistName("");
      closeModal();
    }
  };
  return (
    <ModalWrapper>
      <p>{modalText}</p>
      <form onSubmit={handleSubmit}>
        <input onChange={handleChange} value={watchlistName} />
        <CustomButton type="button" onClick={handleSubmit}>
          Create
        </CustomButton>
      </form>
    </ModalWrapper>
  );
};

const mapStateToProps = ({ userReducer: { csrftoken } }) => ({
  csrftoken: csrftoken,
});

const mapDispatchToProps = (dispatch) => ({
  addWatchlist: (watchlistName, csrftoken) => {
    dispatch(watchlistCreateStart({ watchlistName, csrftoken }));
  },
  closeModal: () => {
    dispatch(closeModal());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(WatchlistModal);
