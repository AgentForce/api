import { IPlugin, IPluginOptions } from "../interfaces";
import * as Hapi from "hapi";
import { IUser, UserModel } from "../../controller/users/user";
import * as Boom from "boom";
import { SlackAlert } from "../../common/index";
const jwt = require('hapi-auth-jwt2');
export default (): IPlugin => {
    return {
        register: (server: Hapi.Server, options: IPluginOptions): Promise<void> => {
            const database = options.database;
            const serverConfig = options.serverConfigs;

            const validateUser = (decoded, request, cb) => {
                console.log('object');
                SlackAlert('test');
                database.userModel
                    .findById(decoded.id).lean(true)
                    .then((user: IUser) => {
                        console.log('object');
                        if (!user) {
                            return cb(null, 'false');
                        }

                        return cb(null, 'true');
                    });
            };


            return new Promise<void>((resolve) => {
                server.register({
                    register: jwt
                }, (error) => {
                    if (error) {
                        console.log(`Error registering jwt plugin: ${error}`);
                    } else {
                        server.auth.strategy('jwt', 'jwt', false, {
                            key: serverConfig.jwtSecret,
                            validateFunc: validateUser,
                            verifyFunc: (decoded, request, cb) => {
                                console.log('object');
                                SlackAlert('test');
                                return cb(null, false);
                            },
                            verifyOptions: { algorithms: ['HS256'] }
                        });
                    }

                    resolve();
                });
            });
        },
        info: () => {
            return {
                name: "JWT Authentication",
                version: "1.0.0"
            };
        }
    };
};


