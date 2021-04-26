import React from "react";
import { Link } from "react-router-dom";
import "./sidenav.styles.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArchway,
  faIndustry,
  faChartLine,
  faBriefcase,
  faDesktop,
} from "@fortawesome/free-solid-svg-icons";
import { ReactComponent as SidenavLogo } from "../../assets/chest.svg";
const Sidenav = (props) => {
  return (
    <div className="sidenav">
      <div className="logo-container">
        <SidenavLogo className="logo" />
        <span className="logo-title">App</span>
      </div>
      <Link to="/dashboard">
        <FontAwesomeIcon icon={faDesktop} className="menu-icon" />
        Dashboard
      </Link>
      <a href="/">
        <FontAwesomeIcon icon={faArchway} className="menu-icon" />
        About us
      </a>
      <a href="/">
        <FontAwesomeIcon icon={faIndustry} className="menu-icon" />
        Market
      </a>
      <Link to="/watchlist">
        <FontAwesomeIcon icon={faChartLine} className="menu-icon" />
        Watchlist
      </Link>
      <a href="/portfolio">
        <FontAwesomeIcon icon={faBriefcase} className="menu-icon" />
        Portfolio
      </a>
    </div>
  );
};

export default Sidenav;
