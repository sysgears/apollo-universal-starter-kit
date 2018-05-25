import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ScrollView } from 'react-native';

import translate from '../../../i18n';
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
  addPost: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  t: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff'
  }
});

export default translate('post')(PostAddView);
