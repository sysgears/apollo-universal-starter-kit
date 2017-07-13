import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Toggle from '../components/toggle';
import messages from '../messages';
import { appLocales } from '../../../i18n';

import { CHANGE_LOCALE } from '../constants';

export class LocaleToggle extends Component {
  render() {
    return (
      <Toggle value={this.props.locale} values={appLocales} messages={messages} onToggle={this.props.onLocaleToggle} />
    );
  }
}

LocaleToggle.propTypes = {
  onLocaleToggle: PropTypes.func,
  locale: PropTypes.string,
};

export default connect(
  (state) => ({ language: state.language.locale }),
  (dispatch) => ({
    onLocaleToggle(evt) {
      return () => dispatch({
        type: CHANGE_LOCALE,
        locale: evt.target.value
      });
    }
  }),
)(LocaleToggle);
