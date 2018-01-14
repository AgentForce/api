"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Redis = require("redis");
const config = require("../configurations");
const bluebird = require("bluebird");
bluebird.promisifyAll(Redis.RedisClient.prototype);
bluebird.promisifyAll(Redis.Multi.prototype);
const redis = Redis.createClient(config.getRedisConfigs());
exports.default = redis;
//# sourceMappingURL=redis.js.map