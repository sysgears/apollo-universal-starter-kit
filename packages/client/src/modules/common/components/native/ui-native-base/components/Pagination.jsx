import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'native-base';

export default class Pagination extends React.Component {
  static propTypes = {
    totalPages: PropTypes.number,
    handlePageChange: PropTypes.func,
    pagination: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = { pageNumber: 1 };
  }

  componentDidUpdate() {
    if (this.props.pagination === 'standard') {
      this.props.handlePageChange(this.props.pagination, this.state.pageNumber);
    }
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
    const { totalPages, pagination } = this.props;
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
            onPress={e => this.showNextPage(e, totalPages)}
            info={true}
            style={styles.button}
            disabled={pageNumber >= totalPages}
          >
            <Text style={styles.buttonText}>{'>'}</Text>
          </Button>
        </View>
      );
    } else {
      return null;
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
  }
});
