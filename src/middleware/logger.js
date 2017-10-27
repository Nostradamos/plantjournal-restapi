'use strict';

exports.before = async function(ctx, next) {
    ctx.logger.info(ctx.method, ctx.url);
    return next();
}

exports.after = async function(ctx, next) {
    return next();
}
