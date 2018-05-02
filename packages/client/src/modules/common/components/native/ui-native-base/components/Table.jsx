import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, FlatList, Text, View } from 'react-native';
import { Button } from 'native-base';

const RELAY_PAGINATION = 'relay';
const STANDARD_PAGINATION = 'standard';

class StandardPagination extends React.Component {
  static propTypes = {
    totalPages: PropTypes.number,
    handlePageChange: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = { pageNumber: 1 };
  }

  componentDidUpdate() {
    this.props.handlePageChange(STANDARD_PAGINATION, this.state.pageNumber);
  }

  showPreviousPage(e) {
    e.preventDefault();
    if (this.state.pageNumber > 1) {
      this.setState(prevState => {
        return {
          pageNumber: prevState.pageNumber - 1
        };
      });
    }
  }

  showNextPage(e, totalPages) {
    e.preventDefault();
    if (this.state.pageNumber < totalPages) {
      this.setState(prevState => {
        return {
          pageNumber: prevState.pageNumber + 1
        };
      });
    }
  }

  render() {
    const { pageNumber } = this.state;
    const { totalPages } = this.props;
    return (
      <View style={styles.paginationContainer}>
        <Button onPress={this.showPreviousPage.bind(this)} info={true} style={styles.button} disabled={pageNumber <= 1}>
          <Text style={styles.buttonText}>{'<'}</Text>
        </Button>
        <Text style={styles.text}>
          {pageNumber}/{totalPages}
        </Text>
        <Button
          onPress={e => this.showNextPage(e, totalPages)}
          info={true}
          style={styles.button}
          disabled={pageNumber >= totalPages}
        >
          <Text style={styles.buttonText}>{'>'}</Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  paginationContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  text: {
    fontSize: 20,
    alignSelf: 'center'
  },
  button: {
    paddingLeft: 40,
    paddingRight: 40
  },
  buttonText: {
    color: 'white',
    fontSize: 20
  }
});

const renderStandardPagination = (pagination, totalPages, handlePageChange) => {
  if (pagination === STANDARD_PAGINATION) {
    return <StandardPagination totalPages={totalPages} handlePageChange={handlePageChange} />;
  }
};

const Table = ({ posts, renderItem, handlePageChange, keyExtractor, limit, pagination }) => {
  let onEndReachedCalledDuringMomentum = false;
  return (
    <View>
      <FlatList
        data={posts.edges}
        style={{ marginTop: 5 }}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum = false;
        }}
        onEndReached={() => {
          if (pagination === RELAY_PAGINATION && !onEndReachedCalledDuringMomentum) {
            if (posts.pageInfo.hasNextPage) {
              onEndReachedCalledDuringMomentum = true;
              return handlePageChange(RELAY_PAGINATION, null);
            }
          }
        }}
      />
      {renderStandardPagination(pagination, Math.ceil(posts.totalCount / limit), handlePageChange)}
    </View>
  );
};

Table.propTypes = {
  posts: PropTypes.object,
  renderItem: PropTypes.func,
  handlePageChange: PropTypes.func,
  keyExtractor: PropTypes.func,
  limit: PropTypes.number,
  pagination: PropTypes.string
};

export default Table;
export { RELAY_PAGINATION, STANDARD_PAGINATION };
