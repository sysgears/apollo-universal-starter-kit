import { act, fireEvent, wait, waitForElement, RenderResult } from '@testing-library/react';

import { Renderer } from '@gqlapp/testing-client-react';

import POSTS_SUBSCRIPTION from '../graphql/PostsSubscription.graphql';
import POST_SUBSCRIPTION from '../graphql/PostSubscription.graphql';
import COMMENT_SUBSCRIPTION from '../graphql/CommentSubscription.graphql';

const createNode = (id: number) => ({
  id,
  title: `Post title ${id}`,
  content: `Post content ${id}`,
  comments: [
    { id: id * 1000 + 1, content: 'Post comment 1', __typename: 'Comment' },
    { id: id * 1000 + 2, content: 'Post comment 2', __typename: 'Comment' }
  ],
  __typename: 'Post'
});

const mutations: any = {
  editPost: () => {},
  addComment: () => {},
  editComment: () => {},
  onCommentSelect: () => {}
};

const mocks = {
  Query: () => ({
    posts(ignored: any, { after }: any) {
      const totalCount = 4;
      const edges = [];
      const postId = after < 1 ? +after + 1 : +after;
      for (let i = postId; i <= postId + 1; i++) {
        edges.push({
          cursor: i,
          node: createNode(i),
          __typename: 'PostEdges'
        });
      }
      return {
        totalCount,
        edges,
        pageInfo: {
          endCursor: edges[edges.length - 1].cursor,
          hasNextPage: true,
          __typename: 'PostPageInfo'
        },
        __typename: 'Posts'
      };
    },
    post(obj: any, { id }: any) {
      return createNode(id);
    }
  }),
  Mutation: () => ({
    deletePost: (obj: any, { id }: any) => createNode(id),
    deleteComment: (obj: any, { input }: any) => input,
    ...mutations
  })
};

describe('Posts and comments example UI works', () => {
  const renderer = new Renderer(mocks, {});

  let dom: RenderResult;

  beforeAll(async () => {
    dom = renderer.mount();

    act(() => {
      renderer.history.push('/posts');
    });

    await waitForElement(() => dom.getByText('Posts'));
  });

  it('Posts page renders with data', () => {
    expect(dom.getByText('Post title 1')).toBeDefined();
    expect(dom.getByText('Post title 2')).toBeDefined();
    expect(dom.getByText(RegExp(/2[\s]*\/[\s]*4/))).toBeDefined();
  });

  it('Clicking load more loads more posts', async () => {
    act(() => {
      const loadMoreButton = dom.getByText(RegExp('Load more'));
      fireEvent.click(loadMoreButton);
    });

    await wait(() => {
      expect(dom.getByText('Post title 3')).toBeDefined();
      expect(dom.getByText('Post title 4')).toBeDefined();
      expect(dom.getByText(RegExp(/4[\s]*\/[\s]*4/))).toBeDefined();
    });
  });

  it('Check subscribed to post list updates', () => {
    expect(renderer.getSubscriptions(POSTS_SUBSCRIPTION)).toHaveLength(1);
  });

  it('Updates post list on post delete from subscription', async () => {
    const subscription = renderer.getSubscriptions(POSTS_SUBSCRIPTION)[0];

    act(() => {
      subscription.next({
        data: {
          postsUpdated: {
            mutation: 'DELETED',
            node: createNode(2),
            __typename: 'UpdatePostPayload'
          }
        }
      });
    });

    await wait(() => {
      expect(dom.queryByText('Post title 2')).toBeNull();
      expect(dom.getByText(RegExp(/3[\s]*\/[\s]*3/))).toBeDefined();
    });
  });

  it('Updates post list on post create from subscription', async () => {
    const subscription = renderer.getSubscriptions(POSTS_SUBSCRIPTION)[0];

    act(() => {
      subscription.next({
        data: {
          postsUpdated: {
            mutation: 'CREATED',
            node: createNode(2),
            __typename: 'UpdatePostPayload'
          }
        }
      });
    });

    await wait(() => {
      expect(dom.getByText('Post title 2')).toBeDefined();
      expect(dom.getByText(RegExp(/4[\s]*\/[\s]*4/))).toBeDefined();
    });
  });

  it('Clicking delete removes the post', async () => {
    mutations.deletePost = (obj: any, { id }: any) => {
      return createNode(id);
    };

    const deleteButtons = dom.getAllByText('Delete');
    expect(deleteButtons).toHaveLength(4);

    act(() => {
      fireEvent.click(deleteButtons[deleteButtons.length - 1]);
    });

    await wait(() => {
      expect(dom.getByText('Post title 3')).toBeDefined();
      expect(dom.queryByText('Post title 4')).toBeNull();
      expect(dom.getByText(RegExp(/3[\s]*\/[\s]*3/))).toBeDefined();
    });
  });

  it('Clicking on post opens post form', async () => {
    const post3 = dom.getByText('Post title 3');

    act(() => {
      fireEvent.click(post3);
    });

    await wait(() => {
      expect(dom.getByDisplayValue('Post title 3')).toBeDefined();
      expect(dom.getByDisplayValue('Post content 3')).toBeDefined();
      expect(dom.getByText(/Edit[\s]*Post/)).toBeDefined();
    });
  });

  it('Check subscribed to post updates', () => {
    expect(renderer.getSubscriptions(POST_SUBSCRIPTION)).toHaveLength(1);
  });

  it('Updates post form when post updated from subscription', async () => {
    const subscription = renderer.getSubscriptions(POST_SUBSCRIPTION)[0];

    act(() => {
      subscription.next({
        data: {
          postUpdated: {
            mutation: 'UPDATED',
            id: 3,
            node: {
              id: 3,
              title: 'Post title 203',
              content: 'Post content 204',
              __typename: 'Post'
            },
            __typename: 'UpdatePostPayload'
          }
        }
      });
    });

    await wait(() => {
      expect(dom.getByDisplayValue('Post title 203')).toBeDefined();
      expect(dom.getByDisplayValue('Post content 204')).toBeDefined();
    });
  });

  it('Opening post by URL works', async () => {
    act(() => {
      renderer.history.push('/post/4');
    });

    await wait(() => {
      expect(dom.getByText(/Edit[\s]+Post/)).toBeDefined();
      expect(dom.getByDisplayValue('Post title 4')).toBeDefined();
      expect(dom.getByDisplayValue('Post content 4')).toBeDefined();
    });
  });

  it('Post editing form works', async () => {
    let values: any;

    mutations.editPost = (obj: any, { input }: any) => (values = input);

    // FIXME: `act` should be enabled here and below, when `formik` will support it correctly
    // act(() => {
    fireEvent.change(dom.getByPlaceholderText('Title'), { target: { value: 'Post title 44' } });
    fireEvent.change(dom.getByPlaceholderText('Content'), { target: { value: 'Post content 44' } });
    fireEvent.click(dom.getByText('Update'));
    // });

    await wait(() => {
      expect(values.id).toEqual(4);
      expect(values.title).toEqual('Post title 44');
      expect(values.content).toEqual('Post content 44');
    });
  });

  it('Comment adding works', async () => {
    let values: any;

    mutations.addComment = (obj: any, { input }: any) => (values = input);

    act(() => {
      renderer.history.push('/post/4');
    });

    await wait(() => {
      expect(dom.getByText(/Edit[\s]+Post/)).toBeDefined();
    });

    fireEvent.change(dom.getByPlaceholderText('Comment'), { target: { value: 'Post comment 24' } });
    fireEvent.click(dom.getByText('Save'));

    await wait(() => {
      expect(values.postId).toEqual(4);
      expect(values.content).toEqual('Post comment 24');
      expect(dom.getByText('Post comment 24')).toBeDefined();
    });
  });

  it('Updates comment form on comment added got from subscription', () => {
    const subscription = renderer.getSubscriptions(COMMENT_SUBSCRIPTION)[0];

    act(() => {
      subscription.next({
        data: {
          commentUpdated: {
            mutation: 'CREATED',
            id: 3003,
            postId: 3,
            node: {
              id: 3003,
              content: 'Post comment 3',
              __typename: 'Comment'
            },
            __typename: 'UpdateCommentPayload'
          }
        }
      });
    });

    expect(dom.getByText('Post comment 3')).toBeDefined();
  });

  it('Updates comment form on comment deleted got from subscription', () => {
    const subscription = renderer.getSubscriptions(COMMENT_SUBSCRIPTION)[0];

    act(() => {
      subscription.next({
        data: {
          commentUpdated: {
            mutation: 'DELETED',
            id: 3003,
            postId: 3,
            node: {
              id: 3003,
              content: 'Post comment 3',
              __typename: 'Comment'
            },
            __typename: 'UpdateCommentPayload'
          }
        }
      });
    });

    expect(dom.queryByText('Post comment 3')).toBeNull();
  });

  it('Comment deleting removes comment', async () => {
    const deleteButtons = dom.getAllByText('Delete');
    expect(deleteButtons).toHaveLength(3);

    act(() => {
      fireEvent.click(deleteButtons[deleteButtons.length - 1]);
    });

    await wait(() => {
      expect(dom.queryByText('Post comment 24')).toBeNull();
      expect(dom.getAllByText('Delete')).toHaveLength(2);
    });
  });

  it('Comment editing works', async () => {
    let values: any;

    mutations.editComment = (obj: any, { input }: any) => (values = input);

    const editButtons = dom.getAllByText('Edit');
    expect(dom.getByText('Post comment 2'));
    expect(editButtons).toHaveLength(2);

    act(() => {
      fireEvent.click(editButtons[editButtons.length - 1]);
    });

    await waitForElement(() => dom.getByDisplayValue('Post comment 2'));

    fireEvent.change(dom.getByDisplayValue('Post comment 2'), { target: { value: 'Edited comment 2' } });
    fireEvent.submit(dom.getByText('Save'));

    await wait(() => {
      expect(values.postId).toEqual(4);
      expect(values.content).toEqual('Edited comment 2');
    });
  });

  it('Clicking back button takes to post list', async () => {
    const backButton = dom.getByText('Back');
    act(() => {
      fireEvent.click(backButton);
    });

    const loadMoreButton = await waitForElement(() => dom.getByText(RegExp('Load more')));
    act(() => {
      fireEvent.click(loadMoreButton);
    });

    await waitForElement(() => dom.getByText('Post title 1'));
  });
});
