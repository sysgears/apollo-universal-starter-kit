import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { DrawerItems } from 'react-navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20
  }
});

const DrawerComponent = props => {
  const skippedItems = Object.keys(props.drawerItems).filter(name => props.drawerItems[name].skip);
  return (
    <ScrollView style={styles.container}>
      <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
        <DrawerItems
          {...props}
          onItemPress={({ focused, route }) => {
            if (!skippedItems.includes(route.routeName)) {
              props.onItemPress({ focused, route });
            }
          }}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

DrawerComponent.propTypes = {
  onItemPress: PropTypes.func,
  drawerItems: PropTypes.object
};

export default DrawerComponent;
