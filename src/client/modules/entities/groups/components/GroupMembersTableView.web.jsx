/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import StaticFiltered from '../../../common/components/hoc/tables/StaticFiltered';

class MembersTable extends React.Component {
  render() {
    console.log('GroupMembersTable.props', this.props);

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
        id: 'groupRoles',
        Header: 'Roles',
        accessor: 'groupRoles',
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

    const { groupMembers } = this.props;

    const tableProps = {
      data: groupMembers,
      columns,
      defaultPageSize: 10
    };

    return <StaticFiltered tableProps={tableProps} />;
  }
}

export default MembersTable;
