// React
import React from "react";
import { Route, Link } from "react-router-dom";

// Web UI
import { NavItem } from "reactstrap";

// Component and helpers
import $Module$ from "./containers/$Module$";
import reducers from "./reducers";

import Feature from "../connector";

export default new Feature({
  route: <Route exact path="/$Module$" component={$Module$} />,
  navItem: (
    <NavItem>
      <Link to="/$Module$" className="nav-link">
        $Module$
      </Link>
    </NavItem>
  ),
  reducer: { $Module$: reducers }
});
