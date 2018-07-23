import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { compose } from 'react-apollo';

import settings from '../../../../../../settings';
import translate from '../../../i18n';
import UsersFilterView from '../components/UsersFilterView';
import { Button, PageLayout } from '../../common/components/web';
import UsersListView from '../components/UsersListView';
import {
  withUsersState,
  withFilterUpdating,
  subscribeToUsersList,
  withUsers,
  withUsersDeleting,
  withOrderByUpdating
} from './UserOperations';

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentDidMount() {
    this.checkSubscription();
  }

  componentDidUpdate() {
    this.checkSubscription();
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription();
    }
  }

  checkSubscription() {
    const { loading, subscribeToMore, filter } = this.props;

    if (!loading) {
      // The component must re-subscribe every time filters changed.
      // That allows to get valid data after some CRUD operation happens.
      if (this.subscription) {
        this.subscription();
        this.subscription = null;
      }

      this.subscription = subscribeToUsersList(subscribeToMore, filter);
    }
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

export default compose(
  withUsersState,
  withUsers,
  withUsersDeleting,
  withOrderByUpdating,
  withFilterUpdating
)(translate('user')(Users));
