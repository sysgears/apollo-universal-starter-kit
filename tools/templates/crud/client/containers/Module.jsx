/*eslint-disable no-unused-vars*/
import React from 'react';
import { graphql, compose } from 'react-apollo';

import $Module$View from '../components/$Module$View';

class $Module$ extends React.Component {
  render() {
    return <$Module$View {...this.props} />;
  }
}

const $Module$WithApollo = compose()($Module$);

export default $Module$WithApollo;
