import React, { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "../../utils/websocketConnection.utils";
import { connect } from "react-redux";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import { signOutStart } from "../../redux/user/user.actions";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

const PrimarySearchAppBar = (props) => {
  const { currentUser, signOutStart, isWebsocketConnected } = props;

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [NIFTY, setNIFTY] = useState("- - - - - - - ");
  const [SENSEX, setSENSEX] = useState("- - -  - - - - ");

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const ws = useContext(WebSocketContext);

  useEffect(() => {
    if (ws.socket && isWebsocketConnected) {
      ws.subMessage(["NIFTY"]);
      ws.subMessage(["SENSEX"]);
    }
  }, [isWebsocketConnected]);

  useEffect(() => {
    if (ws.socket) {
      ws.socket.on("stock-client", (stockData) => {
        if (stockData.ins === "NIFTY") {
          setNIFTY(stockData);
        } else if (stockData.ins === "SENSEX") {
          setSENSEX(stockData);
        }
      });
    }
  }, [ws]);

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={signOutStart}>Log Out</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>{currentUser ? currentUser.name : null}</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className="top-bar" style={{ marginLeft: "160px" }}>
      <div className={classes.grow}>
        <AppBar position="static">
          <Toolbar style={{ backgroundColor: "#33cccc" }}>
            <div
              className="indices"
              style={{
                display: "flex",
                width: "200px",
                backgroundColor: "white",
                borderRadius: "20px",
                margin: "0 20px",
                padding: "0 10px",
                height: "40px",
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              <p
                style={{
                  fontSize: "15px",
                  marginLeft: "10px",
                  color: "darkslategray",
                }}
              >
                NIFTY{" "}
                <span
                  style={
                    NIFTY.change > 0 ? { color: "green" } : { color: "red" }
                  }
                >
                  {NIFTY.last_price ? Number(NIFTY.last_price).toFixed(2) : 0}{" "}
                  {NIFTY.change ? Number(NIFTY.change).toFixed(2) : 0}
                </span>{" "}
                %
              </p>
            </div>
            <div
              className="indices"
              style={{
                display: "flex",
                width: "200px",
                backgroundColor: "white",
                borderRadius: "20px",
                margin: "0 20px",
                padding: "0 10px",
                height: "40px",
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              <p
                style={{
                  fontSize: "15px",
                  marginLeft: "10px",
                  color: "darkslategray",
                }}
              >
                SENSEX{" "}
                <span
                  style={
                    SENSEX.change > 0 ? { color: "green" } : { color: "red" }
                  }
                >
                  {Number(SENSEX.last_price).toFixed(2)}{" "}
                  {SENSEX.change ? Number(SENSEX.change).toFixed(2) : 0}
                </span>{" "}
                %
              </p>
            </div>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <IconButton color="black">
                <Badge badgeContent={17} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="black"
              >
                <AccountCircle />
              </IconButton>
              <p
                style={{
                  fontSize: "15px",
                  marginLeft: "10px",
                  color: "darkslategray",
                }}
              >
                {currentUser ? currentUser.name : null}
              </p>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="black"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </div>
    </div>
  );
};

const mapStateToProps = ({
  userReducer: { currentUser },
  websocketReducer: { connected },
}) => ({
  currentUser: currentUser,
  isWebsocketConnected: connected,
});

const mapDispatchToProps = (dispatch) => ({
  signOutStart: () => {
    dispatch(signOutStart());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PrimarySearchAppBar);
