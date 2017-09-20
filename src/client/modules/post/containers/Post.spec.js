import { expect } from 'chai';
import { step } from 'mocha-steps';
import _ from 'lodash';

import Renderer from '../../../../client/testHelpers/Renderer';
import POSTS_SUBSCRIPTION from '../graphql/PostsSubscription.graphql';
import POST_SUBSCRIPTION from '../graphql/PostSubscription.graphql';
import COMMENT_SUBSCRIPTION from '../graphql/CommentSubscription.graphql';

const createNode = id => ({
  id: `${id}`,
  title: `Post title ${id}`,
  content: `Post content ${id}`,
  comments: [
    { id: id * 1000 + 1, content: 'Post comment 1', __typename: 'Comment' },
    { id: id * 1000 + 2, content: 'Post comment 2', __typename: 'Comment' }
  ],
  __typename: 'Post'
});

const mutations = {
  editPost: true,
  addComment: true,
  editComment: true
};

const mocks = {
  Query: () => ({
    posts(ignored, { after }) {
      const totalCount = 4;
      const edges = [];
      for (let i = +after + 1; i <= +after + 2; i++) {
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
    post(obj, { id }) {
      return createNode(id);
    }
  }),
  Mutation: () => ({
    deletePost: (obj, { id }) => createNode(id),
    deleteComment: (obj, { input }) => input,
    ...mutations
  })
};

describe('Posts and comments example UI works', () => {
  const renderer = new Renderer(mocks, {});
  let app;
  let content;

  beforeEach(() => {
    // Reset spy mutations on each step
    Object.keys(mutations).forEach(key => delete mutations[key]);
    content = app && app.find('#content');
  });

  step('Posts page renders without data', () => {
    app = renderer.mount();
    content = app.find('#content');
    renderer.history.push('/posts');

    content.text().should.equal('Loading...');
  });

  step('Posts page renders with data', () => {
    expect(content.text()).to.include('Post title 1');
    expect(content.text()).to.include('Post title 2');
    expect(content.text()).to.include('2 / 4');
  });

  step('Clicking load more works', () => {
    const loadMoreButton = content.find('#load-more');
    loadMoreButton.simulate('click');
  });

  step('Clicking load more loads more posts', () => {
    expect(content.text()).to.include('Post title 3');
    expect(content.text()).to.include('Post title 4');
    expect(content.text()).to.include('4 / 4');
  });

  step('Check subscribed to post list updates', () => {
    expect(renderer.getSubscriptions(POSTS_SUBSCRIPTION)).has.lengthOf(1);
  });

  step('Updates post list on post delete from subscription', () => {
    const subscription = renderer.getSubscriptions(POSTS_SUBSCRIPTION)[0];
    subscription(null, {
      postsUpdated: {
        mutation: 'DELETED',
        node: createNode(2),
        __typename: 'UpdatePostPayload'
      }
    });

    expect(content.text()).to.not.include('Post title 2');
    expect(content.text()).to.include('3 / 3');
  });

  step('Updates post list on post create from subscription', () => {
    const subscription = renderer.getSubscriptions(POSTS_SUBSCRIPTION)[0];
    subscription(
      null,
      _.cloneDeep({
        postsUpdated: {
          mutation: 'CREATED',
          node: createNode(2),
          __typename: 'UpdatePostPayload'
        }
      })
    );

    expect(content.text()).to.include('Post title 2');
    expect(content.text()).to.include('4 / 4');
  });

  step('Clicking delete optimistically removes post', () => {
    mutations.deletePost = (obj, { id }) => {
      return createNode(id);
    };

    const deleteButtons = content.find('.delete-button');
    expect(deleteButtons).has.lengthOf(4);
    deleteButtons.last().simulate('click');

    expect(content.text()).to.not.include('Post title 4');
    expect(content.text()).to.include('3 / 3');
  });

  step('Clicking delete removes the post', () => {
    expect(content.text()).to.include('Post title 3');
    expect(content.text()).to.not.include('Post title 4');
    expect(content.text()).to.include('3 / 3');
  });

  step('Clicking on post works', () => {
    const postLinks = content.find('.post-link');
    postLinks.last().simulate('click', { button: 0 });
  });

  step('Clicking on post opens post form', () => {
    const postForm = content.find('form[name="post"]');

    expect(content.text()).to.include('Edit Post');
    expect(postForm.find('[name="title"]').node.value).to.equal('Post title 3');
    expect(postForm.find('[name="content"]').node.value).to.equal('Post content 3');
  });

  step('Check subscribed to post updates', () => {
    expect(renderer.getSubscriptions(POST_SUBSCRIPTION)).has.lengthOf(1);
  });

  step('Updates post form on post updated from subscription', () => {
    const subscription = renderer.getSubscriptions(POST_SUBSCRIPTION)[0];
    subscription(null, {
      postUpdated: {
        id: '3',
        title: 'Post title 203',
        content: 'Post content 204',
        __typename: 'Post'
      }
    });
    const postForm = content.find('form[name="post"]');

    expect(postForm.find('[name="title"]').node.value).to.equal('Post title 203');
    expect(postForm.find('[name="content"]').node.value).to.equal('Post content 204');
  });

  step('Post editing form works', done => {
    mutations.editPost = (obj, { input }) => {
      expect(input.id).to.equal(3);
      expect(input.title).to.equal('Post title 33');
      expect(input.content).to.equal('Post content 33');
      done();
      return input;
    };

    const postForm = content.find('form[name="post"]');
    postForm.find('[name="title"]').simulate('change', { target: { value: 'Post title 33' } });
    postForm.find('[name="content"]').simulate('change', { target: { value: 'Post content 33' } });
    postForm.simulate('submit');
  });

  step('Check opening post by URL', () => {
    renderer.history.push('/post/3');
  });

  step('Opening post by URL works', () => {
    const postForm = content.find('form[name="post"]');

    expect(content.text()).to.include('Edit Post');
    expect(postForm.find('[name="title"]').node.value).to.equal('Post title 33');
    expect(postForm.find('[name="content"]').node.value).to.equal('Post content 33');
    expect(content.text()).to.include('Edit Post');
  });

  step('Comment adding works', done => {
    mutations.addComment = (obj, { input }) => {
      expect(input.postId).to.equal(3);
      expect(input.content).to.equal('Post comment 24');
      done();
      return input;
    };

    const commentForm = content.find('form[name="comment"]');
    commentForm.find('[name="content"]').simulate('change', { target: { value: 'Post comment 24' } });
    commentForm.simulate('submit');
    expect(content.text()).to.include('Post comment 24');
  });

  step('Updates comment form on comment added got from subscription', () => {
    const subscription = renderer.getSubscriptions(COMMENT_SUBSCRIPTION)[0];
    subscription(null, {
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
    });

    expect(content.text()).to.include('Post comment 3');
  });

  step('Updates comment form on comment deleted got from subscription', () => {
    const subscription = renderer.getSubscriptions(COMMENT_SUBSCRIPTION)[0];
    subscription(null, {
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
    });
    expect(content.text()).to.not.include('Post comment 3');
  });

  step('Comment deleting optimistically removes comment', () => {
    const deleteButtons = content.find('.delete-comment');
    expect(deleteButtons).has.lengthOf(3);
    deleteButtons.last().simulate('click');

    expect(content.text()).to.not.include('Post comment 24');
    expect(content.find('.delete-comment')).has.lengthOf(2);
  });

  step('Clicking comment delete removes the comment', () => {
    expect(content.text()).to.not.include('Post comment 24');
    expect(content.find('.delete-comment')).has.lengthOf(2);
  });

  step('Comment editing works', done => {
    mutations.editComment = (obj, { input }) => {
      expect(input.postId).to.equal(3);
      expect(input.content).to.equal('Edited comment 2');
      done();
      return input;
    };

    const editButtons = content.find('.edit-comment');
    expect(editButtons).has.lengthOf(2);
    editButtons.last().simulate('click');

    const commentForm = content.find('form[name="comment"]');
    expect(commentForm.find('[name="content"]').node.value).to.equal('Post comment 2');
    commentForm.find('[name="content"]').simulate('change', { target: { value: 'Edited comment 2' } });
    commentForm.simulate('submit');

    expect(content.text()).to.include('Edited comment 2');
  });

  step('Clicking back button takes to post list', () => {
    const backButton = content.find('#back-button');
    backButton.simulate('click', { button: 0 });
    content = app.find('#content');
    expect(content.text()).to.include('Post title 33');
  });
});
