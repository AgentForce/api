import * as Redis from 'redis';
import * as config from '../configurations';
import * as bluebird from 'bluebird';

bluebird.promisifyAll(Redis.RedisClient.prototype);
bluebird.promisifyAll(Redis.Multi.prototype);
const redis = Redis.createClient(config.getRedisConfigs());

export default redis;