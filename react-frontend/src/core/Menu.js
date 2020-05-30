import React from "react";
import { Link, withRouter } from "react-router-dom";
import { isAuthenticated, signout } from "./../auth/index";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#ff9900" };
  } else {
    return { color: "#ffffff" };
  }
};

const Menu = ({ history }) => {
  return (
    <div>
      <ul className="nav nav-tabs bg-primary">
        <li className="nav-item">
          <Link style={isActive(history, "/")} to="/" className="nav-link">
            Home
          </Link>
        </li>

        {!isAuthenticated() && (
          <>
            <li className="nav-item">
              <Link
                to="/signin"
                className="nav-link"
                style={isActive(history, "/signin")}
              >
                Sign In
              </Link>
            </li>

            <li className="nav-item ">
              <Link
                to="/signup"
                className="nav-link"
                style={isActive(history, "/signup")}
              >
                Sign Up
              </Link>
            </li>
          </>
        )}

        {isAuthenticated() && (
          <>
            <li className="nav-item ">
              <a
                className="nav-link"
                style={
                  (isActive(history, "/signup"),
                  { cursor: "pointer", color: "#fff" })
                }
                onClick={() => {
                  signout(() => {
                    history.push("/");
                  });
                }}
              >
                Sign Out
              </a>
            </li>
            <li className="nav-item ">
              <a className="nav-link">{`${
                isAuthenticated().user.name
              }'s profile`}</a>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default withRouter(Menu);
