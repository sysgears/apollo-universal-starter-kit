import Renderer from 'client/test-helpers/apollo_renderer';

import { expect } from 'chai';
import { step } from 'mocha-steps';
import _ from 'lodash';

import routes from 'client/app/routes';
import POSTS_SUBSCRIPTION from '../graphql/posts_subscription.graphql';

const createNode = (id) => ({
  id: `${id}`,
  title: `Post title ${id}`,
  content: `Post content ${id}`,
  __typename: "Post"
});

let mutations = {
  deletePost: true,
  editPost: true,
  addComment: true,
  deleteComment: true
};

const mocks = {
  Query: () => ({
    postsQuery(ignored, { after }) {
      const totalCount = 4;
      const edges = [];
      for (let i = +after + 1; i <= +after + 2; i++) {
        edges.push({
          cursor: `${i}`,
          node: createNode(i),
          __typename: "Edges"
        });
      }
      return {
        totalCount,
        edges,
        pageInfo: {
          endCursor: edges[edges.length - 1].cursor,
          hasNextPage: true,
          __typename: "PageInfo"
        },
        __typename: "PostsQuery"
      };
    },
    post(obj, { id }) {
      return createNode(id);
    },
  }),
  Mutation: () => mutations
};

describe('Posts and comments example UI works', () => {
  const renderer = new Renderer(mocks, {});
  let app;
  let content;

  beforeEach(() => {
    Object.keys(mutations).forEach(key => mutations[key] = true);
  });

  step('Posts page renders without data', () => {
    app = renderer.mount(routes);
    renderer.history.push('/posts');
    content = app.find('#content');

    expect(content.children().html()).to.equal('<div></div>');
  });

  step('Posts page renders with data', () => {
    expect(content.text()).to.include('Post title 1');
    expect(content.text()).to.include('Post title 2');
    expect(content.text()).to.include('2 / 4');
  });

  step('Clicking load more works', () => {
    const loadMoreButton = content.find('#load-more');
    loadMoreButton.simulate("click");
  });

  step('Clicking load more loads more posts', () => {
    expect(content.text()).to.include('Post title 3');
    expect(content.text()).to.include('Post title 4');
    expect(content.text()).to.include('4 / 4');
  });

  step('Check subscribed to post updates', () => {
    expect(renderer.getSubscriptions(POSTS_SUBSCRIPTION)).has.lengthOf(1);
  });

  step('Updates post list on post delete from subscription', () => {
    mutations.deletePost = (obj, { id }) => {
      return createNode(id);
    };

    const subscription = renderer.getSubscriptions(POSTS_SUBSCRIPTION)[0];
    subscription(null, {
      postsUpdated: {
        mutation: 'DELETED', node: createNode(2), __typename: 'UpdatePostPayload'
      }
    });

    expect(content.text()).to.not.include('Post title 2');
    expect(content.text()).to.include('3 / 3');
  });

  step('Updates post list on post create from subscription', () => {
    const subscription = renderer.getSubscriptions(POSTS_SUBSCRIPTION)[0];
    subscription(null, _.cloneDeep({
      postsUpdated: {
        mutation: 'CREATED', node: createNode(2),  __typename: 'UpdatePostPayload'
      }
    }));

    expect(content.text()).to.include('Post title 2');
    expect(content.text()).to.include('4 / 4');
  });

  step('Clicking delete optimistically removes post', () => {
    mutations.deletePost = (obj, { id }) => {
      return createNode(id);
    };

    const deleteButtons = content.find('.delete-button');
    expect(deleteButtons).has.lengthOf(4);
    deleteButtons.last().simulate("click");

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
    postLinks.last().simulate("click", { button: 0 });
  });

  step('Clicking on post opens post form', () => {
    const postForm = content.find('form[name="post"]');

    expect(content.text()).to.include('Edit Post');
    expect(postForm.find('[name="title"]').node.value).to.equal('Post title 3');
    expect(postForm.find('[name="content"]').node.value).to.equal('Post content 3');
  });

  step('Post editing form works', done => {
    mutations.editPost = (obj, { input })  => {
      expect(input.id).to.equal('3');
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
    mutations.addComment = (obj, { input })  => {
      expect(input.postId).to.equal('3');
      expect(input.content).to.equal('Post comment 24');
      done();
      return input;
    };

    const commentForm = content.find('form[name="comment"]');
    commentForm.find('[name="content"]').simulate('change', { target: { value: 'Post comment 24' } });
    commentForm.simulate('submit');
    expect(content.text()).to.include('Post comment 24');
  });

  step('Comment deleting optimistically removes comment', () => {
    mutations.deleteComment = (obj, { input })  => {
      return input;
    };

    const deleteButtons = content.find('.delete-comment');
    expect(deleteButtons).has.lengthOf(3);
    deleteButtons.last().simulate("click");

    expect(content.text()).to.not.include('Post comment 24');
    expect(content.find('.delete-comment')).has.lengthOf(2);
  });

  step('Clicking comment delete removes the comment', () => {
    expect(content.text()).to.not.include('Post comment 24');
    expect(content.find('.delete-comment')).has.lengthOf(2);
  });

});