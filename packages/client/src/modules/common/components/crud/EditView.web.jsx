import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import { PageLayout } from '../web';
import FormView from './FormView';
import settings from '../../../../../../../settings';

class EditView extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object,
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired
  };

  renderMetaData = title => (
    <Helmet
      title={`${settings.app.name} - Edit ${title}`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - Edit ${title} example page`
        }
      ]}
    />
  );

  render() {
    const { loading, data, title, link } = this.props;

    if (loading && !data) {
      return (
        <PageLayout>
          {this.renderMetaData(title)}
          <div className="text-center">Loading...</div>
        </PageLayout>
      );
    } else {
      return (
        <PageLayout>
          {this.renderMetaData(title)}
          <Link id="back-button" to={`/${link}`}>
            Back
          </Link>
          <h2>
            {data ? 'Edit' : 'Create'} {title}
          </h2>
          <FormView {...this.props} />
        </PageLayout>
      );
    }
  }
}

export default EditView;
