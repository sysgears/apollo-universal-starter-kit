import React from 'react';
import { graphql } from 'react-apollo';

import PostAddView from '../components/PostAddView';

import ADD_POST from '../graphql/AddPost.graphql';

class PostAdd extends React.Component {
  constructor(props) {
    super(props);
    this.subscription = null;
  }

  render() {
    return <PostAddView {...this.props} />;
  }
}

export default graphql(ADD_POST, {
  props: ({ ownProps: { history, navigation }, mutate }) => ({
    addPost: async (title, content) => {
      let postData = await mutate({
        variables: { input: { title: title.trim(), content: content.trim() } },
        optimisticResponse: {
          __typename: 'Mutation',
          addPost: {
            __typename: 'Post',
            id: null,
            title: title,
            content: content,
            comments: []
          }
        }
      });

      if (history) {
        return history.push('/post/' + postData.data.addPost.id, {
          post: postData.data.addPost
        });
      } else if (navigation) {
        return navigation.navigate('PostEdit', { id: postData.data.addPost.id });
      }
    }
  })
})(PostAdd);
