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

// Subscription data
interface SubscriptionData<T> {
  data: T;
}

export interface SubscriptionResult<T> {
  subscriptionData: SubscriptionData<T>;
}

/* Errors */
interface Error {
  field: string;
  message: string;
}

interface Errors {
  errors: Error[];
}

/* Types */
type ApolloItem<T> = { [P in keyof T]?: T[P] } & { __typename: string };

export { Errors, Error };
export { PageInfo, EntityList, Edge };
export { ApolloItem };
