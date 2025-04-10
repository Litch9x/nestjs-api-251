// tokens.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokensService } from './tokens.service';
import { Tokens, TokensSchema } from 'src/entities/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tokens.name, schema: TokensSchema }]),
  ],
  providers: [TokensService],
  exports: [MongooseModule, TokensService], // Export TokensService để sử dụng ở module khác
})
export class TokensModule {}
