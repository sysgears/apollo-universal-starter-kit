import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { PageLayout } from '../../common/components/web';

import TestModuleFilter from '../containers/TestModuleFilter';
import TestModuleList from '../containers/TestModuleList';
import settings from '../../../../../../settings';

class TestModule extends React.PureComponent {
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
        <TestModuleFilter />
        <hr />
        <TestModuleList />
      </PageLayout>
    );
  }
}

export default connect(state => ({
  title: state.testModule.title
}))(TestModule);
