import express from 'express';
import path from 'path';
import { invert, isArray } from 'lodash';
import url from 'url';

import cookiesMiddleware from 'universal-cookie-express';
import cors from 'cors';
import bodyParser from 'body-parser';

// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies, import/extensions
import queryMap from 'persisted_queries.json';

import ssrMiddleware from './server-side-render';
import graphiqlMiddleware from './graphiql';
import graphqlMiddleware from './graphql';
import errorMiddleware from './error';

import { options as spinConfig } from '../../../.spinrc.json';
import modules from '../modules';

const { pathname } = url.parse(__BACKEND_URL__);

const ApplyMiddleware = app => {
  /* Apply any 'before' middlewares from the modules */
  // TODO is ordering important here?
  for (const applyBeforeware of modules.beforewares) {
    applyBeforeware(app);
  }

  // Cookies mmm...
  app.use(cookiesMiddleware());

  // Setup CORS
  const corsOptions = {
    credentials: true
  };
  app.use(cors(corsOptions));

  // Setup 'bodyParser' lib
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Setup static dirs middleware
  app.use(
    '/',
    express.static(path.join(spinConfig.frontendBuildDir, 'web'), {
      maxAge: '180 days'
    })
  );

  if (__DEV__) {
    app.use('/', express.static(spinConfig.dllBuildDir, { maxAge: '180 days' }));
  }

  // setup persisted queries middleware
  if (__PERSIST_GQL__) {
    const invertedMap = invert(queryMap);

    app.use(pathname, (req, resp, next) => {
      if (isArray(req.body)) {
        req.body = req.body.map(body => {
          return {
            query: invertedMap[body.id],
            ...body
          };
        });
        next();
      } else {
        if (!__DEV__ || (req.get('Referer') || '').indexOf('/graphiql') < 0) {
          resp.status(500).send('Unknown GraphQL query has been received, rejecting...');
        } else {
          next();
        }
      }
    });
  }

  // module middlewares
  for (const applyMiddleware of modules.middlewares) {
    applyMiddleware(app);
  }

  // some static dir while developing?
  if (__DEV__) {
    app.use('/servdir', (req, res) => {
      res.send(process.cwd() + path.sep);
    });
  }

  // graphql middleware
  app.use(pathname, (...args) => graphqlMiddleware(...args));
  app.use('/graphiql', (...args) => graphiqlMiddleware(...args));

  // server-side-rendering on first load
  app.use((...args) => ssrMiddleware(queryMap)(...args));

  // render server error in client ?
  if (__DEV__) {
    app.use(errorMiddleware);
  }
};

export default {
  ApplyMiddleware
};
