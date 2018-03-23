// Pagination types
interface Edge<T> {
  cursor?: number;
  node: T;
}

interface EntityList<T> {
  edges: Array<Edge<T>>;
  pageInfo: PageInfo;
  totalCount: number;
}

interface PageInfo {
  endCursor?: number;
  hasNextPage: boolean;
}

export { PageInfo, EntityList, Edge };

// Subscription data

interface Data<T> {
  data: T;
}

export interface SubscriptionData<T> {
  subscriptionData: Data<T>;
}
