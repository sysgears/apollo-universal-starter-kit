import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { compose } from 'react-apollo';
import { HeaderTitle } from '../../common/components/native';
import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';

import translate from '../../../i18n';
import { withLogout } from './Auth';

const LogoutView = ({ logout, t, client }) => {
  return (
    <View
      style={{
        flex: 1
      }}
    >
      <HeaderTitle
        onPress={async () => {
          logout().then(() => client.writeQuery({ query: CURRENT_USER_QUERY, data: { currentUser: null } }));
        }}
      >
        {t('mobile.logout')}
      </HeaderTitle>
    </View>
  );
};

LogoutView.propTypes = {
  logout: PropTypes.func.isRequired,
  error: PropTypes.string,
  client: PropTypes.object,
  t: PropTypes.func
};

export default compose(translate('user'), withLogout)(LogoutView);
