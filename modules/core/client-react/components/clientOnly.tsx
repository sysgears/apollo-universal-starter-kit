import React, { Component } from 'react';

const clientOnly = (Comp: React.ComponentType) =>
  class ClientOnly extends Component {
    public state = {
      client: !__SSR__ && !__TEST__
    };
    public componentDidMount() {
      this.setState({ client: __CLIENT__ });
    }
    public render() {
      return this.state.client && <Comp {...this.props} />;
    }
  };

export default clientOnly;
