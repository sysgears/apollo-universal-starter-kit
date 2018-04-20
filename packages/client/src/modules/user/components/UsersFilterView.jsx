import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { debounce } from 'lodash';
import { FontAwesome } from '@expo/vector-icons';
import {
  Select,
  SearchBar,
  Switch,
  List,
  ListItem,
  success,
  danger,
  Modal,
  Button
} from '../../common/components/native';

const orderByParams = [
  {
    label: 'Username',
    value: 'username'
  },
  {
    label: 'Email',
    value: 'email'
  },
  {
    label: 'Role',
    value: 'role'
  },
  {
    label: 'Is Active',
    value: 'isActive'
  }
];

export default class UsersFilterView extends React.PureComponent {
  static propTypes = {
    searchText: PropTypes.string,
    role: PropTypes.string,
    isActive: PropTypes.bool,
    onSearchTextChange: PropTypes.func.isRequired,
    onRoleChange: PropTypes.func.isRequired,
    onIsActiveChange: PropTypes.func.isRequired,
    orderBy: PropTypes.object,
    onOrderBy: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      orderBy: {
        column: '',
        order: ''
      }
    };
    this.onChangeTextDelayed = debounce(this.handleSearch, 500);
  }

  renderOrderByArrow = name => {
    const { orderBy } = this.state;

    if (orderBy && orderBy.column === name) {
      if (orderBy.order === 'desc') {
        return <FontAwesome name="long-arrow-up" size={16} style={styles.iconStyle} />;
      } else {
        return <FontAwesome name="long-arrow-down" size={16} style={styles.iconStyle} />;
      }
    } else {
      return <FontAwesome name="arrows-v" size={16} style={styles.iconStyle} />;
    }
  };

  orderBy = name => {
    const { orderBy } = this.state;

    let order = 'asc';
    if (orderBy && orderBy.column === name) {
      if (orderBy.order === 'asc') {
        order = 'desc';
      } else if (orderBy.order === 'desc') {
        return this.setState({
          orderBy: {
            column: '',
            order: ''
          }
        });
      }
    }
    return this.setState({ orderBy: { column: name, order } });
  };

  renderListItem = (label, value, idx) => {
    return (
      <ListItem key={idx} onPress={() => this.orderBy(value)}>
        <View style={styles.orderByListItemWrapper}>
          <View style={styles.labelWrapper}>
            <Text style={styles.switchText}>{label}</Text>
          </View>
          <View style={styles.iconWrapper}>{this.renderOrderByArrow(value)}</View>
        </View>
      </ListItem>
    );
  };

  renderModalChildren = () => {
    const { orderBy } = this.props;

    return (
      <View>
        <View style={styles.listWrapper}>
          <List>{orderByParams.map((item, idx) => this.renderListItem(item.label, item.value, idx))}</List>
        </View>
        <View style={styles.buttonWrapper}>
          <Button type={success} onPress={this.onOrderBy}>
            Submit
          </Button>
        </View>
        <View style={styles.buttonWrapper}>
          <Button type={danger} onPress={() => this.setState({ showModal: !this.state.showModal, orderBy })}>
            Close
          </Button>
        </View>
      </View>
    );
  };

  onOrderBy = () => {
    this.props.onOrderBy(this.state.orderBy);
    this.setState({ showModal: false });
  };

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
        <TouchableOpacity style={styles.orderByContainer} onPress={() => this.setState({ showModal: true })}>
          <Text>Order By</Text>
          <FontAwesome name="sort" size={25} style={styles.iconStyle} />
        </TouchableOpacity>
        <Modal
          isVisible={this.state.showModal}
          onSwipe={() => this.setState({ showModal: false })}
          onBackdropPress={() => this.setState({ showModal: false })}
          swipeDirection="left"
        >
          {this.renderModalChildren()}
        </Modal>
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
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#ddd'
  },
  switchText: {
    fontSize: 16
  },
  orderByContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  orderByListItemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  labelWrapper: {
    flex: 9
  },
  iconWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconStyle: {
    color: '#000'
  },
  buttonWrapper: {
    marginTop: 10
  },
  listWrapper: {
    backgroundColor: '#fff'
  }
});
