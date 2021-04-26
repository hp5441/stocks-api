/* global gapi */

import React from "react";
import { connect } from "react-redux";

import "./sign-in.styles.scss";
import FormInput from "../form-input/form-input.component";
import CustomButton from "../custom-button/custom-button.component";
import {
  googleSignInStart,
  emailSignInStart,
  signOutStart,
} from "../../redux/user/user.actions";
import Chchck from "../randomtest/randomtest.component";

//import oauth2SignIn from "../../oauth/oauth";

class SignIn extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
    };
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    const { emailSignInStart } = this.props;
    await emailSignInStart({ email, password });
    this.setState({ email: "", password: "" });
  };

  handleChange = (event) => {
    const {
      target: { name, value },
    } = event;
    console.log(event.target);
    this.setState({ [name]: value });
  };

  handleGooglelogin = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn().then((user) => {
      const authResponse = user.getAuthResponse(true);
      const Response = fetch("/api/user/google/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authResponse),
      });
      Response.then((res) => res.json()).then((res) => console.log(res));
    });
  };

  handleLogout = () => {
    fetch("/api/user/logout/", {
      method: "POST",
    });
  };

  handleCurrentUser = () => {
    const myResponse = fetch("/api/user/me/");
    myResponse.then((res) => res.json()).then((res) => console.log(res));
  };
  render() {
    const { googleSignInStart, signOutStart } = this.props;
    return (
      <div className="sign-in">
        <h2>I already have an account</h2>
        <span>Sign in with your email and password</span>
        <form onSubmit={this.handleSubmit}>
          <FormInput
            name="email"
            type="email"
            value={this.state.email}
            handleChange={this.handleChange}
            label="Email"
            required
          />
          <FormInput
            name="password"
            type="password"
            value={this.state.password}
            handleChange={this.handleChange}
            label="Password"
            required
          />
          <CustomButton type="submit">Sign in</CustomButton>
          <CustomButton type="button" onClick={googleSignInStart}>
            Log in with Google
          </CustomButton>
          <CustomButton type="button" onClick={this.handleCurrentUser}>
            Get current user
          </CustomButton>
          <CustomButton type="button" onClick={signOutStart}>
            Log out
          </CustomButton>
        </form>
        <Chchck />
      </div>
    );
  }
}

const mapDispatchToprops = (dispatch) => ({
  googleSignInStart: () => dispatch(googleSignInStart()),
  emailSignInStart: ({ email, password }) =>
    dispatch(emailSignInStart({ email, password })),
  signOutStart: () => dispatch(signOutStart()),
});

export default connect(null, mapDispatchToprops)(SignIn);
