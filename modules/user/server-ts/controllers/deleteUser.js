import User from '../sql';

const deleteUserController = async ({ body: { id } }, res) => {
  const isAdmin = () => true;
  const isSelf = () => false;

  const user = await User.getUser(id);
  if (!user) {
    throw new Error('userIsNotExisted');
  }

  if (isSelf()) {
    throw new Error('userCannotDeleteYourself');
  }

  const isDeleted = !isSelf() && isAdmin() ? await User.deleteUser(id) : false;

  if (isDeleted) {
    res.json(user);
  } else {
    throw new Error('userCouldNotDeleted');
  }
};

export default deleteUserController;
