import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

import $Module$Form from './$Module$Form';

const $Module$EditView = ({ loading, $module$, navigation, onSubmit }) => {
  let $module$Obj = $module$;

  if (!$module$Obj && navigation.state) {
    $module$Obj = navigation.state.params.$module$;
  }

  if (loading && !$module$Obj) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return <$Module$Form onSubmit={onSubmit} initialValues={$module$Obj ? $module$Obj : {}} />;
  }
};

$Module$EditView.propTypes = {
  loading: PropTypes.bool.isRequired,
  $module$: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
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

export default $Module$EditView;
