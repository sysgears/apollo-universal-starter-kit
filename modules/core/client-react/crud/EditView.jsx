import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

import FormView from './FormView';

const EditView = ({ loading, data, navigation, schema, updateEntry, createEntry }) => {
  let dataObj = data;

  if (!dataObj && navigation.state) {
    dataObj = navigation.state.params.data;
  }

  if (loading && !dataObj) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
      <FormView data={dataObj ? dataObj : {}} schema={schema} updateEntry={updateEntry} createEntry={createEntry} />
    );
  }
};

EditView.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.object,
  navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default EditView;
