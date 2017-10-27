'use strict';

const KoaRouter = require('koa-router');
const _ = require('lodash');

const Models = [
    'Family', 'Generation', 'Genotype', 'Plant', 'Journal', 'Medium',
    'Environment'];

module.exports = function (pjInstance, options) {
    let router = KoaRouter();

    for(let model of Models) {
        let lowerModel = _.lowerCase(model);
        let path = '/' + lowerModel;
        let pathId = path + '/:id';
        let attrModelId = lowerModel + 'Id';
        let pjModel = pjInstance[model];

        router
            // FIND
            .get(path, async (ctx, next) => {
                let criteria = ctx.queryJSON;
                ctx.body = await pjModel.find(criteria);
            })
            // FIND ONE
            .get(pathId, async (ctx, next) => {
                let criteria = ctx.queryJSON;
                makeCriteriaFindOne(criteria, attrModelId, ctx.params.id);
                ctx.body = await pjModel.find(criteria);
            })
            // CREATE
            .post(path, async (ctx, next) => {
                let options = ctx.request.body;
                ctx.body = await pjModel.create(options);
            })
            // UPDATE
            .put(path, async (ctx, next) => {
                let criteria = ctx.queryJSON;
                let update = ctx.request.body;
                ctx.body = await pjModel.update(update, criteria);
            })
            // UPDATE ONE
            .put(pathId, async (ctx, next) => {
                let criteria = {};
                makeCriteriaFindOne(criteria, attrModelId, ctx.params.id);
                let update = ctx.request.body;
                ctx.body = await pjModel.update(update, criteria);
            })
            // DELETE
            .del(path, async (ctx, next) => {
                let criteria = ctx.queryJSON;
                ctx.body = await pjModel.delete(criteria);
            })
            // DELETE ONE
            .del(pathId, async (ctx, next) => {
                let criteria = {};
                makeCriteriaFindOne(criteria, attrModelId, ctx.params.id);
                ctx.body = await pjModel.delete(criteria);
            });

    }

    router
        .get('/', function (ctx, next) {
            ctx.body = 'Hello World!';
        })
        .get('/version', function(ctx, next) {
            ctx.body = {
                apiConnector: options.apiConnector,
                apiConnectorVersion: pjInstance.version
            };
        });

    return router;
};

/**
 * Make a criteria object to only find one specific record.
 * @param  {Object} criteria
 *         Criteria object which will get passed to plantjournal api connector
 * @param  {String} attr
 *         Attribute through wich record should get found. NOTE: this should
 *         be a attribute with unique values, normally this should be an
 *         ID attribute.
 * @param  {Integer|String} value
 *         Value for attribute
 */
function makeCriteriaFindOne(criteria, attr, value) {
    criteria.where = {[attr]: value};
    criteria.limit = 1;
    criteria.offset = 0;
}
