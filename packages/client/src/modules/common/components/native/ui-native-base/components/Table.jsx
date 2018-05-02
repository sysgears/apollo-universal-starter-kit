import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, FlatList, Text, View } from 'react-native';
import { Button } from 'native-base';

const RELAY_PAGINATION = 'relay';
const STANDARD_PAGINATION = 'standard';

class Table extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    posts: PropTypes.object,
    renderItem: PropTypes.func,
    loadMessage: PropTypes.string,
    handlePageChange: PropTypes.func,
    styles: PropTypes.object,
    keyExtractor: PropTypes.func,
    limit: PropTypes.number,
    pagination: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = { pageNumber: 1 };
  }

  componentDidUpdate() {
    this.props.handlePageChange(this.props.pagination, this.state.pageNumber);
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

  renderStandardPagination = (pagination, totalPages) => {
    if (pagination === STANDARD_PAGINATION) {
      const styles = StyleSheet.create({
        container: {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        },
        text: {
          fontSize: 20,
          alignSelf: 'center'
        },
        button: {
          paddingLeft: 20,
          paddingRight: 20
        },
        buttonText: {
          color: 'white',
          fontSize: 20
        }
      });
      return (
        <View style={styles.container}>
          <Button onPress={this.showPreviousPage.bind(this)} info={true} style={styles.button}>
            <Text style={styles.buttonText}>{'<'}</Text>
          </Button>
          <Text style={styles.text}>
            {this.state.pageNumber}/{totalPages}
          </Text>
          <Button onPress={e => this.showNextPage(e, totalPages)} info={true} style={styles.button}>
            <Text style={styles.buttonText}>{'>'}</Text>
          </Button>
        </View>
      );
    }
  };

  handleStandardPaginationPageChange = (pageNumber, handlePageChange) => {
    this.setState({ pageNumber: pageNumber });
    handlePageChange(STANDARD_PAGINATION, pageNumber);
  };

  render() {
    const {
      loading,
      posts,
      renderItem,
      loadMessage,
      handlePageChange,
      styles,
      keyExtractor,
      limit,
      pagination
    } = this.props;
    let onEndReachedCalledDuringMomentum = false;
    const totalPages = Math.ceil(posts.totalCount / limit);
    if (loading) {
      return (
        <View style={styles.container}>
          <Text>{loadMessage}</Text>
        </View>
      );
    } else {
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
          {this.renderStandardPagination(pagination, totalPages)}
        </View>
      );
    }
  }
}

export default Table;
export { RELAY_PAGINATION, STANDARD_PAGINATION };
