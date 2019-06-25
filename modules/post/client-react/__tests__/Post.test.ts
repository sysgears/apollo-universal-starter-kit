import chai, { expect } from 'chai';
import _ from 'lodash';
import {
  find,
  findAll,
  updateContent,
  click,
  change,
  submit,
  wait,
  waitForElementRender,
  Renderer
} from '@gqlapp/testing-client-react';

import POSTS_SUBSCRIPTION from '../graphql/PostsSubscription.graphql';
import POST_SUBSCRIPTION from '../graphql/PostSubscription.graphql';
import COMMENT_SUBSCRIPTION from '../graphql/CommentSubscription.graphql';

chai.should();

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
  let app: any;
  let container: any;
  let content: any;

  beforeAll(async () => {
    app = renderer.mount();
    renderer.history.push('/posts');
    await waitForElementRender(app.container, 'h2');
  });

  beforeEach(async () => {
    // Reset spy mutations on each step
    Object.keys(mutations).forEach(key => delete mutations[key]);
    if (app) {
      container = app.container;
      content = updateContent(container);
    }
  });

  it('Posts page renders with data', () => {
    expect(content.textContent).to.include('Post title 1');
    expect(content.textContent).to.include('Post title 2');
    expect(content.textContent).to.include('2 / 4');
  });

  it('Clicking load more works', () => {
    const loadMoreButton = find(container, '#load-more');
    click(loadMoreButton);
  });

  it('Clicking load more loads more posts', () => {
    expect(content.textContent).to.include('Post title 3');
    expect(content.textContent).to.include('Post title 4');
    expect(content.textContent).to.include('4 / 4');
  });

  it('Check subscribed to post list updates', () => {
    expect(renderer.getSubscriptions(POSTS_SUBSCRIPTION)).has.lengthOf(1);
  });

  it('Updates post list on post delete from subscription', () => {
    const subscription = renderer.getSubscriptions(POSTS_SUBSCRIPTION)[0];
    subscription.next({
      data: {
        postsUpdated: {
          mutation: 'DELETED',
          node: createNode(2),
          __typename: 'UpdatePostPayload'
        }
      }
    });

    expect(content.textContent).to.not.include('Post title 2');
    expect(content.textContent).to.include('3 / 3');
  });

  it('Updates post list on post create from subscription', () => {
    const subscription = renderer.getSubscriptions(POSTS_SUBSCRIPTION)[0];
    subscription.next(
      _.cloneDeep({
        data: {
          postsUpdated: {
            mutation: 'CREATED',
            node: createNode(2),
            __typename: 'UpdatePostPayload'
          }
        }
      })
    );

    expect(content.textContent).to.include('Post title 2');
    expect(content.textContent).to.include('4 / 4');
  });

  it('Clicking delete optimistically removes post', () => {
    mutations.deletePost = (obj: any, { id }: any) => {
      return createNode(id);
    };

    const deleteButtons = findAll(container, '.delete-button');
    expect(deleteButtons).has.lengthOf(4);
    click(deleteButtons[deleteButtons.length - 1]);
    expect(content.textContent).to.not.include('Post title 4');
    expect(content.textContent).to.include('3 / 3');
  });

  it('Clicking delete removes the post', () => {
    expect(content.textContent).to.include('Post title 3');
    expect(content.textContent).to.not.include('Post title 4');
    expect(content.textContent).to.include('3 / 3');
  });

  it('Clicking on post works', () => {
    const postLinks = findAll(container, '.post-link');
    click(postLinks[postLinks.length - 1]);
  });

  it('Clicking on post opens post form', () => {
    expect(content.textContent).to.include('Edit Post');
    const postForm = find(container, 'form[name="post"]');
    expect(find(postForm, '[name="title"]').value).to.equal('Post title 3');
    expect(find(postForm, '[name="content"]').value).to.equal('Post content 3');
  });

  it('Check subscribed to post updates', () => {
    expect(renderer.getSubscriptions(POST_SUBSCRIPTION)).has.lengthOf(1);
  });

  it('Updates post form on post updated from subscription', () => {
    const subscription = renderer.getSubscriptions(POST_SUBSCRIPTION)[0];
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
    const postForm = find(container, 'form[name="post"]');
    expect(find(postForm, '[name="title"]').value).to.equal('Post title 203');
    expect(find(postForm, '[name="content"]').value).to.equal('Post content 204');
  });

  it('Post editing form works', done => {
    mutations.editPost = (obj: any, { input }: any) => {
      expect(input.id).to.equal(3);
      expect(input.title).to.equal('Post title 33');
      expect(input.content).to.equal('Post content 33');
      done();
      return input;
    };

    const postForm = find(container, 'form[name="post"]');
    change(find(postForm, '[name="title"]'), { target: { name: 'title', value: 'Post title 33' } });
    change(find(postForm, '[name="content"]'), { target: { name: 'content', value: 'Post content 33' } });
    submit(postForm);
  });

  it('Check opening post by URL', () => {
    renderer.history.push('/post/3');
  });

  it('Opening post by URL works', () => {
    const postForm = find(container, 'form[name="post"]');
    expect(content.textContent).to.include('Edit Post');
    expect(find(postForm, '[name="title"]').value).to.equal('Post title 33');
    expect(find(postForm, '[name="content"]').value).to.equal('Post content 33');
  });

  it('Comment adding works', done => {
    mutations.addComment = (obj: any, { input }: any) => {
      expect(input.postId).to.equal(3);
      expect(input.content).to.equal('Post comment 24');
      done();
      return input;
    };

    const commentForm = find(container, 'form[name="comment"]');
    change(find(commentForm, '[name="content"]'), { target: { name: 'content', value: 'Post comment 24' } });
    submit(commentForm);
  });

  it('Comment adding works after submit', () => {
    expect(content.textContent).to.include('Post comment 24');
  });

  it('Updates comment form on comment added got from subscription', () => {
    const subscription = renderer.getSubscriptions(COMMENT_SUBSCRIPTION)[0];
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

    expect(content.textContent).to.include('Post comment 3');
  });

  it('Updates comment form on comment deleted got from subscription', () => {
    const subscription = renderer.getSubscriptions(COMMENT_SUBSCRIPTION)[0];
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
    expect(content.textContent).to.not.include('Post comment 3');
  });

  it('Comment deleting optimistically removes comment', async () => {
    const deleteButtons = findAll(container, '.delete-comment');
    expect(deleteButtons).has.lengthOf(3);
    click(deleteButtons[deleteButtons.length - 1]);
    await wait(() => {
      expect(content.textContent).to.not.include('Post comment 24');
      expect(findAll(container, '.delete-comment')).has.lengthOf(2);
    });
  });

  it('Clicking comment delete removes the comment', () => {
    expect(content.textContent).to.not.include('Post comment 24');
    expect(findAll(container, '.delete-comment')).has.lengthOf(2);
  });
  it('Comment editing works', async done => {
    mutations.editComment = (obj: any, { input }: any) => {
      expect(input.postId).to.equal(3);
      expect(input.content).to.equal('Edited comment 2');
      done();
      return input;
    };
    const editButtons = findAll(container, '.edit-comment');
    expect(editButtons).has.lengthOf(2);
    click(editButtons[editButtons.length - 1]);
    await wait(() => app.getByPlaceholderText('Comment'));
    const commentForm = find(container, 'form[name="comment"]');
    expect(find(commentForm, '[name="content"]').value).to.equal('Post comment 2');
    change(find(commentForm, '[name="content"]'), { target: { name: 'content', value: 'Edited comment 2' } });
    submit(commentForm);
  });

  it('Clicking back button takes to post list', async () => {
    expect(content.textContent).to.include('Edited comment 2');
    const backButton = find(container, '#back-button');
    click(backButton);
    const loadMoreButton = await waitForElementRender(app.container, '#load-more');
    click(loadMoreButton);
    await waitForElementRender(app.container, 'a[href="/post/3"]');
    content = updateContent(container);
    // change posts query fetching policy, now if present difference in data we will get data from network
    expect(content.textContent).to.include('Post title 1');
  });
});
