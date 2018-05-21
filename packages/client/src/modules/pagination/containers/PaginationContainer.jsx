import React from 'react';
import Pagination from '../containers/Pagination';
import paginationConfig from '../../../../../../config/pagination';

const itemsNumber = paginationConfig.web.itemsNumber;

export default class PaginationContainer extends React.Component {
  constructor(props) {
    super(props);
    this.allEdges = generateEdgesArray(47);
    this.state = { data: generateDataObject(this.allEdges, 0, 'replace') };
  }

  loadData = (offset, dataDelivery) => {
    const { allEdges } = this;
    const newData = generateDataObject(allEdges, offset, dataDelivery);
    this.setState({ data: newData });
  };

  render() {
    const { data } = this.state;
    return <Pagination data={data} loadData={this.loadData} />;
  }
}

const generateEdgesArray = quantity => {
  const arr = [];
  for (let i = 1; i <= quantity; i++) {
    arr.push({ cursor: i, node: { id: i, title: 'Item ' + i } });
  }
  return arr;
};

const generateDataObject = (allEdges, offset, dataDelivery) => {
  const edges =
    dataDelivery === 'add' ? allEdges.slice(0, offset + itemsNumber) : allEdges.slice(offset, offset + itemsNumber);
  const endCursor = edges[edges.length - 1].cursor;
  const hasNextPage = endCursor < allEdges[allEdges.length - 1].cursor;
  return {
    totalCount: allEdges.length,
    pageInfo: {
      endCursor: endCursor,
      hasNextPage: hasNextPage
    },
    edges: edges,
    offset: offset,
    limit: itemsNumber
  };
};
