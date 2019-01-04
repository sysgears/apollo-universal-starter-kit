import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { PageLayout, Select, Option, Button } from '@module/look-client-react';
import { translate } from '@module/i18n-client-react';
import settings from '../../../../settings';

import ReportDemoPrint from '../components/ReportDemoPrint';
import WithExportPDF from './WithExportPDF';

@translate('reports')
class ReportDemo extends Component {
  static propTypes = {
    t: PropTypes.func
  };

  state = { reportType: 'front' };

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

  onReportTypeChange = e => {
    this.setState({ reportType: e.target.value });
  };

  render() {
    const { t } = this.props;
    const { reportType } = this.state;

    const button = <Button>{t('btn')}</Button>;

    return (
      <PageLayout>
        {this.renderMetaData()}
        <Select onChange={this.onReportTypeChange} className="pagination-select">
          <Option value="front">{t('list.title.front')}</Option>
          <Option value="server">{t('list.title.server')}</Option>
        </Select>
        {reportType === 'front' ? (
          <WithExportPDF button={button} visibly={false} positionButton="center">
            <ReportDemoPrint />
          </WithExportPDF>
        ) : (
          <div>server</div>
        )}
      </PageLayout>
    );
  }
}

export default ReportDemo;
