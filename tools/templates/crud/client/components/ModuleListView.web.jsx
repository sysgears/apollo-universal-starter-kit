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

  hendleDelete$Module$ = async id => {
    console.log(id);
    /*const { deleteUser } = this.props;
    const result = await deleteUser(id);
    if (result && result.errors) {
      this.setState({ errors: result.errors });
    } else {
      this.setState({ errors: [] });
    }*/
  };

  render() {
    const { loading, $module$s } = this.props;

    return (
      <PageLayout>
        {this.renderMetaData()}
        <Table
          dataSource={$module$s}
          columns={createTableColumns($Module$Schema)}
          pagination={false}
          loading={loading && !$module$s}
        />
      </PageLayout>
    );
  }
}

$Module$ListView.propTypes = {
  loading: PropTypes.bool.isRequired,
  $module$s: PropTypes.array
};

export default $Module$ListView;
