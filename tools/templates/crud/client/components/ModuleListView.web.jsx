import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import { PageLayout, Table, Button } from '../../common/components/web';

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

  columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => (
        <Link className="$module$-link" to={`/$module$/${record.id}`}>
          {text}
        </Link>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button color="primary" size="sm" onClick={() => this.hendleDelete$Module$(record.id)}>
          Delete
        </Button>
      )
    }
  ];

  render() {
    const { loading, $module$s } = this.props;

    return (
      <PageLayout>
        {this.renderMetaData()}
        <Table dataSource={$module$s} columns={this.columns} pagination={false} loading={loading && !$module$s} />
      </PageLayout>
    );
  }
}

$Module$ListView.propTypes = {
  loading: PropTypes.bool.isRequired,
  $module$s: PropTypes.array
};

export default $Module$ListView;
