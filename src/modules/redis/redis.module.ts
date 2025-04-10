// src/redis/redis.module.ts
import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

const redisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: () => {
    return new Redis({
      host: 'redis-10534.c16.us-east-1-3.ec2.redns.redis-cloud.com',
      port: 10534,
      username: 'default', // nếu có username
      password: 'fOwpm6Mw58DUlGlUd0t1u3qfA5EdiAg9', // nếu có mật khẩu
      db: 0,
      connectTimeout: 100000,
    });
  },
};

@Global() // Đánh dấu là module toàn cục (dùng được ở mọi nơi)
@Module({
  imports: [],
  providers: [redisProvider, RedisService],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
