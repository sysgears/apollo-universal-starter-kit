export default (SECRET: any, User: any, jwt: any) => async (req: any, res: any) => {
  try {
    const token = Buffer.from(req.params.token, 'base64').toString();
    const { user: { id } } = jwt.verify(req.params.token, SECRET);

    await User.updateActive(id, true);
  } catch (e) {
    return res.send('error');
  }

  return res.redirect('/login');
};
