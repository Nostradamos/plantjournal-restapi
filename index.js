'use strict';

const Koa = require('koa');
const App = require('./app');

class plantJournalRestApi {
    constructor(options) {
        this.port = options.port || 8080

        this.koa = new Koa();
        this.app = new App(options);
        koa.use(app);

    }

    listen() {
        console.log(this.app);
        this.koa.listen(this.port);
        console.log('plantJournalRestApi listening on port', this.port);
    }
}

let restApi = new plantJournalRestApi({
    apiConnector: 'plantjournal-api-sqlite3',
    port: 8080
});

restApi.listen();
