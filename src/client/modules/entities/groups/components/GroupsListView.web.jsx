import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Button } from '../../../common/components/web';

export default class GroupsView extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    groups: PropTypes.array,
    orderBy: PropTypes.object,
    onOrderBy: PropTypes.func.isRequired,
    deleteGroup: PropTypes.func.isRequired
  };

  state = {
    errors: []
  };

  hendleDeleteGroup = async id => {
    const { deleteGroup } = this.props;
    const result = await deleteGroup(id);
    if (result && result.errors) {
      this.setState({ errors: result.errors });
    } else {
      this.setState({ errors: [] });
    }
  };

  renderOrderByArrow = name => {
    const { orderBy } = this.props;

    if (orderBy && orderBy.column === name) {
      if (orderBy.order === 'desc') {
        return <span className="badge badge-primary">&#8595;</span>;
      } else {
        return <span className="badge badge-primary">&#8593;</span>;
      }
    } else {
      return <span className="badge badge-secondary">&#8645;</span>;
    }
  };

  orderBy = (e, name) => {
    const { onOrderBy, orderBy } = this.props;

    e.preventDefault();

    let order = 'asc';
    if (orderBy && orderBy.column === name) {
      if (orderBy.order === 'asc') {
        order = 'desc';
      } else if (orderBy.order === 'desc') {
        return onOrderBy({});
      }
    }

    return onOrderBy({ column: name, order });
  };

  render() {
    const { loading, groups } = this.props;
    const { errors } = this.state;

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: (text, record) => (
          <Link className="group-link" to={`/groups/${record.id}`}>
            {record.profile.displayName}
          </Link>
        )
      },
      {
        title: (
          <a onClick={e => this.orderBy(e, 'name')} href="#">
            name {this.renderOrderByArrow('name')}
          </a>
        ),
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: (
          <a onClick={e => this.orderBy(e, 'role')} href="#">
            Role {this.renderOrderByArrow('role')}
          </a>
        ),
        dataIndex: 'role',
        key: 'role'
      },
      {
        title: (
          <a onClick={e => this.orderBy(e, 'isActive')} href="#">
            Is Active {this.renderOrderByArrow('isActive')}
          </a>
        ),
        dataIndex: 'isActive',
        key: 'isActive',
        render: text => text.toString()
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (text, record) => (
          <Button color="primary" size="sm" onClick={() => this.hendleDeleteGroup(record.id)}>
            Delete
          </Button>
        )
      }
    ];

    if (loading) {
      return <div className="text-center">Loading...</div>;
    } else if (!groups) {
      return <div className="text-center">No Groups</div>;
    } else {
      return (
        <div>
          {errors &&
            errors.map(error => (
              <div className="alert alert-danger" role="alert" key={error.field}>
                {error.message}
              </div>
            ))}
          <Table dataSource={groups} columns={columns} />
        </div>
      );
    }
  }
}
