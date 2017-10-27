'use strict';

const _ = require('lodash');

/**
 * Middleware to catch unexpected errors in all other middlewares and changes
 * the http statuscode.
 * This middleware should be registered first to catch all errors in other
 * middleware. We can't catch errors occuring in middlewares invoked before
 * this one.
 * @param  {Object}   ctx
 *         Koa context
 * @param  {Function} next
 *         Next middleware function.
 */
module.exports = async function catchExceptions(ctx, next) {
    let catched = false;

    try {
        await next();
    } catch(err) {
        catched = true;
        ctx.body = {
            err: {
                message: err.message,
                code: err.code || 'UNKNOWN_CODE',
                status: err.status || 500
            }
        };
        ctx.logger.error('Middleware threw error:', err);
    } finally {
        if(_.has(ctx, 'body.err')) {
            if(catched === false && !_.isUndefined(ctx.status)){
                ctx.status = 400;
            }

            if(!_.isUndefined(ctx.body.err.status)) {
                ctx.status = ctx.body.err.status;
                delete ctx.body.err.status;
            }
        }
    }
}
