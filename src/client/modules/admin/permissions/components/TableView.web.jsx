import React from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import PagingParams from '../../../common/components/hoc/tables/PagingParams';

import QUERY from '../graphql/PermissionsQuery.graphql';

class PermissionsTable extends React.Component {
  render() {
    console.log('PermissionTable.props', this.props);

    const columns = [
      {
        id: 'name',
        Header: 'Name',
        accessor: row => {
          console.log('Row', row);
          return { id: row.id, name: row.name };
        },
        Cell: props => {
          const val = props.value;
          let col = props.column;
          if (col.filter) {
            const f = col.filter;
            if (f) {
              const ts = val.name.split(f.value);
              return (
                <Link to={'/permissions/' + val.id}>
                  {ts.map((t, idx) => (
                    <span>
                      {t}
                      {idx === ts.length - 1 ? '' : <b>{f.value}</b>}
                    </span>
                  ))}
                </Link>
              );
            }
          }

          return <Link to={'/permissions/' + val.id}>{val.name}</Link>;
        }
      },
      {
        id: 'resource',
        Header: 'Resource',
        accessor: 'resource',
        Cell: props => {
          const val = props.value;
          let col = props.column;
          if (col.filter) {
            const f = col.filter;
            if (f) {
              const ts = val.split(f.value);
              return (
                <span>
                  {ts.map((t, idx) => (
                    <span>
                      {t}
                      {idx === ts.length - 1 ? '' : <b>{f.value}</b>}
                    </span>
                  ))}
                </span>
              );
            }
          }

          return <span>{val}</span>;
        }
      },
      {
        id: 'relation',
        Header: 'Relation',
        accessor: 'relation',
        Cell: props => {
          const val = props.value;
          let col = props.column;
          if (col.filter) {
            const f = col.filter;
            if (f) {
              const ts = val.split(f.value);
              return (
                <span>
                  {ts.map((t, idx) => (
                    <span>
                      {t}
                      {idx === ts.length - 1 ? '' : <b>{f.value}</b>}
                    </span>
                  ))}
                </span>
              );
            }
          }

          return <span>{val}</span>;
        }
      },
      {
        id: 'verb',
        Header: 'Verb',
        accessor: 'verb',
        Cell: props => {
          const val = props.value;
          let col = props.column;
          if (col.filter) {
            const f = col.filter;
            if (f) {
              const ts = val.split(f.value);
              return (
                <span>
                  {ts.map((t, idx) => (
                    <span>
                      {t}
                      {idx === ts.length - 1 ? '' : <b>{f.value}</b>}
                    </span>
                  ))}
                </span>
              );
            }
          }

          return <span>{val}</span>;
        }
      }
    ];

    const tableProps = {
      columns,
      defaultPageSize: 12
    };

    const extract = data => {
      console.log('Extract data', data);
      return data.pagingPermissions;
    };

    return <PagingParams tableProps={tableProps} query={QUERY} accessor={extract} />;
  }
}

export default PermissionsTable;
