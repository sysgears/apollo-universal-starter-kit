import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { translate } from '@module/i18n-client-react';
import { PageLayout } from '@module/look-client-react';

import UserForm from './UserForm';
import settings from '../../../../settings';

class UserAddView extends React.PureComponent {
  static propTypes = {
    user: PropTypes.object,
    errors: PropTypes.array,
    addUser: PropTypes.func.isRequired,
    history: PropTypes.object,
    t: PropTypes.func,
    onSubmit: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  state = {};

  static getDerivedStateFromProps(nextProps) {
    if (!nextProps.loading && nextProps.errors && nextProps.errors.length) {
      nextProps.history.push('/profile');
    }
    return null;
  }

  renderMetaData = t => (
    <Helmet
      title={`${settings.app.name} - ${t('userEdit.title')}`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - ${t('userEdit.meta')}`
        }
      ]}
    />
  );

  render() {
    const { t } = this.props;

    return (
      <PageLayout>
        {this.renderMetaData(t)}
        <Link id="back-button" to="/users">
          Back
        </Link>
        <h2>
          {t('userEdit.form.titleCreate')} {t('userEdit.form.title')}
        </h2>
        <UserForm
          onSubmit={this.props.onSubmit}
          initialValues={{}}
          shouldDisplayRole={true}
          shouldDisplayActive={true}
        />
      </PageLayout>
    );
  }
}

export default translate('user')(UserAddView);
