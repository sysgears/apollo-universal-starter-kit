import _ = require("lodash");
import * as bcrypt from "bcryptjs";

import FieldError from "../../../common/FieldError";

const jwt = require("jsonwebtoken");

export const createTokens = async (user: any, secret: any, refreshSecret: any) => {
  const createToken = jwt.sign(
    { user: _.pick(user, ["id", "username", "isAdmin"]) },
    secret,
    { expiresIn: "1m" }
  );

  const createRefreshToken = jwt.sign(
    {
      user: user.id
    },
    refreshSecret,
    {
      expiresIn: "7d"
    }
  );

  return Promise.all([createToken, createRefreshToken]);
};

export const refreshTokens = async (token: any, refreshToken: any, User: any, SECRET: any) => {
  let userId = -1;
  try {
    const { user } = jwt.decode(refreshToken);
    userId = user;
  } catch (err) {
    console.log(err);
    return {};
  }

  const user = await User.getUserWithPassword(userId);
  if (!user) {
    return {};
  }
  const refreshSecret = SECRET + user.password;

  try {
    jwt.verify(refreshToken, refreshSecret);
  } catch (err) {
    return {};
  }

  const [newToken, newRefreshToken] = await createTokens(
    user,
    SECRET,
    refreshSecret
  );

  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user: _.pick(user, ["id", "username", "isAdmin"])
  };
};

export const tryLogin = async (email: string, password: string, User: any, SECRET: any) => {
  const e = new FieldError();
  const localAuth = await User.getLocalOuthByEmail(email);

  if (!localAuth) {
    // user with provided email not found
    e.setError("email", "Please enter a valid e-mail.");
  }

  const valid = await bcrypt.compare(password, localAuth.password);
  if (!valid) {
    // bad password
    e.setError("password", "Please enter a valid password.");
  }

  e.throwIf();

  const user = await User.getUserWithPassword(localAuth.userId);
  const refreshSecret = SECRET + user.password;

  const [token, refreshToken] = await createTokens(user, SECRET, refreshSecret);

  return {
    token,
    refreshToken
  };
};
