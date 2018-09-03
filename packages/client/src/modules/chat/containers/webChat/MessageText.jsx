/* eslint no-use-before-define: ["error", { "variables": false }] */
import PropTypes from 'prop-types';
import React from 'react';

//const WWW_URL_PATTERN = /^www\./i;

export default class MessageText extends React.Component {
  constructor(props) {
    super(props);
    // this.onUrlPress = this.onUrlPress.bind(this);
    // this.onPhonePress = this.onPhonePress.bind(this);
    // this.onEmailPress = this.onEmailPress.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.currentMessage.text !== nextProps.currentMessage.text;
  }

  // onUrlPress(url) {
  // When someone sends a message that includes a website address beginning with "www." (omitting the scheme),
  // react-native-parsed-text recognizes it as a valid url, but Linking fails to open due to the missing scheme.
  // if (WWW_URL_PATTERN.test(url)) {
  //   this.onUrlPress(`http://${url}`);
  // } else {
  //   Linking.canOpenURL(url).then(supported => {
  //     if (!supported) {
  //       // eslint-disable-next-line
  //       console.error('No handler for URL:', url);
  //     } else {
  //       Linking.openURL(url);
  //     }
  //   });
  // }
  // }

  // onPhonePress(phone) {
  //   const options = ['Call', 'Text', 'Cancel'];
  //   const cancelButtonIndex = options.length - 1;
  //   this.context.actionSheet().showActionSheetWithOptions(
  //     {
  //       options,
  //       cancelButtonIndex
  //     },
  //     buttonIndex => {
  //       switch (buttonIndex) {
  //         case 0:
  //           Communications.phonecall(phone, true);
  //           break;
  //         case 1:
  //           Communications.text(phone);
  //           break;
  //         default:
  //           break;
  //       }
  //     }
  //   );
  // }

  // onEmailPress(email) {
  //   Communications.email([email], null, null, null, null);
  // }

  render() {
    // const linkStyle = StyleSheet.flatten([styles[this.props.position].link, this.props.linkStyle[this.props.position]]);
    return (
      <div style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
        {this.props.currentMessage.text}
      </div>
    );
  }
}

const textStyle = {
  fontSize: 16,
  lineHeight: 20,
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  marginRight: 10
};

const styles = {
  left: {
    container: {},
    text: {
      color: 'black',
      ...textStyle
    },
    link: {
      color: 'black',
      textDecorationLine: 'underline'
    }
  },
  right: {
    container: {},
    text: {
      color: 'white',
      ...textStyle
    },
    link: {
      color: 'white',
      textDecorationLine: 'underline'
    }
  }
};

MessageText.contextTypes = {
  actionSheet: PropTypes.func
};

MessageText.defaultProps = {
  position: 'left',
  currentMessage: {
    text: ''
  },
  containerStyle: {},
  textStyle: {},
  linkStyle: {},
  customTextStyle: {},
  textProps: {},
  parsePatterns: () => []
};

MessageText.propTypes = {
  position: PropTypes.oneOf(['left', 'right']),
  currentMessage: PropTypes.object,
  containerStyle: PropTypes.shape({
    left: PropTypes.object,
    right: PropTypes.object
  }),
  textStyle: PropTypes.shape({
    left: PropTypes.object,
    right: PropTypes.object
  }),
  linkStyle: PropTypes.shape({
    left: PropTypes.object,
    right: PropTypes.object
  }),
  parsePatterns: PropTypes.func,
  textProps: PropTypes.object,
  customTextStyle: PropTypes.object
};
