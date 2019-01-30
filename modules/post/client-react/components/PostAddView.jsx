import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet, View } from 'react-native';
import { translate } from '@gqlapp/i18n-client-react';

import PostForm from './PostForm';

const onSubmit = addPost => values => {
  addPost(values.title, values.content);
};

const PostAddView = ({ addPost }) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <PostForm onSubmit={onSubmit(addPost)} />
      </ScrollView>
    </View>
  );
};

PostAddView.propTypes = {
  addPost: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff'
  }
});

export default translate('post')(PostAddView);
