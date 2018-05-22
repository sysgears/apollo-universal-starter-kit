import React from 'react';
import paginationConfig from '../../../../../../config/pagination';

const itemsNumber = paginationConfig.web.itemsNumber;

export default function withDataProvider(WrappedComponent) {
  return class PaginationDemoWithData extends React.Component {
    constructor(props) {
      super(props);
      this.allEdges = this.generateEdgesArray(47);
      this.state = { data: this.generateDataObject(this.allEdges, 0, 'replace') };
    }

    loadData = (offset, dataDelivery) => {
      const newData = this.generateDataObject(this.allEdges, offset, dataDelivery);
      this.setState({ data: newData });
    };

    generateEdgesArray = quantity => {
      const arr = [];
      for (let i = 1; i <= quantity; i++) {
        arr.push({ cursor: i, node: { id: i, title: 'Item ' + i } });
      }
      return arr;
    };

    generateDataObject = (allEdges, offset, dataDelivery) => {
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

    render() {
      return <WrappedComponent data={this.state.data} loadData={this.loadData} />;
    }
  };
}
