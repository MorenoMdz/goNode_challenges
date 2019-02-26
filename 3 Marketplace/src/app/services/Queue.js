const kue = require('kue');
const Sentry = require('@sentry/node');
const redisConfig = require('../../config/redis');

const jobs = require('../jobs');

const Queue = kue.createQueue({ redis: redisConfig });

// process all the jobs that have the said key and handle
Queue.process(jobs.PurchaseMail.key, jobs.PurchaseMail.handle);

Queue.on('error', Sentry.captureException);

module.exports = Queue;
