import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import PaginationView from '../components/PaginationView.web';
import { PageLayout, Select, Option } from '../../common/components/web';
import translate from '../../../i18n';
import settings from '../../../../../../settings';

@translate('pagination')
export default class PaginationContainer extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    loadData: PropTypes.func,
    data: PropTypes.object
  };

  state = { pagination: 'standard' };

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
      loadData((pageNumber - 1) * data.limit, 'replace');
    }
  };

  renderPagination = () => {
    const { t, data } = this.props;
    const { pagination } = this.state;
    return (
      <div>
        <h2>{t('list.title.standard')}</h2>
        <PaginationView data={data} handlePageChange={this.handlePageChange} pagination={pagination} />
      </div>
    );
  };

  onSelectChange = e => {
    const { loadData, data } = this.props;
    const paginationType = e.target.value;
    this.setState({ pagination: paginationType }, loadData(0, data.limit));
  };

  render() {
    const { t } = this.props;
    return (
      <PageLayout>
        {this.renderMetaData()}
        <Select onChange={this.onSelectChange}>
          <Option value="standard">{t('list.title.standard')}</Option>
          <Option value="relay">{t('list.title.relay')}</Option>
        </Select>
        {this.renderPagination()}
      </PageLayout>
    );
  }
}
