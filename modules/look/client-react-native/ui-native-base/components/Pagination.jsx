import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'native-base';

const Pagination = ({ handlePageChange, pagination, totalPages, loadMoreText, hasNextPage }) => {
  const [pageNumber, setPageNumber] = useState(1);

  const showPreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(prevPageNumber => {
        const newPageNumber = prevPageNumber - 1;
        handlePageChange(pagination, newPageNumber);
        return newPageNumber;
      });
    }
  };

  const showNextPage = totalPages => {
    if (pageNumber < totalPages) {
      setPageNumber(prevPageNumber => {
        const newPageNumber = prevPageNumber + 1;
        handlePageChange(pagination, newPageNumber);
        return newPageNumber;
      });
    }
  };

  const onPressLoadMore = () => handlePageChange(pagination, null);

  if (pagination === 'standard') {
    return (
      <View style={styles.paginationContainer}>
        <Button onPress={showPreviousPage} info={true} style={styles.button} disabled={pageNumber <= 1}>
          <Text style={styles.buttonText}>{'<'}</Text>
        </Button>
        <Text style={styles.text}>
          {pageNumber}/{totalPages}
        </Text>
        <Button
          onPress={() => showNextPage(totalPages)}
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
        <Button style={styles.loadMoreButton} onPress={onPressLoadMore}>
          <Text style={styles.loadMoreButtonText}>{loadMoreText}</Text>
        </Button>
      </View>
    ) : null;
  }
};

Pagination.propTypes = {
  totalPages: PropTypes.number,
  handlePageChange: PropTypes.func,
  pagination: PropTypes.string,
  loadMoreText: PropTypes.string,
  hasNextPage: PropTypes.bool
};

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

export default Pagination;
