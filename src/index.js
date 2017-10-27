'use strict';

const Koa = require('koa');
const KoaMount = require('koa-mount');
const winston = require('winston');

const app = require('./app');

class plantJournalRestApi {
    constructor(options) {
        this.options = options;
        this.port = this.options.port || 8080;
        this.apiPath = this.options.apiPath || '/api';

        this.initWinston();
        this.initPj();

        this.koa = new Koa();
        this.koa.use(
            KoaMount(
                this.apiPath,
                app(this.pjInstance, this.logger, this.options)
            ));

        // Workaround for https://github.com/koajs/mount/issues/64
        this.koa.context.logger = this.logger;
    }

    initWinston() {
        this.logger = new (winston.Logger)({
            transports: [
                new (winston.transports.Console)(),
                new (winston.transports.File)({ filename: 'plantjournal-restapi.log' })
            ],
            level: 'silly',
        });
    }

    initPj() {
        this.pjModule = require(this.options.apiConnector);
        this.pjInstance = new this.pjModule(
            this.options.apiConnectorOptions);
    }

    async listen() {
        try {
            await this.pjInstance.connect();
        }catch(err) {
            this.logger.error(`Couldn't connect to api. Error:`, err);
        }
        this.koa.listen(this.port);
        this.logger.info('plantJournalRestApi listening on port', this.port);
        this.logger.info('Access api via http://localhost:' + this.port + this.apiPath);

    }
}

let restApi = new plantJournalRestApi({
    apiConnector: 'plantjournal-api-sqlite3',
    apiConnectorOptions: ':memory:',
    port: 8080
});

restApi.listen();
