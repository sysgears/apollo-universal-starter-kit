import React from 'react';
import PropTypes from 'prop-types';
import Waiting from '../components/WaitingPage';

export default class WaitingPage extends React.Component {
  static propTypes = {
    navigation: PropTypes.object
  };
  componentDidMount() {
    this.activate();
  }
  activate = () => {
    const { url } = this.props.navigation.state.params;
    console.log(url);
    // temporary redirect
    setTimeout(() => {
      this.props.navigation.navigate('Login');
    }, 1000);
  };
  render() {
    return <Waiting {...this.props} />;
  }
}
