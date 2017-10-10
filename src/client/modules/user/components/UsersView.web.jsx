// Web only component
// React
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import PageLayout from '../../../app/PageLayout';

class UsersView extends React.Component {
  renderMetaData = () => (
    <Helmet
      title="User"
      meta={[
        {
          name: 'description',
          content: 'User page'
        }
      ]}
    />
  );

  handleSearch = event => {
    const { onSearchTextChange } = this.props;
    onSearchTextChange(event.target.value);
  };

  handleIsAdmin = () => {
    const { onIsAdminChange, isAdmin } = this.props;
    onIsAdminChange(!isAdmin);
  };

  renderFilter = () => {
    const { searchText, isAdmin } = this.props;

    return (
      <form className="form-inline">
        <label className="mr-sm-2">Filter: </label>
        <input
          type="text"
          className="form-control mb-2 mr-sm-2 mb-sm-0"
          value={searchText}
          onChange={this.handleSearch}
          placeholder="Search"
        />

        <div className="form-check mb-2 mr-sm-2 mb-sm-0">
          <label className="form-check-label">
            <input
              className="form-check-input"
              type="checkbox"
              defaultChecked={isAdmin}
              onChange={this.handleIsAdmin}
            />{' '}
            Is Admin
          </label>
        </div>
      </form>
    );
  };

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
    }
  };

  orderBy = name => {
    const { onOrderBy, orderBy } = this.props;

    let order = 'asc';
    if (orderBy && orderBy.column === name) {
      if (orderBy.order === 'asc') {
        order = 'desc';
      }
    }

    onOrderBy({ column: name, order });
  };

  render() {
    const { loading, users, errors } = this.props;
    if (loading) {
      return (
        <PageLayout>
          {this.renderMetaData()}
          <div className="text-center">Loading...</div>
        </PageLayout>
      );
    } else if (errors) {
      return (
        <PageLayout>
          {this.renderMetaData()}
          <h2>Users</h2>
          <h1 />
          {errors.map(error => <li key={error.path[0]}>{error.message}</li>)}
        </PageLayout>
      );
    } else {
      return (
        <PageLayout>
          {this.renderMetaData()}
          <h2>Users</h2>
          {this.renderFilter()}
          <hr />
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>
                  <a onClick={() => this.orderBy('username')} href="#">
                    Username{' '}
                    {this.renderOrderByArrow('username')}
                  </a>
                </th>
                <th>
                  <a onClick={() => this.orderBy('email')} href="#">
                    Email{' '}
                    {this.renderOrderByArrow('email')}
                  </a>
                </th>
                <th>
                  <a onClick={() => this.orderBy('isAdmin')} href="#">
                    Is Admin{' '}
                    {this.renderOrderByArrow('isAdmin')}
                  </a>
                </th>
              </tr>
            </thead>
            <tbody>{this.renderUsers(users)}</tbody>
          </table>
        </PageLayout>
      );
    }
  }
}

UsersView.propTypes = {
  loading: PropTypes.bool.isRequired,
  users: PropTypes.array,
  errors: PropTypes.array,
  searchText: PropTypes.string,
  isAdmin: PropTypes.bool,
  orderBy: PropTypes.object,
  onSearchTextChange: PropTypes.func.isRequired,
  onIsAdminChange: PropTypes.func.isRequired,
  onOrderBy: PropTypes.func.isRequired
};

export default UsersView;
