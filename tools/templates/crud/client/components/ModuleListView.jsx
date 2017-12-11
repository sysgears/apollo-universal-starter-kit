import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, FlatList, Text, View } from 'react-native';
import { SwipeAction } from '../../common/components/native';

class $Module$ListView extends React.PureComponent {
  keyExtractor = item => item.id;

  renderItem = ({ item: { id, name } }) => {
    const { delete$Module$, navigation } = this.props;
    return (
      <SwipeAction
        onPress={() => navigation.navigate('$Module$Edit', { id })}
        right={{
          text: 'Delete',
          onPress: () => delete$Module$(id)
        }}
      >
        {name}
      </SwipeAction>
    );
  };

  render() {
    const { loading, $module$s } = this.props;

    if (loading && !$module$s) {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    } else {
      return <FlatList data={$module$s} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />;
    }
  }
}

$Module$ListView.propTypes = {
  loading: PropTypes.bool.isRequired,
  $module$s: PropTypes.array,
  orderBy: PropTypes.object,
  onOrderBy: PropTypes.func.isRequired,
  delete$Module$: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  element: {
    paddingTop: 30
  },
  box: {
    textAlign: 'center',
    marginLeft: 15,
    marginRight: 15
  }
});

export default $Module$ListView;
