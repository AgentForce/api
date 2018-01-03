"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Slack = require("slack-node");
const apiToken = 'xoxb-34408154039-wKjRLaQaWQHAa9chC2gHMOqd';
const slack = new Slack(apiToken);
// slack.api("users.list", function (err, response) {
//     console.log(response);
// });
const SlackAlert = (text) => {
    slack.api('chat.postMessage', {
        as_user: 'oggy',
        text: text,
        channel: '#apimanulife'
    }, (err, response) => {
    });
};
exports.SlackAlert = SlackAlert;
//# sourceMappingURL=slack.js.map