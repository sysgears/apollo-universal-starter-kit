/* tslint:disable */

// ====================================================
// START: Typescript template
// ====================================================

import { GraphQLResolveInfo } from "graphql";

export type Resolver<Result, Parent = any, Context = any, Args = any> = (
  parent: Parent,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<Result> | Result;

export interface ISubscriptionResolverObject<Result, Parent, Context, Args> {
  subscribe<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): AsyncIterator<R | Result>;
  resolve?<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): R | Result | Promise<R | Result>;
}

export type SubscriptionResolver<
  Result,
  Parent = any,
  Context = any,
  Args = any
> =
  | ((
      ...args: any[]
    ) => ISubscriptionResolverObject<Result, Parent, Context, Args>)
  | ISubscriptionResolverObject<Result, Parent, Context, Args>;

// ====================================================
// Scalars
// ====================================================

export type UploadAttachment = any;

export type FileUpload = any;

export type Date = any;

export type Time = any;

export type DateTime = any;

// ====================================================
// Types
// ====================================================

export interface Query {
  dummy?: number | null;
  messages?: Messages | null /** Messages */;
  message?: Message | null /** Message */;
  serverCounter?: Counter | null /** Counter */;
  stripeSubscription?: StripeSubscription | null /** Get current user's subscription */;
  stripeSubscriptionProtectedNumber?: StripeSubscriberProtectedNumber | null /** Get magic number only available to subscribers */;
  stripeSubscriptionCard?: StripeSubscriptionCard | null /** Get payment information for current user's subscription */;
  posts?: Posts | null /** Posts pagination query */;
  post?: Post | null /** Post */;
  files?: (File | null)[] | null;
  users?:
    | (User | null)[]
    | null /** Get all users ordered by: OrderByUserInput add filtered by: FilterUserInput */;
  user?: UserPayload | null /** Get user by id */;
  currentUser?: User | null /** Get current user */;
}
/** Messages relay-style pagination query */
export interface Messages {
  totalCount?: number | null;
  edges?: (MessageEdges | null)[] | null;
  pageInfo?: MessagePageInfo | null;
}
/** Edges for Messages */
export interface MessageEdges {
  node?: Message | null;
  cursor?: number | null;
}
/** Message */
export interface Message {
  id: number;
  text?: string | null;
  userId?: number | null;
  createdAt?: string | null;
  username?: string | null;
  uuid?: string | null;
  quotedId?: number | null;
  filename?: string | null;
  path?: string | null;
  quotedMessage?: QuotedMessage | null;
}

export interface QuotedMessage {
  id?: number | null;
  text?: string | null;
  username?: string | null;
  filename?: string | null;
  path?: string | null;
}
/** PageInfo for Messages */
export interface MessagePageInfo {
  endCursor?: number | null;
  hasNextPage?: boolean | null;
}
/** Database counter */
export interface Counter {
  amount: number /** Current amount */;
}

export interface StripeSubscription {
  active: boolean;
  errors?: FieldError[] | null;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface StripeSubscriberProtectedNumber {
  number?: number | null;
}

export interface StripeSubscriptionCard {
  expiryMonth?: number | null;
  expiryYear?: number | null;
  last4?: string | null;
  brand?: string | null;
}
/** Posts relay-style pagination query */
export interface Posts {
  totalCount?: number | null;
  edges?: (PostEdges | null)[] | null;
  pageInfo?: PostPageInfo | null;
}
/** Edges for Posts */
export interface PostEdges {
  node?: Post | null;
  cursor?: number | null;
}
/** Post */
export interface Post {
  id: number;
  title: string;
  content: string;
  comments?: (Comment | null)[] | null;
}
/** Comment */
export interface Comment {
  id: number;
  content: string;
}
/** PageInfo for Posts */
export interface PostPageInfo {
  endCursor?: number | null;
  hasNextPage?: boolean | null;
}

export interface File {
  id: number;
  name: string;
  type: string;
  size: number;
  path: string;
}

export interface User {
  id: number;
  username: string;
  role: string;
  isActive?: boolean | null;
  email: string;
  profile?: UserProfile | null;
  auth?: UserAuth | null;
}

export interface UserProfile {
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
}
/** Additional authentication service info */
export interface UserAuth {
  certificate?: CertificateAuth | null;
  facebook?: FacebookAuth | null;
  google?: GoogleAuth | null;
  github?: GithubAuth | null;
  linkedin?: LinkedInAuth | null;
}

export interface CertificateAuth {
  serial?: string | null;
}

export interface FacebookAuth {
  fbId?: string | null;
  displayName?: string | null;
}

export interface GoogleAuth {
  googleId?: string | null;
  displayName?: string | null;
}

export interface GithubAuth {
  ghId?: string | null;
  displayName?: string | null;
}

export interface LinkedInAuth {
  lnId?: string | null;
  displayName?: string | null;
}

export interface UserPayload {
  user?: User | null;
  errors?: FieldError[] | null;
}

export interface Mutation {
  dummy?: number | null;
  addMessage?: Message | null /** Create new message */;
  deleteMessage?: Message | null /** Delete a message */;
  editMessage?: Message | null /** Edit a message */;
  contact: ContactPayload /** Send contact us info */;
  addServerCounter?: Counter | null /** Increase counter value, returns current counter amount */;
  addStripeSubscription: StripeSubscription /** Subscribe a user */;
  cancelStripeSubscription: StripeSubscription /** Cancel a user's subscription */;
  updateStripeSubscriptionCard: boolean /** Update a user's card information */;
  addPost?: Post | null /** Create new post */;
  deletePost?: Post | null /** Delete a post */;
  editPost?: Post | null /** Edit a post */;
  addComment?: Comment | null /** Add comment to post */;
  deleteComment?: Comment | null /** Delete a comment */;
  editComment?: Comment | null /** Edit a comment */;
  uploadFiles: boolean;
  removeFile: boolean;
  refreshTokens: Tokens /** Refresh user tokens */;
  logout?: string | null /** Logout user */;
  login: AuthPayload /** Login user */;
  forgotPassword?: string | null /** Forgot password */;
  resetPassword: ResetPayload /** Reset password */;
  register: UserPayload /** Register user */;
  addUser: UserPayload /** Create new user */;
  editUser: UserPayload /** Edit a user */;
  deleteUser: UserPayload /** Delete a user */;
}
/** Payload for contact Mutation */
export interface ContactPayload {
  errors?: FieldError[] | null;
}

export interface Tokens {
  accessToken?: string | null;
  refreshToken?: string | null;
}

export interface AuthPayload {
  user?: User | null;
  tokens?: Tokens | null;
  errors?: FieldError[] | null;
}

export interface ResetPayload {
  errors?: FieldError[] | null;
}

export interface Subscription {
  dummy?: number | null;
  messagesUpdated?: UpdateMessagesPayload | null /** Subscription fired when anyone changes messages list */;
  counterUpdated?: Counter | null /** Subscription fired when anyone increases counter */;
  postUpdated?: UpdatePostPayload | null /** Subscription for when editing a post */;
  postsUpdated?: UpdatePostPayload | null /** Subscription for post list */;
  commentUpdated?: UpdateCommentPayload | null /** Subscription for comments */;
  usersUpdated?: UpdateUserPayload | null /** Subscription for users list */;
}
/** Payload for messagesUpdated Subscription */
export interface UpdateMessagesPayload {
  mutation: string;
  id?: number | null;
  node: Message;
}
/** Payload for postsUpdated Subscription */
export interface UpdatePostPayload {
  mutation: string;
  id: number;
  node?: Post | null;
}
/** Payload for commentUpdated Subscription */
export interface UpdateCommentPayload {
  mutation: string;
  id?: number | null;
  postId: number;
  node?: Comment | null;
}
/** Payload for usersUpdated Subscription */
export interface UpdateUserPayload {
  mutation: string;
  node: User;
}

// ====================================================
// InputTypes
// ====================================================

/** Input for ordering users */
export interface OrderByUserInput {
  column?: string | null /** id | username | role | isActive | email */;
  order?: string | null /** asc | desc */;
}
/** Input for filtering users */
export interface FilterUserInput {
  searchText?: string | null /** search by username or email */;
  role?: string | null /** filter by role */;
  isActive?: boolean | null /** filter by isActive */;
}
/** Input for addMessage Mutation */
export interface AddMessageInput {
  text?: string | null;
  userId?: number | null;
  uuid?: string | null;
  quotedId?: number | null;
  attachment?: UploadAttachment | null;
}
/** Input for editMessage Mutation */
export interface EditMessageInput {
  id: number;
  text?: string | null;
  userId?: number | null;
}
/** Input for addPost Mutation */
export interface ContactInput {
  name: string;
  email: string;
  content: string;
}

export interface StripeSubscribtionInput {
  token: string;
  expiryMonth: number;
  expiryYear: number;
  last4: string;
  brand: string;
}
/** Input for addPost Mutation */
export interface AddPostInput {
  title: string;
  content: string;
}
/** Input for editPost Mutation */
export interface EditPostInput {
  id: number;
  title: string;
  content: string;
}
/** Input for addComment Mutation */
export interface AddCommentInput {
  content: string;
  postId: number /** Needed for commentUpdated Subscription filter */;
}
/** Input for editComment Mutation */
export interface DeleteCommentInput {
  id: number;
  postId: number /** Needed for commentUpdated Subscription filter */;
}
/** Input for deleteComment Mutation */
export interface EditCommentInput {
  id: number;
  content: string;
  postId: number /** Needed for commentUpdated Subscription filter */;
}

export interface LoginUserInput {
  usernameOrEmail: string;
  password: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
  passwordConfirmation: string;
}

export interface RegisterUserInput {
  username: string;
  email: string;
  password: string;
}
/** Input for addUser Mutation */
export interface AddUserInput {
  username: string;
  email: string;
  password: string;
  role: string;
  isActive?: boolean | null;
  profile?: ProfileInput | null;
  auth?: AuthInput | null;
}

export interface ProfileInput {
  firstName?: string | null;
  lastName?: string | null;
}
/** Additional authentication service info */
export interface AuthInput {
  certificate?: AuthCertificateInput | null;
  facebook?: AuthFacebookInput | null;
  google?: AuthGoogleInput | null;
  github?: AuthGitHubInput | null;
  linkedin?: AuthLinkedInInput | null;
}

export interface AuthCertificateInput {
  serial?: string | null;
}

export interface AuthFacebookInput {
  fbId?: string | null;
  displayName?: string | null;
}

export interface AuthGoogleInput {
  googleId?: string | null;
  displayName?: string | null;
}

export interface AuthGitHubInput {
  ghId?: string | null;
  displayName?: string | null;
}

export interface AuthLinkedInInput {
  lnId?: string | null;
  displayName?: string | null;
}
/** Input for editUser Mutation */
export interface EditUserInput {
  id: number;
  username: string;
  role: string;
  isActive?: boolean | null;
  email: string;
  password?: string | null;
  profile?: ProfileInput | null;
  auth?: AuthInput | null;
}

// ====================================================
// Arguments
// ====================================================

export interface MessagesQueryArgs {
  limit?: number | null;
  after?: number | null;
}
export interface MessageQueryArgs {
  id: number;
}
export interface PostsQueryArgs {
  limit?: number | null;
  after?: number | null;
}
export interface PostQueryArgs {
  id: number;
}
export interface UsersQueryArgs {
  orderBy?: OrderByUserInput | null;
  filter?: FilterUserInput | null;
}
export interface UserQueryArgs {
  id: number;
}
export interface AddMessageMutationArgs {
  input: AddMessageInput;
}
export interface DeleteMessageMutationArgs {
  id: number;
}
export interface EditMessageMutationArgs {
  input: EditMessageInput;
}
export interface ContactMutationArgs {
  input: ContactInput;
}
export interface AddServerCounterMutationArgs {
  amount: number /** Amount to add to counter */;
}
export interface AddStripeSubscriptionMutationArgs {
  input: StripeSubscribtionInput;
}
export interface UpdateStripeSubscriptionCardMutationArgs {
  input: StripeSubscribtionInput;
}
export interface AddPostMutationArgs {
  input: AddPostInput;
}
export interface DeletePostMutationArgs {
  id: number;
}
export interface EditPostMutationArgs {
  input: EditPostInput;
}
export interface AddCommentMutationArgs {
  input: AddCommentInput;
}
export interface DeleteCommentMutationArgs {
  input: DeleteCommentInput;
}
export interface EditCommentMutationArgs {
  input: EditCommentInput;
}
export interface UploadFilesMutationArgs {
  files: FileUpload[];
}
export interface RemoveFileMutationArgs {
  id: number;
}
export interface RefreshTokensMutationArgs {
  refreshToken: string;
}
export interface LoginMutationArgs {
  input: LoginUserInput;
}
export interface ForgotPasswordMutationArgs {
  input: ForgotPasswordInput;
}
export interface ResetPasswordMutationArgs {
  input: ResetPasswordInput;
}
export interface RegisterMutationArgs {
  input: RegisterUserInput;
}
export interface AddUserMutationArgs {
  input: AddUserInput;
}
export interface EditUserMutationArgs {
  input: EditUserInput;
}
export interface DeleteUserMutationArgs {
  id: number;
}
export interface MessagesUpdatedSubscriptionArgs {
  endCursor: number;
}
export interface PostUpdatedSubscriptionArgs {
  id: number;
}
export interface PostsUpdatedSubscriptionArgs {
  endCursor: number;
}
export interface CommentUpdatedSubscriptionArgs {
  postId: number;
}
export interface UsersUpdatedSubscriptionArgs {
  filter?: FilterUserInput | null;
}

// ====================================================
// Resolvers
// ====================================================

export namespace QueryResolvers {
  export interface Resolvers<Context = any> {
    dummy?: DummyResolver<number | null, any, Context>;
    messages?: MessagesResolver<Messages | null, any, Context> /** Messages */;
    message?: MessageResolver<Message | null, any, Context> /** Message */;
    serverCounter?: ServerCounterResolver<
      Counter | null,
      any,
      Context
    > /** Counter */;
    stripeSubscription?: StripeSubscriptionResolver<
      StripeSubscription | null,
      any,
      Context
    > /** Get current user's subscription */;
    stripeSubscriptionProtectedNumber?: StripeSubscriptionProtectedNumberResolver<
      StripeSubscriberProtectedNumber | null,
      any,
      Context
    > /** Get magic number only available to subscribers */;
    stripeSubscriptionCard?: StripeSubscriptionCardResolver<
      StripeSubscriptionCard | null,
      any,
      Context
    > /** Get payment information for current user's subscription */;
    posts?: PostsResolver<
      Posts | null,
      any,
      Context
    > /** Posts pagination query */;
    post?: PostResolver<Post | null, any, Context> /** Post */;
    files?: FilesResolver<(File | null)[] | null, any, Context>;
    users?: UsersResolver<
      (User | null)[] | null,
      any,
      Context
    > /** Get all users ordered by: OrderByUserInput add filtered by: FilterUserInput */;
    user?: UserResolver<UserPayload | null, any, Context> /** Get user by id */;
    currentUser?: CurrentUserResolver<
      User | null,
      any,
      Context
    > /** Get current user */;
  }

  export type DummyResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type MessagesResolver<
    R = Messages | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, MessagesArgs>;
  export interface MessagesArgs {
    limit?: number | null;
    after?: number | null;
  }

  export type MessageResolver<
    R = Message | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, MessageArgs>;
  export interface MessageArgs {
    id: number;
  }

  export type ServerCounterResolver<
    R = Counter | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StripeSubscriptionResolver<
    R = StripeSubscription | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StripeSubscriptionProtectedNumberResolver<
    R = StripeSubscriberProtectedNumber | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type StripeSubscriptionCardResolver<
    R = StripeSubscriptionCard | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PostsResolver<
    R = Posts | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, PostsArgs>;
  export interface PostsArgs {
    limit?: number | null;
    after?: number | null;
  }

  export type PostResolver<
    R = Post | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, PostArgs>;
  export interface PostArgs {
    id: number;
  }

  export type FilesResolver<
    R = (File | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UsersResolver<
    R = (User | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, UsersArgs>;
  export interface UsersArgs {
    orderBy?: OrderByUserInput | null;
    filter?: FilterUserInput | null;
  }

  export type UserResolver<
    R = UserPayload | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, UserArgs>;
  export interface UserArgs {
    id: number;
  }

  export type CurrentUserResolver<
    R = User | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** Messages relay-style pagination query */
export namespace MessagesResolvers {
  export interface Resolvers<Context = any> {
    totalCount?: TotalCountResolver<number | null, any, Context>;
    edges?: EdgesResolver<(MessageEdges | null)[] | null, any, Context>;
    pageInfo?: PageInfoResolver<MessagePageInfo | null, any, Context>;
  }

  export type TotalCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type EdgesResolver<
    R = (MessageEdges | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PageInfoResolver<
    R = MessagePageInfo | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** Edges for Messages */
export namespace MessageEdgesResolvers {
  export interface Resolvers<Context = any> {
    node?: NodeResolver<Message | null, any, Context>;
    cursor?: CursorResolver<number | null, any, Context>;
  }

  export type NodeResolver<
    R = Message | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CursorResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** Message */
export namespace MessageResolvers {
  export interface Resolvers<Context = any> {
    id?: IdResolver<number, any, Context>;
    text?: TextResolver<string | null, any, Context>;
    userId?: UserIdResolver<number | null, any, Context>;
    createdAt?: CreatedAtResolver<string | null, any, Context>;
    username?: UsernameResolver<string | null, any, Context>;
    uuid?: UuidResolver<string | null, any, Context>;
    quotedId?: QuotedIdResolver<number | null, any, Context>;
    filename?: FilenameResolver<string | null, any, Context>;
    path?: PathResolver<string | null, any, Context>;
    quotedMessage?: QuotedMessageResolver<QuotedMessage | null, any, Context>;
  }

  export type IdResolver<R = number, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type TextResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UserIdResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CreatedAtResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UsernameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UuidResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type QuotedIdResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FilenameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PathResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type QuotedMessageResolver<
    R = QuotedMessage | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace QuotedMessageResolvers {
  export interface Resolvers<Context = any> {
    id?: IdResolver<number | null, any, Context>;
    text?: TextResolver<string | null, any, Context>;
    username?: UsernameResolver<string | null, any, Context>;
    filename?: FilenameResolver<string | null, any, Context>;
    path?: PathResolver<string | null, any, Context>;
  }

  export type IdResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TextResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UsernameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FilenameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PathResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** PageInfo for Messages */
export namespace MessagePageInfoResolvers {
  export interface Resolvers<Context = any> {
    endCursor?: EndCursorResolver<number | null, any, Context>;
    hasNextPage?: HasNextPageResolver<boolean | null, any, Context>;
  }

  export type EndCursorResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type HasNextPageResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** Database counter */
export namespace CounterResolvers {
  export interface Resolvers<Context = any> {
    amount?: AmountResolver<number, any, Context> /** Current amount */;
  }

  export type AmountResolver<
    R = number,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace StripeSubscriptionResolvers {
  export interface Resolvers<Context = any> {
    active?: ActiveResolver<boolean, any, Context>;
    errors?: ErrorsResolver<FieldError[] | null, any, Context>;
  }

  export type ActiveResolver<
    R = boolean,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ErrorsResolver<
    R = FieldError[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace FieldErrorResolvers {
  export interface Resolvers<Context = any> {
    field?: FieldResolver<string, any, Context>;
    message?: MessageResolver<string, any, Context>;
  }

  export type FieldResolver<R = string, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type MessageResolver<
    R = string,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace StripeSubscriberProtectedNumberResolvers {
  export interface Resolvers<Context = any> {
    number?: NumberResolver<number | null, any, Context>;
  }

  export type NumberResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace StripeSubscriptionCardResolvers {
  export interface Resolvers<Context = any> {
    expiryMonth?: ExpiryMonthResolver<number | null, any, Context>;
    expiryYear?: ExpiryYearResolver<number | null, any, Context>;
    last4?: Last4Resolver<string | null, any, Context>;
    brand?: BrandResolver<string | null, any, Context>;
  }

  export type ExpiryMonthResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ExpiryYearResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type Last4Resolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type BrandResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** Posts relay-style pagination query */
export namespace PostsResolvers {
  export interface Resolvers<Context = any> {
    totalCount?: TotalCountResolver<number | null, any, Context>;
    edges?: EdgesResolver<(PostEdges | null)[] | null, any, Context>;
    pageInfo?: PageInfoResolver<PostPageInfo | null, any, Context>;
  }

  export type TotalCountResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type EdgesResolver<
    R = (PostEdges | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PageInfoResolver<
    R = PostPageInfo | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** Edges for Posts */
export namespace PostEdgesResolvers {
  export interface Resolvers<Context = any> {
    node?: NodeResolver<Post | null, any, Context>;
    cursor?: CursorResolver<number | null, any, Context>;
  }

  export type NodeResolver<
    R = Post | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CursorResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** Post */
export namespace PostResolvers {
  export interface Resolvers<Context = any> {
    id?: IdResolver<number, any, Context>;
    title?: TitleResolver<string, any, Context>;
    content?: ContentResolver<string, any, Context>;
    comments?: CommentsResolver<(Comment | null)[] | null, any, Context>;
  }

  export type IdResolver<R = number, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type TitleResolver<R = string, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type ContentResolver<
    R = string,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type CommentsResolver<
    R = (Comment | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** Comment */
export namespace CommentResolvers {
  export interface Resolvers<Context = any> {
    id?: IdResolver<number, any, Context>;
    content?: ContentResolver<string, any, Context>;
  }

  export type IdResolver<R = number, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type ContentResolver<
    R = string,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** PageInfo for Posts */
export namespace PostPageInfoResolvers {
  export interface Resolvers<Context = any> {
    endCursor?: EndCursorResolver<number | null, any, Context>;
    hasNextPage?: HasNextPageResolver<boolean | null, any, Context>;
  }

  export type EndCursorResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type HasNextPageResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace FileResolvers {
  export interface Resolvers<Context = any> {
    id?: IdResolver<number, any, Context>;
    name?: NameResolver<string, any, Context>;
    type?: TypeResolver<string, any, Context>;
    size?: SizeResolver<number, any, Context>;
    path?: PathResolver<string, any, Context>;
  }

  export type IdResolver<R = number, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type NameResolver<R = string, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type TypeResolver<R = string, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type SizeResolver<R = number, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type PathResolver<R = string, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
}

export namespace UserResolvers {
  export interface Resolvers<Context = any> {
    id?: IdResolver<number, any, Context>;
    username?: UsernameResolver<string, any, Context>;
    role?: RoleResolver<string, any, Context>;
    isActive?: IsActiveResolver<boolean | null, any, Context>;
    email?: EmailResolver<string, any, Context>;
    profile?: ProfileResolver<UserProfile | null, any, Context>;
    auth?: AuthResolver<UserAuth | null, any, Context>;
  }

  export type IdResolver<R = number, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type UsernameResolver<
    R = string,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RoleResolver<R = string, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type IsActiveResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type EmailResolver<R = string, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type ProfileResolver<
    R = UserProfile | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type AuthResolver<
    R = UserAuth | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace UserProfileResolvers {
  export interface Resolvers<Context = any> {
    firstName?: FirstNameResolver<string | null, any, Context>;
    lastName?: LastNameResolver<string | null, any, Context>;
    fullName?: FullNameResolver<string | null, any, Context>;
  }

  export type FirstNameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type LastNameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FullNameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** Additional authentication service info */
export namespace UserAuthResolvers {
  export interface Resolvers<Context = any> {
    certificate?: CertificateResolver<CertificateAuth | null, any, Context>;
    facebook?: FacebookResolver<FacebookAuth | null, any, Context>;
    google?: GoogleResolver<GoogleAuth | null, any, Context>;
    github?: GithubResolver<GithubAuth | null, any, Context>;
    linkedin?: LinkedinResolver<LinkedInAuth | null, any, Context>;
  }

  export type CertificateResolver<
    R = CertificateAuth | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type FacebookResolver<
    R = FacebookAuth | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GoogleResolver<
    R = GoogleAuth | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GithubResolver<
    R = GithubAuth | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type LinkedinResolver<
    R = LinkedInAuth | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace CertificateAuthResolvers {
  export interface Resolvers<Context = any> {
    serial?: SerialResolver<string | null, any, Context>;
  }

  export type SerialResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace FacebookAuthResolvers {
  export interface Resolvers<Context = any> {
    fbId?: FbIdResolver<string | null, any, Context>;
    displayName?: DisplayNameResolver<string | null, any, Context>;
  }

  export type FbIdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DisplayNameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace GoogleAuthResolvers {
  export interface Resolvers<Context = any> {
    googleId?: GoogleIdResolver<string | null, any, Context>;
    displayName?: DisplayNameResolver<string | null, any, Context>;
  }

  export type GoogleIdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DisplayNameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace GithubAuthResolvers {
  export interface Resolvers<Context = any> {
    ghId?: GhIdResolver<string | null, any, Context>;
    displayName?: DisplayNameResolver<string | null, any, Context>;
  }

  export type GhIdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DisplayNameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace LinkedInAuthResolvers {
  export interface Resolvers<Context = any> {
    lnId?: LnIdResolver<string | null, any, Context>;
    displayName?: DisplayNameResolver<string | null, any, Context>;
  }

  export type LnIdResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type DisplayNameResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace UserPayloadResolvers {
  export interface Resolvers<Context = any> {
    user?: UserResolver<User | null, any, Context>;
    errors?: ErrorsResolver<FieldError[] | null, any, Context>;
  }

  export type UserResolver<
    R = User | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ErrorsResolver<
    R = FieldError[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace MutationResolvers {
  export interface Resolvers<Context = any> {
    dummy?: DummyResolver<number | null, any, Context>;
    addMessage?: AddMessageResolver<
      Message | null,
      any,
      Context
    > /** Create new message */;
    deleteMessage?: DeleteMessageResolver<
      Message | null,
      any,
      Context
    > /** Delete a message */;
    editMessage?: EditMessageResolver<
      Message | null,
      any,
      Context
    > /** Edit a message */;
    contact?: ContactResolver<
      ContactPayload,
      any,
      Context
    > /** Send contact us info */;
    addServerCounter?: AddServerCounterResolver<
      Counter | null,
      any,
      Context
    > /** Increase counter value, returns current counter amount */;
    addStripeSubscription?: AddStripeSubscriptionResolver<
      StripeSubscription,
      any,
      Context
    > /** Subscribe a user */;
    cancelStripeSubscription?: CancelStripeSubscriptionResolver<
      StripeSubscription,
      any,
      Context
    > /** Cancel a user's subscription */;
    updateStripeSubscriptionCard?: UpdateStripeSubscriptionCardResolver<
      boolean,
      any,
      Context
    > /** Update a user's card information */;
    addPost?: AddPostResolver<Post | null, any, Context> /** Create new post */;
    deletePost?: DeletePostResolver<
      Post | null,
      any,
      Context
    > /** Delete a post */;
    editPost?: EditPostResolver<Post | null, any, Context> /** Edit a post */;
    addComment?: AddCommentResolver<
      Comment | null,
      any,
      Context
    > /** Add comment to post */;
    deleteComment?: DeleteCommentResolver<
      Comment | null,
      any,
      Context
    > /** Delete a comment */;
    editComment?: EditCommentResolver<
      Comment | null,
      any,
      Context
    > /** Edit a comment */;
    uploadFiles?: UploadFilesResolver<boolean, any, Context>;
    removeFile?: RemoveFileResolver<boolean, any, Context>;
    refreshTokens?: RefreshTokensResolver<
      Tokens,
      any,
      Context
    > /** Refresh user tokens */;
    logout?: LogoutResolver<string | null, any, Context> /** Logout user */;
    login?: LoginResolver<AuthPayload, any, Context> /** Login user */;
    forgotPassword?: ForgotPasswordResolver<
      string | null,
      any,
      Context
    > /** Forgot password */;
    resetPassword?: ResetPasswordResolver<
      ResetPayload,
      any,
      Context
    > /** Reset password */;
    register?: RegisterResolver<UserPayload, any, Context> /** Register user */;
    addUser?: AddUserResolver<UserPayload, any, Context> /** Create new user */;
    editUser?: EditUserResolver<UserPayload, any, Context> /** Edit a user */;
    deleteUser?: DeleteUserResolver<
      UserPayload,
      any,
      Context
    > /** Delete a user */;
  }

  export type DummyResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type AddMessageResolver<
    R = Message | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, AddMessageArgs>;
  export interface AddMessageArgs {
    input: AddMessageInput;
  }

  export type DeleteMessageResolver<
    R = Message | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, DeleteMessageArgs>;
  export interface DeleteMessageArgs {
    id: number;
  }

  export type EditMessageResolver<
    R = Message | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, EditMessageArgs>;
  export interface EditMessageArgs {
    input: EditMessageInput;
  }

  export type ContactResolver<
    R = ContactPayload,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, ContactArgs>;
  export interface ContactArgs {
    input: ContactInput;
  }

  export type AddServerCounterResolver<
    R = Counter | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, AddServerCounterArgs>;
  export interface AddServerCounterArgs {
    amount: number /** Amount to add to counter */;
  }

  export type AddStripeSubscriptionResolver<
    R = StripeSubscription,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, AddStripeSubscriptionArgs>;
  export interface AddStripeSubscriptionArgs {
    input: StripeSubscribtionInput;
  }

  export type CancelStripeSubscriptionResolver<
    R = StripeSubscription,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UpdateStripeSubscriptionCardResolver<
    R = boolean,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, UpdateStripeSubscriptionCardArgs>;
  export interface UpdateStripeSubscriptionCardArgs {
    input: StripeSubscribtionInput;
  }

  export type AddPostResolver<
    R = Post | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, AddPostArgs>;
  export interface AddPostArgs {
    input: AddPostInput;
  }

  export type DeletePostResolver<
    R = Post | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, DeletePostArgs>;
  export interface DeletePostArgs {
    id: number;
  }

  export type EditPostResolver<
    R = Post | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, EditPostArgs>;
  export interface EditPostArgs {
    input: EditPostInput;
  }

  export type AddCommentResolver<
    R = Comment | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, AddCommentArgs>;
  export interface AddCommentArgs {
    input: AddCommentInput;
  }

  export type DeleteCommentResolver<
    R = Comment | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, DeleteCommentArgs>;
  export interface DeleteCommentArgs {
    input: DeleteCommentInput;
  }

  export type EditCommentResolver<
    R = Comment | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, EditCommentArgs>;
  export interface EditCommentArgs {
    input: EditCommentInput;
  }

  export type UploadFilesResolver<
    R = boolean,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, UploadFilesArgs>;
  export interface UploadFilesArgs {
    files: FileUpload[];
  }

  export type RemoveFileResolver<
    R = boolean,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, RemoveFileArgs>;
  export interface RemoveFileArgs {
    id: number;
  }

  export type RefreshTokensResolver<
    R = Tokens,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, RefreshTokensArgs>;
  export interface RefreshTokensArgs {
    refreshToken: string;
  }

  export type LogoutResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type LoginResolver<
    R = AuthPayload,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, LoginArgs>;
  export interface LoginArgs {
    input: LoginUserInput;
  }

  export type ForgotPasswordResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, ForgotPasswordArgs>;
  export interface ForgotPasswordArgs {
    input: ForgotPasswordInput;
  }

  export type ResetPasswordResolver<
    R = ResetPayload,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, ResetPasswordArgs>;
  export interface ResetPasswordArgs {
    input: ResetPasswordInput;
  }

  export type RegisterResolver<
    R = UserPayload,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, RegisterArgs>;
  export interface RegisterArgs {
    input: RegisterUserInput;
  }

  export type AddUserResolver<
    R = UserPayload,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, AddUserArgs>;
  export interface AddUserArgs {
    input: AddUserInput;
  }

  export type EditUserResolver<
    R = UserPayload,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, EditUserArgs>;
  export interface EditUserArgs {
    input: EditUserInput;
  }

  export type DeleteUserResolver<
    R = UserPayload,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, DeleteUserArgs>;
  export interface DeleteUserArgs {
    id: number;
  }
}
/** Payload for contact Mutation */
export namespace ContactPayloadResolvers {
  export interface Resolvers<Context = any> {
    errors?: ErrorsResolver<FieldError[] | null, any, Context>;
  }

  export type ErrorsResolver<
    R = FieldError[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace TokensResolvers {
  export interface Resolvers<Context = any> {
    accessToken?: AccessTokenResolver<string | null, any, Context>;
    refreshToken?: RefreshTokenResolver<string | null, any, Context>;
  }

  export type AccessTokenResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type RefreshTokenResolver<
    R = string | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace AuthPayloadResolvers {
  export interface Resolvers<Context = any> {
    user?: UserResolver<User | null, any, Context>;
    tokens?: TokensResolver<Tokens | null, any, Context>;
    errors?: ErrorsResolver<FieldError[] | null, any, Context>;
  }

  export type UserResolver<
    R = User | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TokensResolver<
    R = Tokens | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type ErrorsResolver<
    R = FieldError[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace ResetPayloadResolvers {
  export interface Resolvers<Context = any> {
    errors?: ErrorsResolver<FieldError[] | null, any, Context>;
  }

  export type ErrorsResolver<
    R = FieldError[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace SubscriptionResolvers {
  export interface Resolvers<Context = any> {
    dummy?: DummyResolver<number | null, any, Context>;
    messagesUpdated?: MessagesUpdatedResolver<
      UpdateMessagesPayload | null,
      any,
      Context
    > /** Subscription fired when anyone changes messages list */;
    counterUpdated?: CounterUpdatedResolver<
      Counter | null,
      any,
      Context
    > /** Subscription fired when anyone increases counter */;
    postUpdated?: PostUpdatedResolver<
      UpdatePostPayload | null,
      any,
      Context
    > /** Subscription for when editing a post */;
    postsUpdated?: PostsUpdatedResolver<
      UpdatePostPayload | null,
      any,
      Context
    > /** Subscription for post list */;
    commentUpdated?: CommentUpdatedResolver<
      UpdateCommentPayload | null,
      any,
      Context
    > /** Subscription for comments */;
    usersUpdated?: UsersUpdatedResolver<
      UpdateUserPayload | null,
      any,
      Context
    > /** Subscription for users list */;
  }

  export type DummyResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = SubscriptionResolver<R, Parent, Context>;
  export type MessagesUpdatedResolver<
    R = UpdateMessagesPayload | null,
    Parent = any,
    Context = any
  > = SubscriptionResolver<R, Parent, Context, MessagesUpdatedArgs>;
  export interface MessagesUpdatedArgs {
    endCursor: number;
  }

  export type CounterUpdatedResolver<
    R = Counter | null,
    Parent = any,
    Context = any
  > = SubscriptionResolver<R, Parent, Context>;
  export type PostUpdatedResolver<
    R = UpdatePostPayload | null,
    Parent = any,
    Context = any
  > = SubscriptionResolver<R, Parent, Context, PostUpdatedArgs>;
  export interface PostUpdatedArgs {
    id: number;
  }

  export type PostsUpdatedResolver<
    R = UpdatePostPayload | null,
    Parent = any,
    Context = any
  > = SubscriptionResolver<R, Parent, Context, PostsUpdatedArgs>;
  export interface PostsUpdatedArgs {
    endCursor: number;
  }

  export type CommentUpdatedResolver<
    R = UpdateCommentPayload | null,
    Parent = any,
    Context = any
  > = SubscriptionResolver<R, Parent, Context, CommentUpdatedArgs>;
  export interface CommentUpdatedArgs {
    postId: number;
  }

  export type UsersUpdatedResolver<
    R = UpdateUserPayload | null,
    Parent = any,
    Context = any
  > = SubscriptionResolver<R, Parent, Context, UsersUpdatedArgs>;
  export interface UsersUpdatedArgs {
    filter?: FilterUserInput | null;
  }
}
/** Payload for messagesUpdated Subscription */
export namespace UpdateMessagesPayloadResolvers {
  export interface Resolvers<Context = any> {
    mutation?: MutationResolver<string, any, Context>;
    id?: IdResolver<number | null, any, Context>;
    node?: NodeResolver<Message, any, Context>;
  }

  export type MutationResolver<
    R = string,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NodeResolver<R = Message, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
}
/** Payload for postsUpdated Subscription */
export namespace UpdatePostPayloadResolvers {
  export interface Resolvers<Context = any> {
    mutation?: MutationResolver<string, any, Context>;
    id?: IdResolver<number, any, Context>;
    node?: NodeResolver<Post | null, any, Context>;
  }

  export type MutationResolver<
    R = string,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<R = number, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type NodeResolver<
    R = Post | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** Payload for commentUpdated Subscription */
export namespace UpdateCommentPayloadResolvers {
  export interface Resolvers<Context = any> {
    mutation?: MutationResolver<string, any, Context>;
    id?: IdResolver<number | null, any, Context>;
    postId?: PostIdResolver<number, any, Context>;
    node?: NodeResolver<Comment | null, any, Context>;
  }

  export type MutationResolver<
    R = string,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = number | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type PostIdResolver<
    R = number,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NodeResolver<
    R = Comment | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}
/** Payload for usersUpdated Subscription */
export namespace UpdateUserPayloadResolvers {
  export interface Resolvers<Context = any> {
    mutation?: MutationResolver<string, any, Context>;
    node?: NodeResolver<User, any, Context>;
  }

  export type MutationResolver<
    R = string,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type NodeResolver<R = User, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
}

// ====================================================
// END: Typescript template
// ====================================================
