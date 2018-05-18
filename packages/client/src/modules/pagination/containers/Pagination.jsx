import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import StandardView from '../components/StandardView';
import RelayView from '../components/RelayView';
import { PageLayout } from '../../common/components/web';
import translate from '../../../i18n';
import settings from '../../../../../../settings';

@translate('pagination')
export default class Pagination extends React.Component {
  static propTypes = {
    t: PropTypes.func
  };

  renderMetaData = () => {
    console.log(this.props);
    const { t } = this.props;
    return (
      <Helmet
        title={`${settings.app.name} - ${t('title')}`}
        meta={[
          {
            name: 'description',
            content: `${settings.app.name} - ${t('meta')}`
          }
        ]}
      />
    );
  };

  data = {
    totalCount: 41,
    edges: [
      {
        cursor: 0,
        node: { id: 51, title: 'dogkljikljdfn', content: '345346456', __typename: 'Post' },
        __typename: 'PostEdges'
      },
      {
        cursor: 1,
        node: { id: 50, title: 'dfgd', content: '34534', __typename: 'Post' },
        __typename: 'PostEdges'
      },
      {
        cursor: 2,
        node: { id: 49, title: '34534', content: '345', __typename: 'Post' },
        __typename: 'PostEdges'
      },
      {
        cursor: 3,
        node: { id: 46, title: 'edtyg', content: '234234', __typename: 'Post' },
        __typename: 'PostEdges'
      },
      {
        cursor: 4,
        node: { id: 45, title: 'tyge', content: '354345', __typename: 'Post' },
        __typename: 'PostEdges'
      },
      {
        cursor: 5,
        node: { id: 44, title: 'dfeg', content: '3453', __typename: 'Post' },
        __typename: 'PostEdges'
      },
      {
        cursor: 6,
        node: { id: 43, title: '34534', content: 'dfetygd', __typename: 'Post' },
        __typename: 'PostEdges'
      },
      {
        cursor: 7,
        node: { id: 42, title: 'dertyg', content: '3453', __typename: 'Post' },
        __typename: 'PostEdges'
      },
      {
        cursor: 8,
        node: { id: 41, title: 'dfgdfhf', content: '345', __typename: 'Post' },
        __typename: 'PostEdges'
      },
      {
        cursor: 9,
        node: { id: 40, title: 'Hhj', content: 'Yyh', __typename: 'Post' },
        __typename: 'PostEdges'
      }
    ],
    pageInfo: { endCursor: 9, hasNextPage: true, __typename: 'PostPageInfo' },
    __typename: 'Posts'
  };

  handlePageChange = (pagination, pageNumber) => {
    console.log(pagination, pageNumber);
  };

  pagination = 'relay'; // 'relay'

  renderPagination = () => {
    const { t } = this.props;
    return this.pagination === 'standard' ? (
      <div>
        <h2>{t('list.title.standard')}</h2>
        <StandardView data={this.data} handlePageChange={this.handlePageChange} />
      </div>
    ) : (
      <div>
        <h2>{t('list.title.relay')}</h2>
        <RelayView data={this.data} handlePageChange={this.handlePageChange} />
      </div>
    );
  };

  render() {
    return (
      <PageLayout>
        {this.renderMetaData()}
        {this.renderPagination()}
      </PageLayout>
    );
  }
}
