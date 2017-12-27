import React from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import PagingParams from '../../../common/components/hoc/tables/PagingParams';

import USERS_QUERY from '../graphql/UsersQuery.graphql';

class UsersTable extends React.Component {
  handleDeleteUser = async id => {
    const { deleteUser } = this.props;
    const result = await deleteUser(id);
    if (result && result.errors) {
      this.setState({ errors: result.errors });
    } else {
      this.setState({ errors: [] });
    }
  };

  render() {
    console.log('UserTable.props', this.props);

    const columns = [
      {
        id: 'id',
        Header: 'Display Name',
        accessor: row => {
          return { id: row.id, name: row.profile.displayName };
        },

        filterAccessor: row => row.id.name,
        Cell: props => {
          return <Link to={'/users/' + props.value.id}>{props.value.name}</Link>;
        }
      },
      {
        id: 'email',
        Header: 'Email',
        accessor: 'email',
        Cell: props => {
          const email = props.value;
          let col = props.column;
          if (col.filter) {
            const f = col.filter;
            if (f) {
              const ts = email.split(f.value);
              return (
                <span>
                  {ts.map((t, idx) => (
                    <span>
                      {t}
                      <b>{idx === ts.length - 1 ? '' : f.value}</b>
                    </span>
                  ))}
                </span>
              );
            }
          }

          return <span>{email}</span>;
        }
      },
      {
        id: 'userRoles',
        Header: 'User Roles',
        accessor: 'userRoles',
        Cell: props => {
          let roles = props.value;
          if (!roles) {
            return 'n/a';
          }
          return (
            <span>
              {roles.map((item, idx) => {
                return (
                  <span>
                    {idx > 0 ? ', ' : ''}
                    <Link to={'/roles/' + item.id}> {item.name}</Link>
                  </span>
                );
              })}
            </span>
          );
        }
      },
      {
        id: 'isActive',
        Header: 'Active',
        accessor: 'isActive',
        Cell: props => {
          return props.value.toString();
        }
      }
    ];

    const tableProps = {
      columns,
      defaultPageSize: 10
    };

    const extract = data => {
      console.log('Extract data', data);
      return data.pagingUsers;
    };

    return <PagingParams tableProps={tableProps} query={USERS_QUERY} accessor={extract} />;
  }
}

export default UsersTable;
