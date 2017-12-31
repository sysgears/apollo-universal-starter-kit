/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';

import { graphql } from 'react-apollo';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

class PagingParams extends React.Component {
  static propTypes = {
    tableProps: PropTypes.object.isRequired
  };

  render() {
    let { tableProps, errors, users } = this.props;

    return (
      <div>
        {errors &&
          errors.map(error => (
            <div className="alert alert-danger" role="alert" key={error.field}>
              {error.message}
            </div>
          ))}

        <ReactTable filterable {...tableProps} />
      </div>
    );
  }
}

export default PagingParams;
