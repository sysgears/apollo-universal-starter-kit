/*eslint-disable no-unused-vars*/
// React
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// Apollo
import { graphql, compose } from "react-apollo";

// Components
import $Module$View from "../components/$Module$View";

class $Module$ extends React.Component {
  render() {
    return <$Module$View {...this.props} />;
  }
}

$Module$.propTypes = {};

const $Module$WithApollo = compose()($Module$);

export default connect(state => ({}), dispatch => ({}))($Module$WithApollo);
