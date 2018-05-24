import React from 'react';
import PropTypes from 'prop-types';
import translate from '../../../i18n';
import ChatView from '../components/ChatView.web';

@translate('pagination')
class Chat extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    items: PropTypes.object,
    loadData: PropTypes.func
  };

  render() {
    return (
      <div>
        <div>chat container</div>
        <ChatView />
      </div>
    );
  }
}

export default Chat;
