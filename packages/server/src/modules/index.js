import subCategory from './subCategory';
import productType from './productType';
import product from './product';
import category from './category';
import counter from './counter';
import post from './post';
import upload from './upload';
import user from './user';
import subscription from './subscription';
import contact from './contact';
import mailer from './mailer';
import graphqlTypes from './graphqlTypes';
import apolloEngine from './apolloEngine';
import './debug';

import Feature from './connector';

export default new Feature(
  subCategory,
  productType,
  product,
  category,
  counter,
  post,
  upload,
  user,
  subscription,
  contact,
  mailer,
  graphqlTypes,
  apolloEngine
);
