// import * as Hapi from "hapi";
// import * as Boom from "boom";
// import * as moment from "moment";
// import { IDatabase } from "../../database";
// import { IServerConfigurations } from "../../configurations";
// import { InviteService, IInvite } from '../../services/invite.service';
// import * as HTTP_STATUS from 'http-status';
// import { createModel } from './invite-validator';
// import { request } from "http";
// import * as _ from 'lodash';
// export default class InviteController {

//     private database: IDatabase;
//     private configs: IServerConfigurations;

//     constructor(configs: IServerConfigurations, database: IDatabase) {
//         this.configs = configs;
//         this.database = database;
//     }

//     public async findByUserId(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
//         try {
//             let userId = request.params.userid;
//             let invites: any = await InviteService.findbyUserId(userId);
//             if (invites == null || _.size(invites) === 0) {
//                 return reply({
//                     status: HTTP_STATUS.NOT_FOUND,
//                     data: invites,
//                     msg: 'not found'
//                 }).code(HTTP_STATUS.NOT_FOUND);
//             } else {
//                 return reply({
//                     status: HTTP_STATUS.OK,
//                     data: invites
//                 }).code(HTTP_STATUS.OK);
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
//             let id = request.params.id;
//             console.log(id);
//             let invite: any = await InviteService.findById(id);
//             if (invite == null) {
//                 return reply({
//                     status: HTTP_STATUS.NOT_FOUND,
//                     data: invite,
//                     msg: 'not found'
//                 }).code(HTTP_STATUS.NOT_FOUND);
//             } else {
//                 return reply({
//                     status: HTTP_STATUS.OK,
//                     data: invite
//                 }).code(HTTP_STATUS.OK);
//             }
//         } catch (error) {
//             return reply({
//                 status: 400,
//                 error: error
//             }).code(HTTP_STATUS.BAD_REQUEST);
//         }
//     }

//     /**
//      * Tạo mới invite
//      * @param request request
//      * @param reply request
//      */
//     public async create(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
//         try {
//             let invite: IInvite = request.payload;
//             let inviteDb: any = await InviteService.create(invite);
//             // log mongo create success
//             this.database.logEvent
//                 .create({
//                     type: 'create',
//                     msg: 'success',
//                     dataInput: request.payload,
//                     meta: {
//                         data: inviteDb.dataValues
//                     }
//                 });
//             reply({
//                 status: HTTP_STATUS.OK,
//                 data: inviteDb
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
