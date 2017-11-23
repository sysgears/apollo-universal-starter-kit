import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { SubmissionError } from 'redux-form';

import { pickInputFields } from '../../common/util';
import { $Module$ as $Module$Schema } from '../../../../server/modules/$module$/schema';
import { PageLayout } from '../../common/components/web';
import $Module$Form from './$Module$Form';
import settings from '../../../../../settings';

class $Module$EditView extends React.PureComponent {
  onSubmit = async values => {
    const { $module$, add$Module$, edit$Module$ } = this.props;
    let result = null;

    const insertValues = pickInputFields($Module$Schema, values);

    if ($module$) {
      result = await edit$Module$(insertValues);
    } else {
      result = await add$Module$(insertValues);
    }

    if (result.errors) {
      let submitError = {
        _error: 'Edit $module$ failed!'
      };
      Object.keys(result.errors).map(key => (submitError[result.errors[key].field] = result.errors[key].message));
      throw new SubmissionError(submitError);
    }
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
    const { loading, $module$ } = this.props;

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
          <$Module$Form onSubmit={this.onSubmit} initialValues={$module$} />
        </PageLayout>
      );
    }
  }
}

$Module$EditView.propTypes = {
  loading: PropTypes.bool.isRequired,
  $module$: PropTypes.object,
  add$Module$: PropTypes.func.isRequired,
  edit$Module$: PropTypes.func.isRequired
};

export default $Module$EditView;
