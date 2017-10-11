// Web only component
// React
import React from 'react';
import PropTypes from 'prop-types';

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
          <td>{username}</td>
          <td>{email}</td>
          <td>{isAdmin.toString()}</td>
          <td>{isActive.toString()}</td>
          <td>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => this.hendleDeleteUser(id)}
              title="Tooltip on top"
            >
              Delete
            </button>
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
          <table className="table table-bordered">
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
          </table>
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
