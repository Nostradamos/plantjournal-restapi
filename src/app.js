'use strict';

const Koa = require('koa');
const KoaBodyParser = require('koa-bodyparser');

const parseQueryMiddleware = require('./middleware/parse-query');
const catchExceptionsMiddleware = require('./middleware/catch-exceptions');
const loggerMiddleware = require('./middleware/logger');
const router = require('./router');


module.exports = function(pjInstance, winstonInstance, options) {
    let app = new Koa();

    app.context.logger = winstonInstance;
    app.context.pjInstance = pjInstance;
    app.context.options = options;

    let routerInstance = router(pjInstance, options);

    app
        .use(catchExceptionsMiddleware)
        .use(KoaBodyParser())
        .use(loggerMiddleware.before)
        .use(parseQueryMiddleware)
        .use(routerInstance.routes())
        .use(loggerMiddleware.after);

    return app;
};
