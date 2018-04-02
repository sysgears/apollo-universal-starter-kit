import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { DrawerItems } from 'react-navigation';

import modules from '../../../../modules';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20
  },
  footerContainer: {
    padding: 15,
    backgroundColor: 'lightgrey'
  }
});

const DrawerComponent = props => {
  const items = modules.drawerFooterItems;
  return (
    <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
      <View style={styles.container}>
        <ScrollView>
          <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
            <DrawerItems {...props} />
          </SafeAreaView>
        </ScrollView>
        {items.length > 0 && <View style={styles.footerContainer}>{items}</View>}
      </View>
    </SafeAreaView>
  );
};

DrawerComponent.propTypes = {
  navigation: PropTypes.object
};

export default DrawerComponent;
