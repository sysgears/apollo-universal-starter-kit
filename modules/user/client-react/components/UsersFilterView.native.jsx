import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { debounce } from 'lodash';
import { FontAwesome } from '@expo/vector-icons';
import { translate } from '@gqlapp/i18n-client-react';
import {
  Select,
  SearchBar,
  Switch,
  List,
  ListItem,
  success,
  danger,
  Modal,
  Button,
  lookStyles
} from '@gqlapp/look-client-react-native';

const UsersFilterView = props => {
  const [showModal, setShowModal] = useState(false);
  const [orderBy, setOrderBy] = useState({
    column: '',
    order: ''
  });

  const renderOrderByArrow = name => {
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

  const handleOrderBy = name => {
    let order = 'asc';
    if (orderBy && orderBy.column === name) {
      if (orderBy.order === 'asc') {
        order = 'desc';
      } else if (orderBy.order === 'desc') {
        setOrderBy({
          column: '',
          order: ''
        });
        return;
      }
    }
    setOrderBy({ column: name, order });
  };

  const renderListItem = (label, value, idx) => {
    return (
      <ListItem key={idx} onPress={() => handleOrderBy(value)}>
        <View style={styles.itemContainer}>
          <View style={styles.itemTitle}>
            <Text>{label}</Text>
          </View>
          <View style={styles.itemAction}>{renderOrderByArrow(value)}</View>
        </View>
      </ListItem>
    );
  };

  const renderModalChildren = () => {
    const { orderBy, t } = props;

    const orderByParams = [
      {
        label: t('users.column.name'),
        value: 'username'
      },
      {
        label: t('users.column.email'),
        value: 'email'
      },
      {
        label: t('users.column.role'),
        value: 'role'
      },
      {
        label: t('users.column.active'),
        value: 'isActive'
      }
    ];
    return (
      <View>
        <View style={styles.listWrapper}>
          <List>{orderByParams.map((item, idx) => renderListItem(item.label, item.value, idx))}</List>
        </View>
        <View style={styles.buttonWrapper}>
          <Button type={success} onPress={onOrderBy}>
            {t('users.btnModalSubmit')}
          </Button>
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            type={danger}
            onPress={() => {
              setShowModal(!showModal);
              setOrderBy(orderBy);
            }}
          >
            {t('users.btnModalClose')}
          </Button>
        </View>
      </View>
    );
  };

  const onOrderBy = () => {
    props.onOrderBy(orderBy);
    setShowModal(false);
  };

  const handleSearch = text => {
    const { onSearchTextChange } = props;
    onSearchTextChange(text);
  };

  const handleRole = value => {
    const { onRoleChange } = props;
    onRoleChange(value);
  };

  const handleIsActive = () => {
    const {
      onIsActiveChange,
      filter: { isActive }
    } = props;
    onIsActiveChange(!isActive);
  };

  const onChangeTextDelayed = debounce(handleSearch, 500);

  const {
    filter: { role, isActive },
    t
  } = props;

  const options = [
    { value: '', label: t('users.list.item.role.all') },
    { value: 'user', label: t('users.list.item.role.user') },
    { value: 'admin', label: t('users.list.item.role.admin') }
  ];

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <SearchBar placeholder={t('users.list.item.search')} onChangeText={onChangeTextDelayed} />
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>{t('users.list.item.role.label')}</Text>
        <View style={[styles.itemAction, styles.itemSelect]}>
          <Select
            icon
            iconName="caret-down"
            placeholder={t('users.list.item.role.all')}
            mode="dropdown"
            data={options}
            selectedValue={role}
            onChange={value => handleRole(value)}
            okText={t('users.select.okText')}
            dismissText={t('users.select.dismissText')}
            cols={1}
            extra={t('users.list.item.role.all')}
          />
        </View>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>{t('users.column.active')}</Text>
        <View style={styles.itemAction}>
          <Switch onChange={handleIsActive} value={isActive} />
        </View>
      </View>
      <TouchableOpacity style={styles.itemContainer} onPress={() => setShowModal(true)}>
        <Text style={styles.itemTitle}>{t('users.orderByText')}</Text>
        <View style={styles.itemAction}>
          <FontAwesome name="sort" size={25} style={styles.iconStyle} />
        </View>
      </TouchableOpacity>
      <Modal
        isVisible={showModal}
        onSwipe={() => setShowModal(false)}
        onBackdropPress={() => setShowModal(false)}
        swipeDirection="left"
      >
        {renderModalChildren()}
      </Modal>
    </View>
  );
};

UsersFilterView.propTypes = {
  searchText: PropTypes.string,
  role: PropTypes.string,
  isActive: PropTypes.bool,
  onSearchTextChange: PropTypes.func.isRequired,
  onRoleChange: PropTypes.func.isRequired,
  onIsActiveChange: PropTypes.func.isRequired,
  orderBy: PropTypes.object,
  onOrderBy: PropTypes.func.isRequired,
  t: PropTypes.func,
  filter: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15
  },
  itemAction: lookStyles.itemAction,
  itemContainer: lookStyles.itemContainer,
  itemTitle: lookStyles.itemTitle,
  itemSelect: {
    flex: 2
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

export default translate('user')(UsersFilterView);
