import redis from 'redis';
const redisClient = redis.createClient();
await redisClient.connect();
export default redisClient;