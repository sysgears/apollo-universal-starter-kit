import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { PageLayout } from '../../common/components/web';

import $Module$Filter from '../containers/$Module$Filter';
import $Module$List from '../containers/$Module$List';
import settings from '../../../../../settings';

class $Module$ extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired
  };

  renderMetaData = title => (
    <Helmet
      title={`${settings.app.name} - ${title}`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - ${title} page`
        }
      ]}
    />
  );

  render() {
    const { title } = this.props;
    return (
      <PageLayout>
        {this.renderMetaData(title)}
        <h2>{title}</h2>
        <hr />
        <$Module$Filter />
        <hr />
        <$Module$List />
      </PageLayout>
    );
  }
}

export default connect(state => ({
  title: state.$module$.title
}))($Module$);
