import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import PaginationDemoView from '../components/PaginationDemoView.web';
import withDataProvider from '../containers/DataProvider';
import { PageLayout, Select, Option } from '../../common/components/web';
import translate from '../../../i18n';
import settings from '../../../../../../settings';

@translate('pagination')
class PaginationDemo extends React.Component {
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

  onPaginationTypeChange = e => {
    const { loadData, data } = this.props;
    const paginationType = e.target.value;
    this.setState({ pagination: paginationType }, loadData(0, data.limit));
  };

  render() {
    const { t, data } = this.props;
    const { pagination } = this.state;
    return (
      <PageLayout>
        {this.renderMetaData()}
        <Select onChange={this.onPaginationTypeChange} className="pagination-select">
          <Option value="standard">{t('list.title.standard')}</Option>
          <Option value="relay">{t('list.title.relay')}</Option>
        </Select>
        <PaginationDemoView data={data} handlePageChange={this.handlePageChange} pagination={pagination} />
      </PageLayout>
    );
  }
}

const PaginationDemoWithData = withDataProvider(PaginationDemo);

export default PaginationDemoWithData;
