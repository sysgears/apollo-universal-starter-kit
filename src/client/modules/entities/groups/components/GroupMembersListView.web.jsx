import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table } from '../../../common/components/web';

export default class GroupMembersListView extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    groupMembers: PropTypes.array,
    orderBy: PropTypes.object,
    onOrderBy: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
  };

  state = {
    errors: []
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
    const { loading, groupMembers, id } = this.props;
    const { errors } = this.state;

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: (text, record) => (
          <Link className="user-link" to={`/users/${record.id}`}>
            {record.displayName}
          </Link>
        )
      },
      {
        title: (
          <a onClick={e => this.orderBy(e, 'email')} href="#">
            Email {this.renderOrderByArrow('email')}
          </a>
        ),
        dataIndex: 'email',
        key: 'email'
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
      }
    ];

    if (loading) {
      return <div className="text-center">Loading...</div>;
    } else if (!groupMembers) {
      return <div className="text-center">No members</div>;
    } else {
      console.log('groupMembers', id, groupMembers);
      let members = [];
      for (let g of groupMembers) {
        let roles = '';
        for (let r of g.groupRoles) {
          if (r.groupId === id) {
            roles += r.roles.map(e => e.name).join();
          }
        }
        let m = {
          id: g.id,
          email: g.email,
          displayName: g.profile.displayName,
          isActive: g.isActive,
          role: roles
        };
        members.push(m);
      }

      return (
        <div>
          {errors &&
            errors.map(error => (
              <div className="alert alert-danger" role="alert" key={error.field}>
                {error.message}
              </div>
            ))}
          <Table dataSource={members} columns={columns} />
        </div>
      );
    }
  }
}
