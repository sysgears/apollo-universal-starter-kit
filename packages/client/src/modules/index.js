import category from './category';
import productType from './productType';
import product from './product';
import defaultRouter from './defaultRouter';
import i18n from './i18n';
import counter from './counter';
import post from './post';
import upload from './upload';
import user from './user';
import subscription from './subscription';
import contact from './contact';
import pageNotFound from './pageNotFound';
import './favicon';

import Feature from './connector';

export default new Feature(
  category,
  productType,
  product,
  defaultRouter,
  counter,
  post,
  upload,
  user,
  subscription,
  contact,
  pageNotFound,
  i18n
);
