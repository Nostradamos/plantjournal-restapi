'use strict';

const _ = require('lodash');

const pjError = require('../pj-error');

module.exports = async function (ctx, next) {
    let queryJSON = {};
    for(let key of _.keys(ctx.request.query)) {
        try {
            queryJSON[key] = JSON.parse(ctx.request.query[key]);
        } catch (err) {
            throw new pjError(400, 'QUERY_ARG_NOT_JSON', 'Query key ' + key + ' is not valid JSON');
        }
    }
    ctx.queryJSON = queryJSON;
    return next();
};
