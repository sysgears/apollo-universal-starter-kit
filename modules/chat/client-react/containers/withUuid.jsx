import React from 'react';
import uuid from 'uuid';

import { clientStorage } from '@gqlapp/core-common';

export default Component => {
  return class WithUuid extends React.Component {
    state = {
      uuid: null
    };

    componentDidMount() {
      clientStorage.getItem('uuid').then(res => {
        this.setState({ uuid: res || uuid.v4() });
        if (!res) clientStorage.setItem('uuid', this.state.uuid);
      });
    }

    render() {
      return <Component uuid={this.state.uuid} {...this.props} />;
    }
  };
};
