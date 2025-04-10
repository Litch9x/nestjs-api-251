import { MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

// Cấu hình kết nối MongoDB
export const mongooseConfig = (
  configService: ConfigService,
): MongooseModuleOptions => ({
  uri:
    configService.get<string>('MONGO_URI') || 'mongodb+srv://chinhtd:CTM3tVc3Whn1jqPG@cluster0.fm1hx.mongodb.net/node-api-251?retryWrites=true&w=majority&appName=Cluster0', // Fallback URI
});
