import * as Hapi from "hapi";
const checkToken = (request: Hapi.Request, reply: Hapi.ReplyNoContinue) => {
    if (request.headers.authorization === '#manulife$manulife') {
        reply('fail roi');
    }
        reply('fail roi');
};
const refreshToken = (token) => {
    return true;
};

export { checkToken, refreshToken };