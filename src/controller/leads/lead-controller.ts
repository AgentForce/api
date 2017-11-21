import * as Hapi from "hapi";
import * as Boom from "boom";
import * as moment from "moment";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import { LeadService, ILead } from '../../services/lead.service';
import * as HTTP_STATUS from 'http-status';
import { createLeadModel } from './lead-validator';
export default class LeadController {

    private database: IDatabase;
    private configs: IServerConfigurations;
    constructor(configs: IServerConfigurations, database: IDatabase) {
        this.configs = configs;
        this.database = database;
    }

    public async findById(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let idEvent = request.params.id;
            let events: any = await LeadService.findById(idEvent);
            if (events == null) {
                return reply(events).code(HTTP_STATUS.NOT_FOUND);
            } else {
                return reply(events).code(HTTP_STATUS.OK);
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
            let iLead = request.payload as ILead;
            let lead: any = await LeadService.create(iLead)
                .catch(ex => {
                    throw ex;
                });
            // log mongo create success
            this.database.logLead
                .create({
                    type: 'create',
                    msg: 'success',
                    dataInput: request.payload,
                    meta: {
                        lead: lead.dataValues
                    }
                });
            reply({
                status: HTTP_STATUS.OK,
                data: lead
            }).code(HTTP_STATUS.OK);
        } catch (error) {
            // log mongo create fail
            this.database.logLead
                .create({
                    type: 'create',
                    msg: 'fail',
                    dataInput: request.payload,
                    meta: {
                        error
                    }
                });
            return reply({
                status: 400,
                error: error
            }).code(HTTP_STATUS.BAD_REQUEST);
        }
    }


}
