import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CustomersDocument = HydratedDocument<Customers>;

@Schema({ timestamps: true })
export class Customers {
  @Prop({ type: String, required: false })
  fullName: string;

  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, unique: true, required: false })
  phone: string;

  @Prop({ type: String, required: false })
  address: string;

  @Prop({ type: Types.ObjectId, required: false })
  _id: Types.ObjectId;
}

export const CustomersSchema = SchemaFactory.createForClass(Customers);
