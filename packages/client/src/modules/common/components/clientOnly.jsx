import React, { Component } from 'react';

const clientOnly = Comp => {
  return class ClientOnly extends Component {
    state = {
      client: !__SSR__ && !__TEST__
    };
    componentDidMount() {
      this.setState({ client: __CLIENT__ });
    }
    render() {
      return this.state.client && <Comp {...this.props} />;
    }
  };
};

export default clientOnly;
