import React from 'react';

import Waiting from '../components/WaitingPage';

export default class WaitingPage extends React.Component {
  componentDidMount() {
    console.log('props', this.props);
  }
  render() {
    return <Waiting {...this.props} />;
  }
}
