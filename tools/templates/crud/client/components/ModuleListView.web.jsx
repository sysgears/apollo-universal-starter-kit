import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import { PageLayout, Table, Button } from '../../common/components/web';
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
        <h2>$Module$s</h2>
        <Link to="/$module$/0">
          <Button color="primary">Add</Button>
        </Link>
        <hr />
        <Table
          dataSource={$module$s}
          columns={createTableColumns($Module$Schema, '$module$', this.hendleDelete$Module$)}
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
