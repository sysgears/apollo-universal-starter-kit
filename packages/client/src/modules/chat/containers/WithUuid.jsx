import React from 'react';
import uuid from 'react-native-uuid';
import { getItem, setItem } from '../../common/clientStorage';

const withUuid = Component => {
  return class WithUuid extends React.Component {
    state = {
      uuid: null
    };

    componentDidMount() {
      getItem('uuid').then(res => {
        this.setState({ uuid: res ? res : uuid.v4() });
        if (!res) setItem('uuid', this.state.uuid);
      });
    }

    render() {
      return <Component uuid={this.state.uuid} {...this.props} />;
    }
  };
};

export default withUuid;
