import * as Hapi from "hapi";
import * as Boom from "boom";
import * as moment from "moment";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import { MetatypeService } from '../../services/metatype.service';
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
            let rows: any = await MetatypeService.findByType(_.lowerCase(type));
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



}
