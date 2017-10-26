export default (SECRET: any, User: any, jwt: any) => async (req: any, res: any) => {
  try {
    const { user: { id } } = jwt.verify(req.params.token, SECRET);

    await User.updateActive(id, true);
  } catch (e) {
    res.send('error');
  }

  return res.redirect('/login');
};
