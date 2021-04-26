import React from "react";

import "./tabs.styles.scss";

const Tabs = (props) => {
  return <div className="tabs">{props.children}</div>;
};

export default Tabs;
