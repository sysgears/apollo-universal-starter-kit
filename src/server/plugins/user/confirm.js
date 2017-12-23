export default (SECRET, User, jwt) => async (req, res) => {
  try {
    const token = Buffer.from(req.params.token, 'base64').toString();
    const { user: { id } } = jwt.verify(token, SECRET);

    await User.updateActive(id, true);
  } catch (e) {
    return res.send('error');
  }

  return res.redirect('/login');
};
