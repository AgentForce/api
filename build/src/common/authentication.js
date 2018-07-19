"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkToken = (request, reply) => {
    if (request.headers.authorization === '#manulife$manulife') {
        reply('fail roi');
    }
    reply('fail roi');
};
exports.checkToken = checkToken;
const refreshToken = (token) => {
    return true;
};
exports.refreshToken = refreshToken;
//# sourceMappingURL=authentication.js.map