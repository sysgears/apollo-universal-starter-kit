/*eslint-disable no-unused-vars*/
import React from 'react';
import { graphql, compose } from 'react-apollo';

import EntitiesView from '../components/EntitiesView';

class Entities extends React.Component {
  render() {
    return <EntitiesView {...this.props} />;
  }
}

const EntitiesWithApollo = compose()(Entities);

export default EntitiesWithApollo;
