'use strict';

const Koa = require('koa');
const KoaLogger = require('koa-logger');
const KoaBodyParser = require('koa-bodyparser');

const Router = require('./router');

class plantJournalRestApi {
    constructor(options) {
        this.port = options.port || 8080;

        this.pj = new (require(options.apiConnector))(options.apiConnectorOptions);

        this.koa = new Koa();
        this.router = Router(options, this.pj);

        this.koa
            .use(KoaLogger())
            .use(KoaBodyParser())
            .use(this.router.routes())
            .use(this.router.allowedMethods());
    }

    async connect() {
        return this.pj.connect();
    }

    listen() {
        this.koa.listen(this.port);
        console.log('plantJournalRestApi listening on port', this.port);
    }
}

let restApi = new plantJournalRestApi({
    apiConnector: 'plantjournal-api-sqlite3',
    apiConnectorOptions: ':memory:',
    port: 8080
});

restApi.connect()
    .catch((err) => {
        throw Error(`Couldn't connecto to api`);
    })
    .then(() => {
        console.log('Connected to api');
        restApi.listen();
    });
