/* eslint-disable require-jsdoc */
const express = require('express');
const mongoose = require('mongoose');
const Youch = require('youch');
const Sentry = require('@sentry/node');
const validate = require('express-validation');
const databaseConfig = require('./config/database');
const sentryConfig = require('./config/sentry');

class App {
  constructor() {
    this.express = express();
    this.isDev = process.env.NODE_ENV !== 'production';

    this.database();
    this.middlewares();
    this.routes();
    this.sentry();
    this.exception();
  }

  sentry() {
    Sentry.init(sentryConfig);
  }

  database() {
    mongoose.connect(
      databaseConfig.uri,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
      },
      console.log('--> DB Connected! <<--')
    );
  }

  middlewares() {
    this.express.use(Sentry.Handlers.requestHandler());

    this.express.use(express.json());
  }

  routes() {
    this.express.use(require('./routes'));
  }

  exception() {
    // use Sentry only if in production
    if (process.env.NODE_ENV === 'production') {
      this.express.use(Sentry.Handlers.errorHandler());
    }

    this.express.use(async (err, req, res, next) => {
      // if it is a validation error
      if (err instanceof validate.ValidationError) {
        return res.status(err.status).json(err);
      }

      if (process.env.NODE_ENV !== 'production') {
        const youch = new Youch(err, req);

        // return res.send(await youch.toHTML()); // HTML display
        return res.json(await youch.toJSON());
      }
      // if it is not a validation error
      return res
        .status(err.status || 500)
        .json({ error: 'Internal Server Error' });
    });
  }
}

module.exports = new App().express;
