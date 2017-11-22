/* eslint-disable react/display-name */
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './components/web';

const createTableColumns = (schema, path, hendleDelete) => {
  let columns = [];

  for (const key of Object.keys(schema.values)) {
    if (key === 'id') {
      columns.push({
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
        render: (text, record) => (
          <Link className="$module$-link" to={`/${path}/${record.id}`}>
            {text}
          </Link>
        )
      });
    } else {
      columns.push({
        title: key,
        dataIndex: key,
        key: key
      });
    }
  }

  columns.push({
    title: 'Actions',
    key: 'actions',
    render: (text, record) => (
      <Button color="primary" size="sm" onClick={() => hendleDelete(record.id)}>
        Delete
      </Button>
    )
  });

  return columns;
};

export default createTableColumns;
