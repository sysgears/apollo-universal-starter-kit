import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Table } from '../../common/components';

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

  renderUsers = users => {
    return users.map(({ id, username, email, isAdmin, isActive }) => {
      return (
        <tr key={id}>
          <td>
            <Link className="userdocker -link" to={`/users/${id}`}>
              {username}
            </Link>
          </td>
          <td>{email}</td>
          <td>{isAdmin.toString()}</td>
          <td>{isActive.toString()}</td>
          <td>
            <Button color="primary" size="sm" onClick={() => this.hendleDeleteUser(id)}>
              Delete
            </Button>
          </td>
        </tr>
      );
    });
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
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Age',
      dataIndex: 'age'
    },
    {
      title: 'Address',
      dataIndex: 'address'
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
          <Table>
            <thead>
              <tr>
                <th>
                  <a onClick={e => this.orderBy(e, 'username')} href="#">
                    Username {this.renderOrderByArrow('username')}
                  </a>
                </th>
                <th>
                  <a onClick={e => this.orderBy(e, 'email')} href="#">
                    Email {this.renderOrderByArrow('email')}
                  </a>
                </th>
                <th>
                  <a onClick={e => this.orderBy(e, 'isAdmin')} href="#">
                    Is Admin {this.renderOrderByArrow('isAdmin')}
                  </a>
                </th>
                <th>
                  <a onClick={e => this.orderBy(e, 'isActive')} href="#">
                    Is Active {this.renderOrderByArrow('isActive')}
                  </a>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{this.renderUsers(users)}</tbody>
          </Table>
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
