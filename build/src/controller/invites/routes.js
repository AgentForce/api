// import * as Hapi from "hapi";
// import * as Joi from "joi";
// import EventController from "./invite-controller";
// import * as InviteValidator from "./invite-validator";
// import { jwtValidator } from "../users/user-validator";
// import { IDatabase } from "../../database";
// import { IServerConfigurations } from "../../configurations";
// export default function (server: Hapi.Server, configs: IServerConfigurations, database: IDatabase) {
//     const eventController = new EventController(configs, database);
//     server.bind(eventController);
//     server.route({
//         method: 'GET',
//         path: '/invites/userid/{userid}',
//         config: {
//             handler: eventController.findByUserId,
//             // auth: "jwt",
//             tags: ['api', 'invites'],
//             description: 'Get invites by userid',
//             validate: {
//                 params: {
//                     userid: Joi.string().required()
//                 },
//                 // headers: jwtValidator
//             },
//             plugins: {
//                 'hapi-swagger': {
//                     responses: {
//                         '200': {
//                             'description': 'event founded.'
//                         },
//                         '404': {
//                             'description': 'events not found.'
//                         }
//                     }
//                 }
//             }
//         }
//     });
//     server.route({
//         method: 'GET',
//         path: '/invites/{id}',
//         config: {
//             handler: eventController.findById,
//             // auth: "jwt",
//             tags: ['api', 'invites'],
//             description: 'Get invites by id',
//             validate: {
//                 params: {
//                     id: Joi.string().required()
//                 },
//                 // headers: jwtValidator
//             },
//             plugins: {
//                 'hapi-swagger': {
//                     responses: {
//                         '200': {
//                             'description': 'invite founded.'
//                         },
//                         '404': {
//                             'description': 'invite not found.'
//                         }
//                     }
//                 }
//             }
//         }
//     });
//     server.route({
//         method: 'POST',
//         path: '/invites',
//         config: {
//             handler: eventController.create,
//             // auth: "jwt",
//             tags: ['api', 'invites'],
//             description: 'Create a invite',
//             validate: {
//                 payload: InviteValidator.createModel,
//                 // headers: jwtValidator
//             },
//             plugins: {
//                 'hapi-swagger': {
//                     responses: {
//                         '201': {
//                             'description': 'Created invite'
//                         }
//                     }
//                 }
//             }
//         }
//     });
// } 
//# sourceMappingURL=routes.js.map