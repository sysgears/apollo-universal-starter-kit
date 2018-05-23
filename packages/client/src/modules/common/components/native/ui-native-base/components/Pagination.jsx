import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'native-base';

export default class Pagination extends React.Component {
  static propTypes = {
    totalPages: PropTypes.number,
    handlePageChange: PropTypes.func,
    pagination: PropTypes.string,
    loadMoreText: PropTypes.string,
    hasNextPage: PropTypes.bool
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps.pagination !== prevState.pagination ? { pageNumber: 1, pagination: nextProps.pagination } : null;
  }

  state = { pageNumber: 1, pagination: this.props.pagination };

  showPreviousPage() {
    if (this.state.pageNumber > 1) {
      this.setState(prevState => {
        const newPageNumber = prevState.pageNumber - 1;
        this.props.handlePageChange(this.props.pagination, newPageNumber);
        return {
          pageNumber: newPageNumber
        };
      });
    }
  }

  showNextPage(totalPages) {
    if (this.state.pageNumber < totalPages) {
      this.setState(prevState => {
        const newPageNumber = prevState.pageNumber + 1;
        this.props.handlePageChange(this.props.pagination, newPageNumber);
        return {
          pageNumber: newPageNumber
        };
      });
    }
  }

  onPressLoadMore = () => {
    this.props.handlePageChange(this.props.pagination, null);
  };

  render() {
    const { pageNumber } = this.state;
    const { totalPages, pagination, loadMoreText, hasNextPage } = this.props;
    if (pagination === 'standard') {
      return (
        <View style={styles.paginationContainer}>
          <Button
            onPress={this.showPreviousPage.bind(this)}
            info={true}
            style={styles.button}
            disabled={pageNumber <= 1}
          >
            <Text style={styles.buttonText}>{'<'}</Text>
          </Button>
          <Text style={styles.text}>
            {pageNumber}/{totalPages}
          </Text>
          <Button
            onPress={() => this.showNextPage(totalPages)}
            info={true}
            style={styles.button}
            disabled={pageNumber >= totalPages}
          >
            <Text style={styles.buttonText}>{'>'}</Text>
          </Button>
        </View>
      );
    } else {
      return hasNextPage ? (
        <View style={styles.loadMoreView}>
          <Button style={styles.loadMoreButton} onPress={this.onPressLoadMore}>
            <Text style={styles.loadMoreButtonText}>{loadMoreText}</Text>
          </Button>
        </View>
      ) : null;
    }
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
  },
  loadMoreView: {
    flex: 1,
    flexDirection: 'row'
  },
  loadMoreButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  loadMoreButtonText: {
    color: 'white'
  }
});
