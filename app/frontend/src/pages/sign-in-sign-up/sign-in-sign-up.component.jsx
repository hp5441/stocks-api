import React from "react";
import SignIn from "../../components/sign-in/sign-in.component";
import "./sign-in-sign-up.styles.scss";

const SignInAndSignUpPage = (props) => {
  console.log(props);
  return (
    <div className="sign-in-sign-up">
      <SignIn />
    </div>
  );
};

export default SignInAndSignUpPage;
