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
    t: PropTypes.func,
    loadData: PropTypes.func,
    data: PropTypes.object
  };

  state = { pagination: 'standard' };

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

  handlePageChange = (pagination, pageNumber) => {
    const { loadData, data } = this.props;
    if (pagination === 'relay') {
      loadData(data.pageInfo.endCursor + 1, 'add');
    } else {
      loadData((pageNumber - 1) * this.itemsNumber, 'replace');
    }
  };

  renderPagination = () => {
    const { t, data } = this.props;
    return this.state.pagination === 'standard' ? (
      <div>
        <h2>{t('list.title.standard')}</h2>
        <StandardView data={data} handlePageChange={this.handlePageChange} />
      </div>
    ) : (
      <div>
        <h2>{t('list.title.relay')}</h2>
        <RelayView data={data} handlePageChange={this.handlePageChange} />
      </div>
    );
  };

  onSelectChange = e => {
    this.setState({ pagination: e.target.value }, this.props.loadData(0, this.itemsNumber));
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
