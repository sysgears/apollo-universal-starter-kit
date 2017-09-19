/*eslint-disable no-unused-vars*/
// React
import React from 'react';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import $Module$View from '../components/$Module$View';

class $Module$ extends React.Component {
  render() {
    return <$Module$View {...this.props} />;
  }
}

const $Module$WithApollo = compose()($Module$);

export default $Module$WithApollo;
