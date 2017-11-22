import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import { PageLayout, Table } from '../../common/components/web';
import createTableColumns from '../../common/util';
import { $Module$ as $Module$Schema } from '../../../../server/modules/$module$/schema';

class $Module$ListView extends React.PureComponent {
  renderMetaData = () => (
    <Helmet
      title="$Module$"
      meta={[
        {
          name: 'description',
          content: '$Module$ page'
        }
      ]}
    />
  );

  hendleDelete$Module$ = id => {
    const { delete$Module$ } = this.props;
    delete$Module$(id);
  };

  render() {
    const { loading, $module$s } = this.props;

    return (
      <PageLayout>
        {this.renderMetaData()}
        <Table
          dataSource={$module$s}
          columns={createTableColumns($Module$Schema, this.hendleDelete$Module$)}
          pagination={false}
          loading={loading && !$module$s}
        />
      </PageLayout>
    );
  }
}

$Module$ListView.propTypes = {
  loading: PropTypes.bool.isRequired,
  $module$s: PropTypes.array,
  delete$Module$: PropTypes.func.isRequired
};

export default $Module$ListView;
