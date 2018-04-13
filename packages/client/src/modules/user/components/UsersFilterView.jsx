import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';
import { debounce } from 'lodash';
import { Select, SearchBar, Switch } from '../../common/components/native';

export default class UsersFilterView extends React.PureComponent {
  static propTypes = {
    searchText: PropTypes.string,
    role: PropTypes.string,
    isActive: PropTypes.bool,
    onSearchTextChange: PropTypes.func.isRequired,
    onRoleChange: PropTypes.func.isRequired,
    onIsActiveChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.onChangeTextDelayed = debounce(this.handleSearch, 500);
  }

  handleSearch = text => {
    const { onSearchTextChange } = this.props;
    onSearchTextChange(text);
  };

  handleRole = value => {
    const { onRoleChange } = this.props;
    const preparedValue = Array.isArray(value) ? value[0] : value;
    onRoleChange(preparedValue);
  };

  handleIsActive = () => {
    const { onIsActiveChange, isActive } = this.props;
    onIsActiveChange(!isActive);
  };

  render() {
    const { role, isActive } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <SearchBar placeholder="Search user..." onChangeText={this.onChangeTextDelayed} />
        </View>
        <View style={styles.selectContainer}>
          <Select
            icon
            mode="dropdown"
            data={[{ value: '', label: 'All' }, { value: 'user', label: 'user' }, { value: 'admin', label: 'admin' }]}
            selectedValue={role}
            placeholder="Filter by role..."
            onValueChange={value => this.handleRole(value)}
            cols={1}
            extra="All"
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>Is Active</Text>
          <Switch onValueChange={this.handleIsActive} value={isActive} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  selectContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  switchContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  switchText: {
    fontSize: 16
  }
});
