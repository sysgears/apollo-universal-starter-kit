import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Picker, List } from 'antd-mobile';

import { HeaderTitle } from '../..';

export default class LanguagePicker extends React.Component {
  constructor(props) {
    super(props);
    this.changeLang = this.changeLang.bind(this);
    this.state = {
      currentLang: this.props.i18n.language
    };
  }

  changeLang(lang) {
    if (lang && lang.length) {
      this.props.i18n.changeLanguage(lang[0]);
      this.setState({ currentLang: lang[0] });
    }
  }

  render() {
    const { i18n } = this.props;
    const langs = Object.keys(i18n.store.data);
    return (
      i18n.language &&
      langs.length > 1 && (
        <View style={{ flex: 1 }}>
          <Picker
            extra={this.state.currentLang.slice(0, 2).toUpperCase()}
            data={langs.map(lang => {
              return { value: lang, label: lang.slice(0, 2).toUpperCase() };
            })}
            cols={1}
            okText="Confirm"
            dismissText="Cancel"
            onChange={this.changeLang}
          >
            <List.Item arrow="empty">
              <HeaderTitle
                style={{
                  paddingVertical: 10,
                  fontWeight: 'bold'
                }}
              >
                {i18n.t('i18n:pickerMenu')}
              </HeaderTitle>
            </List.Item>
          </Picker>
        </View>
      )
    );
  }
}

LanguagePicker.propTypes = {
  i18n: PropTypes.object.isRequired
};
