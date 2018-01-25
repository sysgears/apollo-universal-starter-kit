import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, FlatList, Text, View } from 'react-native';
import { SwipeAction } from '../native';

class ListView extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    data: PropTypes.array,
    orderBy: PropTypes.object,
    onOrderBy: PropTypes.func.isRequired,
    deleteEntry: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    nativeLink: PropTypes.string.isRequired
  };

  keyExtractor = item => item.id;

  renderItem = ({ item: { id, name } }) => {
    const { deleteEntry, navigation, nativeLink } = this.props;
    return (
      <SwipeAction
        onPress={() => navigation.navigate(nativeLink, { id })}
        right={{
          text: 'Delete',
          onPress: () => deleteEntry(id)
        }}
      >
        {name}
      </SwipeAction>
    );
  };

  render() {
    const { loading, data } = this.props;

    if (loading && !data) {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    } else {
      return <FlatList data={data} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />;
    }
  }
}

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

export default ListView;
