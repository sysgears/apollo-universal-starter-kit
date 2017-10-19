import { Component } from '@angular/core';

@Component({
  selector: 'nav-bar',
  template: `
    <nav class="navbar navbar-light bg-faded">
      <div class="container">
        <ul class="nav col-md-6 left-side">
          <a class="navbar-brand active" aria-current="true" routerLink="/">Apollo Starter Kit</a>
          <li class="nav-item">
            <a class="nav-link" [routerLinkActive]="['active']" aria-current="true" routerLink="/posts">Posts</a>
          </li>
        </ul>
        <ul class="nav col-md-6 right-side">
          <li class="nav-item"></li>
          <li class="nav-item">
      <span class="nav-link">
        <a aria-current="false" href="/login">Login</a> / <a aria-current="false" href="/register">Register</a>
      </span>
          </li>
          <li class="nav-item">
            <a href="/graphiql" class="nav-link">GraphiQL</a>
          </li>
        </ul>
      </div>
    </nav>`,
  styles: ['ul.right-side { display: block; }', 'ul.right-side li { float: right; }']
})
export default class {}

// import React from "react";
// import { NavLink } from "react-router-dom";
// import { Container, Navbar, Nav, NavItem } from "reactstrap";
//
// import modules from "../modules";
//
// const NavBar = () => (
//   <Navbar color="faded" light>
//     <Container>
//       <Nav>
//         <NavLink to="/" className="navbar-brand">
//           Apollo Starter Kit
//         </NavLink>
//         {modules.navItems}
//       </Nav>
//
//       <Nav className="ustify-content-end">
//         {modules.navItemsRight}
//         {(!__PERSIST_GQL__ || __DEV__) && (
//             <NavItem>
//               <a href="/graphiql" className="nav-link">
//                 GraphiQL
//               </a>
//             </NavItem>
//           )}
//       </Nav>
//     </Container>
//   </Navbar>
// );
//
// export default NavBar;
