/*eslint-disable react/display-name*/
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, FlatList, Text, View } from 'react-native';
import { SwipeAction } from '../../common/components/native';

class ChatList extends React.PureComponent {
  onEndReachedCalledDuringMomentum = false;

  keyExtractor = item => item.node.id;

  renderItem = ({ item: { node: { id, title } } }) => {
    const { deleteChat, navigation } = this.props;
    return (
      <SwipeAction
        onPress={() => navigation.navigate('ChatEdit', { id })}
        right={{
          text: 'Delete',
          onPress: () => deleteChat(id)
        }}
      >
        {title}
      </SwipeAction>
    );
  };

  render() {
    const { loading, chats, loadMoreRows } = this.props;

    if (loading) {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    } else {
      return (
        <FlatList
          data={chats.edges}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false;
          }}
          onEndReached={() => {
            if (!this.onEndReachedCalledDuringMomentum) {
              if (chats.pageInfo.hasNextPage) {
                this.onEndReachedCalledDuringMomentum = true;
                return loadMoreRows();
              }
            }
          }}
        />
      );
    }
  }
}

ChatList.propTypes = {
  loading: PropTypes.bool.isRequired,
  chats: PropTypes.object,
  navigation: PropTypes.object,
  deleteChat: PropTypes.func.isRequired,
  loadMoreRows: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default ChatList;
