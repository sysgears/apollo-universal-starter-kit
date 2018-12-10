import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { PageLayout, Select, Option } from '@module/look-client-react';
import { translate } from '@module/i18n-client-react';
import settings from '../../../../settings';

import PaginationDemoView from '../components/PaginationDemoView.web';
import withDataProvider from '../containers/DataProvider';

@translate('pagination')
class PaginationDemo extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    loadData: PropTypes.func,
    items: PropTypes.object
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
    const { loadData, items } = this.props;
    if (pagination === 'relay') {
      loadData(items.pageInfo.endCursor, 'add');
    } else {
      loadData((pageNumber - 1) * items.limit, 'replace');
    }
  };

  onPaginationTypeChange = e => {
    const { loadData, items } = this.props;
    const paginationType = e.target.value;
    this.setState({ pagination: paginationType }, loadData(0, items.limit));
  };

  render() {
    const { t, items } = this.props;
    const { pagination } = this.state;
    return (
      <PageLayout>
        {this.renderMetaData()}
        <Select onChange={this.onPaginationTypeChange} className="pagination-select">
          <Option value="standard">{t('list.title.standard')}</Option>
          <Option value="relay">{t('list.title.relay')}</Option>
        </Select>
        {items && <PaginationDemoView items={items} handlePageChange={this.handlePageChange} pagination={pagination} />}
      </PageLayout>
    );
  }
}

const PaginationDemoWithData = withDataProvider(PaginationDemo);

export default PaginationDemoWithData;
