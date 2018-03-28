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

/* Types */
type MutationActions = 'CREATED' | 'DELETED' | 'UPDATED';
type ApolloItem<T> = { [P in keyof T]?: T[P] } & { __typename: string };

// Subscription data
interface SubscriptionSchema<T> {
  id?: number;
  node?: T;
  mutation: MutationActions;
}

interface SubscriptionDataPayload<T> {
  [operation: string]: SubscriptionSchema<T>;
}

interface SubscriptionData<T> {
  data: SubscriptionDataPayload<T>;
}

interface SubscriptionResult<T> {
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

export { Errors, Error };
export { PageInfo, EntityList, Edge };
export { ApolloItem };
export { SubscriptionResult };
