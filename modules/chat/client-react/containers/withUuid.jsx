import React from 'react';
import uuid from 'uuid';

import { getItem, setItem } from '@gqlapp/core-common';

export default Component => {
  return class WithUuid extends React.Component {
    state = {
      uuid: null
    };

    componentDidMount() {
      getItem('uuid').then(res => {
        this.setState({ uuid: res || uuid.v4() });
        if (!res) setItem('uuid', this.state.uuid);
      });
    }

    render() {
      return <Component uuid={this.state.uuid} {...this.props} />;
    }
  };
};
