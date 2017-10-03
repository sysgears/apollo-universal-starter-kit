import url from 'url';
const { protocol, hostname, port } = url.parse(__BACKEND_URL__);
let serverPort = process.env.PORT || port;
if (__DEV__) {
  serverPort = '3000';
}

export default (SECRET, User, jwt) => async (req, res) => {
  try {
    const { user: { id } } = jwt.verify(req.params.token, SECRET);

    await User.updateActive(id, true);
  } catch (e) {
    res.send('error');
  }

  return res.redirect(`${protocol}//${hostname}:${serverPort}/login`);
};
