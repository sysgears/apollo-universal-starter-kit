import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import settings from '../../../../../../settings';
import translate from '../../../i18n';
import UsersFilterView from '../components/UsersFilterView';
import { Button, PageLayout } from '../../common/components/web';
import UsersListView from '../components/UsersListView';

import usersWithSubscription from './usersWithSubscription';

class Users extends React.Component {
  constructor(props) {
    super(props);
  }

  renderMetaData() {
    return (
      <Helmet
        title={`${settings.app.name} - ${this.props.t('users.title')}`}
        meta={[
          {
            name: 'description',
            content: `${settings.app.name} - ${this.props.t('users.meta')}`
          }
        ]}
      />
    );
  }

  render() {
    return (
      <PageLayout>
        {this.renderMetaData()}
        <h2>{this.props.t('users.list.title')}</h2>
        <Link to="/users/new">
          <Button color="primary">{this.props.t('users.btn.add')}</Button>
        </Link>
        <hr />
        <UsersFilterView {...this.props} />
        <hr />
        <UsersListView {...this.props} />
      </PageLayout>
    );
  }
}

Users.propTypes = {
  filter: PropTypes.object,
  navigation: PropTypes.object,
  users: PropTypes.array,
  subscribeToMore: PropTypes.func,
  loading: PropTypes.bool,
  t: PropTypes.func
};

export default usersWithSubscription(translate('user')(Users));
