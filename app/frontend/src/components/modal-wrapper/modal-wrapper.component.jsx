import React from "react";
import { connect } from "react-redux";
import { closeModal } from "../../redux/user/user.actions";

import "./modal-wrapper.styles.scss";

const ModalWrapper = (props) => {
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) props.closeModal();
  };

  return (
    <div className="modal" onClick={handleBackgroundClick}>
      <div className="modal-content">{props.children}</div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => {
    dispatch(closeModal());
  },
});

export default connect(null, mapDispatchToProps)(ModalWrapper);
