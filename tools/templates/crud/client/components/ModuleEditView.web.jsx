import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import { PageLayout } from '../../common/components/web';
import $Module$Form from './$Module$Form';
import settings from '../../../../../settings';

class $Module$EditView extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    $module$: PropTypes.object,
    onSubmit: PropTypes.func.isRequired
  };

  renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - Edit $Module$`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - Edit $module$ example page`
        }
      ]}
    />
  );

  render() {
    const { loading, $module$, onSubmit } = this.props;

    if (loading && !$module$) {
      return (
        <PageLayout>
          {this.renderMetaData()}
          <div className="text-center">Loading...</div>
        </PageLayout>
      );
    } else {
      return (
        <PageLayout>
          {this.renderMetaData()}
          <Link id="back-button" to="/$module$">
            Back
          </Link>
          <h2>{$module$ ? 'Edit' : 'Create'} $Module$</h2>
          <$Module$Form onSubmit={onSubmit} $module$={$module$} initialValues={$module$.node} />
        </PageLayout>
      );
    }
  }
}

export default $Module$EditView;
