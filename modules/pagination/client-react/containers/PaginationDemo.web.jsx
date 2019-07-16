import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import { PageLayout, Select, Option } from '@gqlapp/look-client-react';
import { translate } from '@gqlapp/i18n-client-react';
import settings from '@gqlapp/config';

import PaginationDemoView from '../components/PaginationDemoView.web';
import { useDataProvider } from './DataProvider';

const PaginationDemo = ({ t }) => {
  const [pagination, setPagination] = useState('standard');
  const { items, loadData } = useDataProvider();

  const renderMetaData = () => {
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

  const handlePageChange = (pagination, pageNumber) => {
    if (pagination === 'relay') {
      loadData(items.pageInfo.endCursor, 'add');
    } else {
      loadData((pageNumber - 1) * items.limit, 'replace');
    }
  };

  const onPaginationTypeChange = e => {
    const paginationType = e.target.value;
    setPagination(paginationType);
    loadData(0, items.limit);
  };

  return (
    <PageLayout>
      {renderMetaData()}
      <Select onChange={onPaginationTypeChange} className="pagination-select">
        <Option value="standard">{t('list.title.standard')}</Option>
        <Option value="relay">{t('list.title.relay')}</Option>
      </Select>
      {items && <PaginationDemoView items={items} handlePageChange={handlePageChange} pagination={pagination} />}
    </PageLayout>
  );
};

PaginationDemo.propTypes = {
  t: PropTypes.func
};

export default translate('pagination')(PaginationDemo);
