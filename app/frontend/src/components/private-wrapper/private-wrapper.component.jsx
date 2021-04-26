import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

const PrivateWrapper = ({ children, currentUser }) => {
  if (currentUser) {
    return { children };
  } else {
    return <Redirect to="/" />;
  }
};

const mapStateToProps = ({ userReducer: { currentUser } }) => ({
  currentUser: currentUser,
});

export default connect(mapStateToProps)(PrivateWrapper);
