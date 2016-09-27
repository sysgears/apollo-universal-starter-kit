import React from 'react'

const NavBar = () => (
  <nav className="navbar navbar-default">
    <div className="container">
      <div className="navbar-header">
        <a href="#" className="navbar-brand">Apollo Starter Kit</a>
      </div>

      <ul className="nav navbar-nav">
        <li><a href="/graphiql">GraphiQL</a></li>
      </ul>
    </div>
  </nav>
);

export default NavBar;
