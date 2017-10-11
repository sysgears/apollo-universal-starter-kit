// Web only component
// React
import React from 'react';
import PropTypes from 'prop-types';

class UsersView extends React.Component {
  renderUsers = users => {
    return users.map(({ id, username, email, isAdmin }) => {
      return (
        <tr key={id}>
          <td>{username}</td>
          <td>{email}</td>
          <td>{isAdmin.toString()}</td>
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
    const { loading, users, errors } = this.props;
    if (loading && !users) {
      return <div className="text-center">Loading...</div>;
    } else if (errors) {
      return errors.map(error => <li key={error.path[0]}>{error.message}</li>);
    } else {
      return (
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
            </tr>
          </thead>
          <tbody>{this.renderUsers(users)}</tbody>
        </table>
      );
    }
  }
}

UsersView.propTypes = {
  loading: PropTypes.bool.isRequired,
  users: PropTypes.array,
  errors: PropTypes.array,
  orderBy: PropTypes.object,
  onOrderBy: PropTypes.func.isRequired
};

export default UsersView;
