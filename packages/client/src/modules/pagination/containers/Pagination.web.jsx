import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import StandardView from '../components/StandardView.web';
import RelayView from '../components/RelayView.web';
import { PageLayout, Option } from '../../common/components/web';
import translate from '../../../i18n';
import settings from '../../../../../../settings';

@translate('pagination')
export default class Pagination extends React.Component {
  static propTypes = {
    t: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = { pagination: 'standard', data: this.generateDataObject(46) };
  }

  itemsNumber = settings.pagination.web.itemsNumber;

  renderMetaData = () => {
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

  generateDataObject = quantity => {
    const allEdges = [];
    [...Array(quantity).keys()].forEach(function(element) {
      allEdges.push({ cursor: element, node: { id: element + 1, title: 'Item ' + (element + 1) } });
    });
    const edges = allEdges.slice(0, 10);
    const hasNextPage = quantity > this.itemsNumber;
    const endCursor = edges[edges.length - 1].cursor;
    const data = {
      totalCount: quantity,
      pageInfo: {
        endCursor: endCursor,
        hasNextPage: hasNextPage
      },
      edges: edges,
      offset: 0,
      limit: this.itemsNumber
    };
    this.allEdges = allEdges;
    return data;
  };

  loadData = (offset, dataDelivery) => {
    const { data } = this.state;
    const { allEdges, itemsNumber } = this;
    const edges =
      dataDelivery === 'add' ? allEdges.slice(0, offset + itemsNumber) : allEdges.slice(offset, offset + itemsNumber);
    const endCursor = edges[edges.length - 1].cursor;
    const hasNextPage = endCursor < allEdges[allEdges.length - 1].cursor;
    const newData = {
      totalCount: data.totalCount,
      pageInfo: {
        endCursor: endCursor,
        hasNextPage: hasNextPage
      },
      edges: edges,
      offset: 0,
      limit: itemsNumber
    };
    this.setState({ data: newData });
  };

  handlePageChange = (pagination, pageNumber) => {
    if (pagination === 'relay') {
      this.loadData(this.state.data.pageInfo.endCursor + 1, 'add');
    } else {
      this.loadData((pageNumber - 1) * this.itemsNumber, 'replace');
    }
  };

  renderPagination = () => {
    const { t } = this.props;
    return this.state.pagination === 'standard' ? (
      <div>
        <h2>{t('list.title.standard')}</h2>
        <StandardView data={this.state.data} handlePageChange={this.handlePageChange} />
      </div>
    ) : (
      <div>
        <h2>{t('list.title.relay')}</h2>
        <RelayView data={this.state.data} handlePageChange={this.handlePageChange} />
      </div>
    );
  };

  onSelectChange = e => {
    this.setState({ pagination: e.target.value });
  };

  render() {
    const { t } = this.props;
    return (
      <PageLayout>
        <select onChange={this.onSelectChange}>
          <Option value="standard">{t('list.title.standard')}</Option>
          <Option value="relay">{t('list.title.relay')}</Option>
        </select>
        {this.renderMetaData()}
        {this.renderPagination()}
      </PageLayout>
    );
  }
}
