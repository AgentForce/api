// import * as Hapi from "hapi";
// import * as Boom from "boom";
// import * as moment from "moment";
// import { IDatabase } from "../../database";
// import { IServerConfigurations } from "../../configurations";
// import { EventService, IEvent } from '../../services/event.service';
// import * as HTTP_STATUS from 'http-status';
// import { createModel } from './event-validator';
// import { request } from "http";
// export default class EventController {
//     private database: IDatabase;
//     private configs: IServerConfigurations;
//     constructor(configs: IServerConfigurations, database: IDatabase) {
//         this.configs = configs;
//         this.database = database;
//     }
//     public async findByUserId(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
//         try {
//             let userId = request.params.userid;
//             let events: any = await EventService.findbyUserId(userId);
//             if (events == null) {
//                 return reply(events).code(HTTP_STATUS.NOT_FOUND);
//             } else {
//                 return reply(events).code(HTTP_STATUS.OK);
//             }
//         } catch (error) {
//             // log mongo create fail
//             this.database.logModel
//                 .create({
//                     type: 'create',
//                     msg: 'fail',
//                     dataInput: request.payload,
//                     meta: {
//                         error
//                     }
//                 });
//             return reply({
//                 status: 400,
//                 error: error
//             }).code(HTTP_STATUS.BAD_REQUEST);
//         }
//     }
//     public async findById(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
//         try {
//             let idEvent = request.params.id;
//             let events: any = await EventService.findById(idEvent);
//             if (events == null) {
//                 return reply(events).code(HTTP_STATUS.NOT_FOUND);
//             } else {
//                 return reply(events).code(HTTP_STATUS.OK);
//             }
//         } catch (error) {
//             return reply({
//                 status: 400,
//                 error: error
//             }).code(HTTP_STATUS.BAD_REQUEST);
//         }
//     }
//     public async create(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
//         try {
//             let iEvent: IEvent = <IEvent>request.payload;
//             let eventDb: any = await EventService.create(iEvent);
//             // log mongo create success
//             this.database.logEvent
//                 .create({
//                     type: 'create',
//                     msg: 'success',
//                     dataInput: request.payload,
//                     meta: {
//                         data: eventDb.dataValues
//                     }
//                 });
//             reply({
//                 status: HTTP_STATUS.OK,
//                 data: eventDb
//             }).code(HTTP_STATUS.OK);
//         } catch (error) {
//             // log mongo create fail
//             this.database.logModel
//                 .create({
//                     type: 'create',
//                     msg: 'fail',
//                     dataInput: request.payload,
//                     meta: {
//                         error
//                     }
//                 });
//             return reply({
//                 status: 400,
//                 error: error
//             }).code(HTTP_STATUS.BAD_REQUEST);
//         }
//     }
//     public async updateCampaign(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
//     }
// }
//# sourceMappingURL=event-controller.js.map