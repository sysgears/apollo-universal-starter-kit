import { itemContainer, itemAction, itemTitle } from '../../styles';

const RenderSelectStyles = {
  androidPickerWrapper: {
    flex: 1
  },
  container: {
    paddingLeft: 15
  },
  itemContainer,
  itemTitle,
  itemAction: {
    ...itemAction,
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-end'
  }
};

export default RenderSelectStyles;
