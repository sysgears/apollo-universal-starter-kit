import React, { Component } from 'react';

interface ClientOnlyState {
  client: boolean;
}

const clientOnly = (Comp: any) => {
  return class ClientOnly extends Component<any, ClientOnlyState> {
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
};

export default clientOnly;
