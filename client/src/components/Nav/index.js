import React from "react";
import "./style.css";

function Nav() {
  return (
    <nav className="nav navbar-expand-lg navbar-dark">
      <a className="nav-link" href="/">
        <h3>Google Books Search</h3>
      </a>
      <a className="nav-link mt-2" href="/">Search</a>
      <a className="nav-link mt-2" href="/saved" float-right>Saved</a>
    </nav>
  );
}

export default Nav;
