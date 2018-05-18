import React from 'react';
import Pagination from '../containers/Pagination';
import paginationConfig from '../../../../../../config/pagination';

export default class PaginationContainer extends React.Component {
  allEdges = generateEdgesArray(46);
  state = { data: generateDataObject(this.allEdges) };
  itemsNumber = paginationConfig.web.itemsNumber;

  loadData = (offset, dataDelivery) => {
    const { data } = this.state;
    const { allEdges, itemsNumber } = this;
    const edges =
      dataDelivery === 'add' ? allEdges.slice(0, offset + itemsNumber) : allEdges.slice(offset, offset + itemsNumber);
    const endCursor = edges[edges.length - 1].cursor;
    const hasNextPage = endCursor < allEdges[allEdges.length - 1].cursor;
    const newData = {
      totalCount: data.totalCount,
      pageInfo: {
        endCursor: endCursor,
        hasNextPage: hasNextPage
      },
      edges: edges,
      offset: 0,
      limit: itemsNumber
    };
    this.setState({ data: newData });
  };

  render() {
    return <Pagination data={this.state.data} loadData={this.loadData} />;
  }
}

const generateEdgesArray = quantity => {
  const allEdges = [];
  [...Array(quantity).keys()].forEach(function(element) {
    allEdges.push({ cursor: element, node: { id: element + 1, title: 'Item ' + (element + 1) } });
  });
  return allEdges;
};

const generateDataObject = allEdges => {
  const edges = allEdges.slice(0, 10);
  const hasNextPage = allEdges.length > paginationConfig.web.itemsNumber;
  const endCursor = edges[edges.length - 1].cursor;
  return {
    totalCount: allEdges.length,
    pageInfo: {
      endCursor: endCursor,
      hasNextPage: hasNextPage
    },
    edges: edges,
    offset: 0,
    limit: paginationConfig.web.itemsNumber
  };
};
