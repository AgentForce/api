"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../common/index");
const jwt = require('hapi-auth-jwt2');
exports.default = () => {
    return {
        register: (server, options) => {
            const database = options.database;
            const serverConfig = options.serverConfigs;
            const validateUser = (decoded, request, cb) => {
                console.log('object');
                index_1.SlackAlert('test');
                database.userModel
                    .findById(decoded.id).lean(true)
                    .then((user) => {
                    console.log('object');
                    if (!user) {
                        return cb(null, 'false');
                    }
                    return cb(null, 'true');
                });
            };
            return new Promise((resolve) => {
                server.register({
                    register: jwt
                }, (error) => {
                    if (error) {
                        console.log(`Error registering jwt plugin: ${error}`);
                    }
                    else {
                        server.auth.strategy('jwt', 'jwt', false, {
                            key: serverConfig.jwtSecret,
                            validateFunc: validateUser,
                            verifyFunc: (decoded, request, cb) => {
                                console.log('object');
                                index_1.SlackAlert('test');
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
//# sourceMappingURL=index.js.map