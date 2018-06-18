import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { PageLayout } from '../../common/components/web';

import SubCategoryFilter from '../containers/SubCategoryFilter';
import SubCategoryList from '../containers/SubCategoryList';
import settings from '../../../../../../settings';

export default class SubCategory extends React.PureComponent {
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
        <SubCategoryFilter {...this.props} />
        <SubCategoryList {...this.props} />
      </PageLayout>
    );
  }
}
