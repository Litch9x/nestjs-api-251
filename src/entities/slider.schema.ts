import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Sliders {
  @Prop({ type: String, required: true })
  image: string;
}

export const SlidersSchema = SchemaFactory.createForClass(Sliders);
export type SlidersDocument = HydratedDocument<Sliders>;
