import * as Hapi from "hapi";
import * as Boom from "boom";
import * as moment from "moment";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import { MetatypeService, IMetatype } from '../../services/metatype.service';
import * as HTTP_STATUS from 'http-status';
import { createModel } from './metatype-validator';
import { request } from "http";
import * as _ from 'lodash';
export default class MetatypeController {

    private database: IDatabase;
    private configs: IServerConfigurations;

    constructor(configs: IServerConfigurations, database: IDatabase) {
        this.configs = configs;
        this.database = database;
    }

    public async findByType(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let type = request.params.type;
            let rows: any = await MetatypeService.findByType(_.toLower(type));
            if (rows == null || _.size(rows) === 0) {
                return reply({
                    status: HTTP_STATUS.NOT_FOUND,
                    data: rows
                }).code(HTTP_STATUS.NOT_FOUND);
            } else {
                return reply({
                    status: HTTP_STATUS.OK,
                    data: rows
                }).code(HTTP_STATUS.OK);
            }
        } catch (error) {
            return reply({
                status: 400,
                error: error
            }).code(HTTP_STATUS.BAD_REQUEST);
        }
    }


    public async create(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let type = request.payload as IMetatype;
            let typeDb: any = await MetatypeService.create(type)
                .catch(ex => {
                    throw ex;
                });
            // log mongo create success
            reply({
                status: HTTP_STATUS.OK,
                data: typeDb
            }).code(HTTP_STATUS.OK);
        } catch (ex) {
            let res = {};
            if (ex.code) {
                res = {
                    status: 400,
                    error: ex
                };
            } else {
                res = {
                    status: 400,
                    error: { code: 'ex', msg: 'Create type has errors' }
                };
            }
            reply(res).code(HTTP_STATUS.BAD_REQUEST);
        }
    }



}
