'use strict';

const KoaRouter = require('koa-router');
const _ = require('lodash');

function Router(options, pj) {
    const apiConnector = require(options.apiConnector);

    let router = KoaRouter();

    addRoutes(router, options, pj);

    return router;
}

function addRoutes(router, options, pj) {
    let Models = [
        'Family', 'Generation', 'Genotype', 'Plant', 'Journal', 'Medium',
        'Environment'];


    for(let model of Models) {
        let lowerModel = _.lowerCase(model);
        let path = '/' + lowerModel;
        let pathId = path + '/:id';
        let attrModelId = lowerModel + 'Id';
        let pjModel = pj[model];

        router
            // FIND
            .get(path, Wrapper(async (ctx, next) => {
                let criteria = ctx.queryJSON;
                ctx.body = await pjModel.find(criteria);
            }))
            // FIND ONE
            .get(pathId, Wrapper(async (ctx, next) => {
                let criteria = ctx.queryJSON;
                applyWhereAttrId(criteria, attrModelId, ctx.params.id);
                ctx.body = await pjModel.find(criteria);
            }))
            // CREATE
            .post(path, Wrapper(async (ctx, next) => {
                let options = ctx.request.body;
                ctx.body = await pjModel.create(options);
            }))
            // UPDATE
            .put(path, Wrapper(async (ctx, next) => {
                let criteria = ctx.queryJSON;
                let update = ctx.request.body;
                ctx.body = await pjModel.update(update, criteria);
            }))
            // UPDATE ONE
            .put(pathId, Wrapper(async (ctx, next) => {
                let criteria = {};
                applyWhereAttrId(criteria, attrModelId, ctx.params.id);
                let update = ctx.request.body;
                ctx.body = await pjModel.update(update, criteria);
            }))
            // DELETE
            .del(path, Wrapper(async (ctx, next) => {
                let criteria = ctx.queryJSON;
                ctx.body = await pjModel.delete(criteria);
            }))
            // DELETE ONE
            .del(pathId, Wrapper(async (ctx, next) => {
                let criteria = {};
                applyWhereAttrId(criteria, attrModelId, ctx.params.id);
                ctx.body = await pjModel.delete(criteria);
            }));

    }

    router
        .get('/', function (ctx, next) {
            ctx.body = 'Hello World!';
        })
        .get('/version', function(ctx, next) {
            ctx.body = {
                apiConnector: options.apiConnector,
                apiConnectorVersion: pj.version
            };
        })
}

function Wrapper(func) {
    return async function(ctx, next) {
        console.log(JSON.stringify(ctx));
        console.log(ctx.request.query);

        ctx.type = 'application/json';
        ctx.queryJSON = queryToJSON(ctx.request.query);
        try {
            await func(ctx, next);
        } catch(err) {
            console.error(err.message);
            ctx.body = {err: err.message};
        }
    }
}

function queryToJSON(query) {
    // ToDo: Instead of iterating over all keys, only pick keys our api
    // understands
    let queryJSON = {};
    for(let key of _.keys(query)) {
        queryJSON[key] = JSON.parse(query[key]);
    }
    return queryJSON;
}

function applyWhereAttrId(queryJSON, attrModelId, paramId) {
    queryJSON['where'] = {[attrModelId]: paramId};
    queryJSON['limit'] = 1;
    queryJSON['offset'] = 0;
}

module.exports = Router;
