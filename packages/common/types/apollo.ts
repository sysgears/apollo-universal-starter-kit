/* --- PAGINATOR --- */

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

/* --- SUBSCRIPTION --- */

type MutationAction = 'CREATED' | 'DELETED' | 'UPDATED';

interface SubscriptionSchema<T> {
  id?: number;
  node?: T;
  mutation: MutationAction;
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

/* --- APOLLO STATE --- */

type ApolloItem<T> = { [P in keyof T]?: T[P] } & { __typename: string };

/* --- RESPONSES --- */

interface Error {
  field: string;
  message: string;
}

interface Errors {
  errors: Error[];
}

/* --- EXPORTS --- */

export { Errors, Error };
export { PageInfo, EntityList, Edge };
export { ApolloItem };
export { SubscriptionResult };
