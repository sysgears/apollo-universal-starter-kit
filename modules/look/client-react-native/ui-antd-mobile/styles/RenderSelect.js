import { itemAction, itemTitle } from '../../styles';

const RenderSelectStyles = {
  itemContainer: {
    paddingLeft: 15,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemTitle,
  itemAction: {
    ...itemAction,
    flex: 2,
    alignItems: 'flex-end'
  }
};

export default RenderSelectStyles;
