import React from "react";
import Sidenav from "../../components/sidenav/sidenav.component";
import PrimarySearchAppBar from "../../components/top-bar/top-bar.component";

import "./dashboard.styles.scss";

class Dashboard extends React.Component {
  render() {
    console.log(this.props);
    return (
      <div>
        <Sidenav />
        <PrimarySearchAppBar />
        <div className="dashboard">
          <div className="dashboard-item" id="one">
            <h1>Test</h1>
          </div>
          <div className="dashboard-item" id="two"></div>
          <div className="dashboard-item" id="three"></div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
