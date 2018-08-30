import defaultRouter from './defaultRouter';
import i18n from './i18n';
import counter from './counter';
import post from './post';
import upload from './upload';
import user from './user';
import payments from './payments';
import contact from './contact';
import pageNotFound from './pageNotFound';
import pagination from './pagination';
import './favicon';

import Feature from './connector';

export default new Feature(
  defaultRouter,
  counter,
  post,
  upload,
  user,
  payments,
  contact,
  pagination,
  pageNotFound,
  i18n
);
