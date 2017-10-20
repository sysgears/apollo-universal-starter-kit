import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Button } from '../../common/components/web';

class UsersView extends React.PureComponent {
  state = {
    errors: []
  };

  hendleDeleteUser = async id => {
    const { deleteUser } = this.props;
    const result = await deleteUser(id);
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

  columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (text, record) => (
        <Link className="userdocker -link" to={`/users/${record.id}`}>
          {text}
        </Link>
      ),
      renderHeader: (text, dataIndex) => (
        <a onClick={e => this.orderBy(e, dataIndex)} href="#">
          {text} {this.renderOrderByArrow(dataIndex)}
        </a>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      renderHeader: (text, dataIndex) => (
        <a onClick={e => this.orderBy(e, dataIndex)} href="#">
          {text} {this.renderOrderByArrow(dataIndex)}
        </a>
      )
    },
    {
      title: 'Is Admin',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      render: text => text.toString(),
      renderHeader: (text, dataIndex) => (
        <a onClick={e => this.orderBy(e, dataIndex)} href="#">
          {text} {this.renderOrderByArrow(dataIndex)}
        </a>
      )
    },
    {
      title: 'Is Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: text => text.toString(),
      renderHeader: (text, dataIndex) => (
        <a onClick={e => this.orderBy(e, dataIndex)} href="#">
          {text} {this.renderOrderByArrow(dataIndex)}
        </a>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button color="primary" size="sm" onClick={() => this.hendleDeleteUser(record.id)}>
          Delete
        </Button>
      )
    }
  ];

  render() {
    const { loading, users } = this.props;
    const { errors } = this.state;
    if (loading && !users) {
      return <div className="text-center">Loading...</div>;
    } else {
      return (
        <div>
          {errors &&
            errors.map(error => (
              <div className="alert alert-danger" role="alert" key={error.field}>
                {error.message}
              </div>
            ))}
          <Table dataSource={users} columns={this.columns} />
        </div>
      );
    }
  }
}

UsersView.propTypes = {
  loading: PropTypes.bool.isRequired,
  users: PropTypes.array,
  orderBy: PropTypes.object,
  onOrderBy: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired
};

export default UsersView;
