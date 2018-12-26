import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { translate } from '@module/i18n-client-react';
import { Table, Button } from '@module/look-client-react';

class UsersView extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    users: PropTypes.array,
    orderBy: PropTypes.object,
    onOrderBy: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  state = {
    errors: []
  };

  handleDeleteUser = async id => {
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
        return onOrderBy({
          column: '',
          order: ''
        });
      }
    }

    return onOrderBy({ column: name, order });
  };

  render() {
    const { loading, users, t } = this.props;
    const { errors } = this.state;

    const columns = [
      {
        title: (
          <a onClick={e => this.orderBy(e, 'username')} href="#">
            {t('users.column.name')} {this.renderOrderByArrow('username')}
          </a>
        ),
        dataIndex: 'username',
        key: 'username',
        render: (text, record) => (
          <Link className="user-link" to={`/users/${record.id}`}>
            {text}
          </Link>
        )
      },
      {
        title: (
          <a onClick={e => this.orderBy(e, 'email')} href="#">
            {t('users.column.email')} {this.renderOrderByArrow('email')}
          </a>
        ),
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: (
          <a onClick={e => this.orderBy(e, 'role')} href="#">
            {t('users.column.role')} {this.renderOrderByArrow('role')}
          </a>
        ),
        dataIndex: 'role',
        key: 'role'
      },
      {
        title: (
          <a onClick={e => this.orderBy(e, 'isActive')} href="#">
            {t('users.column.active')} {this.renderOrderByArrow('isActive')}
          </a>
        ),
        dataIndex: 'isActive',
        key: 'isActive',
        render: text => text.toString()
      },
      {
        title: t('users.column.actions'),
        key: 'actions',
        render: (text, record) => (
          <Button color="primary" size="sm" onClick={() => this.handleDeleteUser(record.id)}>
            {t('users.btn.delete')}
          </Button>
        )
      }
    ];

    if (loading && !users) {
      return <div className="text-center">{t('users.loadMsg')}</div>;
    } else {
      return (
        <div>
          {errors &&
            errors.map(error => (
              <div className="alert alert-danger" role="alert" key={error.field}>
                {error.message}
              </div>
            ))}
          <Table dataSource={users} columns={columns} />
        </div>
      );
    }
  }
}

export default translate('user')(UsersView);
