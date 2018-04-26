import React from 'react';
import PropTypes from 'prop-types';
import { Table as RSTable, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { Button } from '../components';

const RELAY_PAGINATION = 'relay';
const STANDARD_PAGINATION = 'standard';

const renderHead = columns => {
  return columns.map(({ title, dataIndex, renderHeader, key }) => {
    return (
      <th key={key} className={`w-${columns.length === 2 ? 100 : 100 / columns.length}`}>
        {renderHeader ? renderHeader(title, dataIndex) : title}
      </th>
    );
  });
};

const renderBody = (columns, dataSource) => {
  return dataSource.map(entry => {
    return <tr key={entry.id}>{renderData(columns, entry)}</tr>;
  });
};

const renderData = (columns, entry) => {
  return columns.map(({ dataIndex, render, key }) => {
    return <td key={key}>{render ? render(entry[dataIndex], entry) : entry[dataIndex]}</td>;
  });
};

class TablePagination extends React.Component {
  static propTypes = {
    loadData: PropTypes.func,
    pagination: PropTypes.string,
    numbers: PropTypes.array,
    pagesCount: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = { activePage: 1 };
  }

  componentDidUpdate() {
    this.props.loadData(this.props.pagination, this.state.activePage);
  }

  handleItemClick = number => {
    this.setState({ activePage: number });
  };

  handleLinkClick = e => {
    e.preventDefault();
  };

  previousPage = e => {
    e.preventDefault();
    if (this.state.activePage > 1) {
      this.setState(prevState => {
        return {
          activePage: prevState.activePage - 1
        };
      });
    }
  };

  nextPage = e => {
    e.preventDefault();
    if (this.state.activePage < this.props.pagesCount) {
      this.setState(prevState => {
        return {
          activePage: prevState.activePage + 1
        };
      });
    }
  };

  renderPaginationItems() {
    return this.props.numbers.map(number => (
      <PaginationItem
        key={number.toString()}
        onClick={() => this.handleItemClick(number)}
        active={this.state.activePage === number}
      >
        <PaginationLink href="#" onClick={e => this.handleLinkClick(e)}>
          {number}
        </PaginationLink>
      </PaginationItem>
    ));
  }

  render() {
    return (
      <Pagination className="float-right">
        <PaginationItem disabled={this.state.activePage <= 1}>
          <PaginationLink previous href="#" onClick={e => this.previousPage(e)} />
        </PaginationItem>
        {this.renderPaginationItems()}
        <PaginationItem disabled={this.state.activePage >= this.props.pagesCount}>
          <PaginationLink next href="#" onClick={e => this.nextPage(e)} />
        </PaginationItem>
      </Pagination>
    );
  }
}

const renderLoadMore = (dataSource, loadData, pageInfo, pagination, totalCount) => {
  switch (pagination) {
    case RELAY_PAGINATION: {
      if (pageInfo.hasNextPage) {
        return (
          <div>
            <div>
              <small>
                ({dataSource.length} / {totalCount})
              </small>
            </div>
            <Button id="load-more" color="primary" onClick={() => loadData(pagination)}>
              Load more ...
            </Button>
          </div>
        );
      }
      break;
    }
    case STANDARD_PAGINATION: {
      const pagesCount = Math.ceil(totalCount / 10);
      const pagesArray = Array(pagesCount)
        .fill(1)
        .map((x, y) => x + y);
      return (
        <TablePagination
          numbers={pagesArray}
          loadData={loadData}
          pagination={STANDARD_PAGINATION}
          pagesCount={pagesCount}
        />
      );
    }
  }
};

const Table = ({ dataSource, columns, totalCount, loadData, pageInfo, pagination, ...props }) => {
  return (
    <div>
      <RSTable {...props}>
        <thead>
          <tr>{renderHead(columns)}</tr>
        </thead>
        <tbody>{renderBody(columns, dataSource)}</tbody>
      </RSTable>
      {renderLoadMore(dataSource, loadData, pageInfo, pagination, totalCount)}
    </div>
  );
};

Table.propTypes = {
  dataSource: PropTypes.array,
  columns: PropTypes.array,
  totalCount: PropTypes.number,
  loadData: PropTypes.func.isRequired,
  pageInfo: PropTypes.object,
  pagination: PropTypes.string
};

export default Table;
export { RELAY_PAGINATION, STANDARD_PAGINATION };
