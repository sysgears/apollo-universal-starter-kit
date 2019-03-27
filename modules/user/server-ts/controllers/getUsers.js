import User from '../sql';

const getUsersController = async ({ query: { column, order, searchText = '', role = '', isActive = null } }, res) => {
  const orderBy = { column, order };
  const filter = { searchText, role, isActive };
  const user = await User.getUsers(orderBy, filter);

  res.json(user);
};

export default getUsersController;
