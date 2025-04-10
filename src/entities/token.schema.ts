import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TokensDocument = HydratedDocument<Tokens>;

@Schema({ timestamps: true })
export class Tokens {
  @Prop({ type: Types.ObjectId, ref: 'Customers', required: true })
  customer_id: Types.ObjectId;

  @Prop({ required: true })
  accessToken: string;

  @Prop({ required: true })
  refreshToken: string;
}

export const TokensSchema = SchemaFactory.createForClass(Tokens);
