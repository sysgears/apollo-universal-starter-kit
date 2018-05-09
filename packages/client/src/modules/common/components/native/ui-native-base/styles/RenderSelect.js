import { itemContainer, itemAction, itemTitle } from '../../styles';

const RenderSelectStyles = {
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
