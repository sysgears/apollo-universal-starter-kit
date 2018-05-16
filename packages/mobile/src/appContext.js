import React from 'react';
import PropTypes from 'prop-types';

const AppContext = React.createContext();

export class ContextProvider extends React.Component {
  static propTypes = {
    children: PropTypes.node
  };

  constructor(props) {
    super(props);
    this.state = {
      renderComponent: 0
    };
  }

  triggerRender = () => {
    this.setState({ renderComponent: this.state.renderComponent + 1 });
  };

  render() {
    return (
      <AppContext.Provider
        value={{
          ...this.state,
          triggerRender: this.triggerRender
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export function withAppContext(Component) {
  return function AppComponent(props) {
    return <AppContext.Consumer>{context => <Component {...props} context={context} />}</AppContext.Consumer>;
  };
}
