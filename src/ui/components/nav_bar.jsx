import React from 'react'
import { Link } from 'react-router'

const NavBar = () => (
  <nav className="navbar navbar-default">
    <div className="container">
      <div className="navbar-header">
        <Link to="/counter" className="navbar-brand">Apollo Starter Kit</Link>
      </div>

      <ul className="nav navbar-nav">
        <li><a href="/graphiql">GraphiQL</a></li>
      </ul>
    </div>
  </nav>
);

export default NavBar;
