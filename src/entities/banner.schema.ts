import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Banners {
  @Prop({ type: String, required: true })
  image: string;
}

export const BannersSchema = SchemaFactory.createForClass(Banners);
export type BannersDocument = HydratedDocument<Banners>;
