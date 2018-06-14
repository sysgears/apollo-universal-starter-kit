import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { PageLayout } from '../../common/components/web';

import ProductFilter from '../containers/ProductFilter';
import ProductList from '../containers/ProductList';
import settings from '../../../../../../settings';

export default class Product extends React.PureComponent {
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
        <ProductFilter {...this.props} />
        <ProductList {...this.props} />
      </PageLayout>
    );
  }
}
