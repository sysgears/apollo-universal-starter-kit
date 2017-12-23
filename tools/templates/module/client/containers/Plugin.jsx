/*eslint-disable no-unused-vars*/
import React from 'react';
import { graphql, compose } from 'react-apollo';

import $Plugin$View from '../components/$Plugin$View';

class $Plugin$ extends React.Component {
  render() {
    return <$Plugin$View {...this.props} />;
  }
}

const $Plugin$WithApollo = compose()($Plugin$);

export default $Plugin$WithApollo;
