import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { PageLayout } from '../../common/components/web';

import ProductTypeFilter from '../containers/ProductTypeFilter';
import ProductTypeList from '../containers/ProductTypeList';
import settings from '../../../../../../settings';

export default class ProductType extends React.PureComponent {
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
        <ProductTypeFilter {...this.props} />
        <ProductTypeList {...this.props} />
      </PageLayout>
    );
  }
}
