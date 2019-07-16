import React, { useState, useEffect, useCallback } from 'react';

import settings from '@gqlapp/config';

const generateEdgesArray = quantity => {
  const arr = [];
  for (let i = 1; i <= quantity; i++) {
    arr.push({ cursor: i, node: { id: i, title: 'Item ' + i } });
  }
  return arr;
};

const itemsNumber = settings.pagination.web.itemsNumber;
const allEdges = generateEdgesArray(47);

export const useDataProvider = () => {
  const [items, setItems] = useState(null);

  useEffect(() => {
    loadData(0, 'replace');
  }, [loadData]);

  const loadData = useCallback(
    (offset, dataDelivery) => {
      const newEdges = allEdges.slice(offset, offset + itemsNumber);
      const edges = dataDelivery === 'add' ? (!items ? newEdges : [...items.edges, ...newEdges]) : newEdges;
      const endCursor = edges[edges.length - 1].cursor;
      const hasNextPage = endCursor < allEdges[allEdges.length - 1].cursor;
      setItems({
        totalCount: allEdges.length,
        pageInfo: {
          endCursor: endCursor,
          hasNextPage: hasNextPage
        },
        edges: edges,
        offset: offset,
        limit: itemsNumber
      });
    },
    [items]
  );

  return { items, loadData };
};

export default function withDataProvider(WrappedComponent) {
  return class PaginationDemoWithData extends React.Component {
    constructor(props) {
      super(props);
      this.state = { items: null };
    }

    componentDidMount() {
      this.loadData(0, 'replace');
    }

    loadData = (offset, dataDelivery) => {
      const { items } = this.state;
      const newEdges = allEdges.slice(offset, offset + itemsNumber);
      const edges = dataDelivery === 'add' ? (!items ? newEdges : [...items.edges, ...newEdges]) : newEdges;
      const endCursor = edges[edges.length - 1].cursor;
      const hasNextPage = endCursor < allEdges[allEdges.length - 1].cursor;
      this.setState({
        items: {
          totalCount: allEdges.length,
          pageInfo: {
            endCursor: endCursor,
            hasNextPage: hasNextPage
          },
          edges: edges,
          offset: offset,
          limit: itemsNumber
        }
      });
    };

    render() {
      return <WrappedComponent items={this.state.items} loadData={this.loadData} />;
    }
  };
}
