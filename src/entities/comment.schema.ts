import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Comments {
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: String, required: true })
  email: string;
  @Prop({ type: String, required: true })
  content: string;
  @Prop({ type: String, ref: 'Product', required: true })
  product_id: Types.ObjectId;
}
export const CommentsSchema = SchemaFactory.createForClass(Comments);
export type CommentsDocument = HydratedDocument<Comments>;
