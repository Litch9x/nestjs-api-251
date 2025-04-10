import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type OrdersDocument = HydratedDocument<Orders>;

@Schema({ timestamps: true })
export class Orders {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Customers',
    required: true,
  })
  customer_id: Types.ObjectId;

  @Prop({ type: Number, required: true })
  totalPrice: number;

  @Prop({
    type: String,
    enum: ['shipping', 'delivered', 'cancelled'],
    default: 'shipping',
  })
  status: string;

  @Prop([
    {
      prd_id: {
        type: MongooseSchema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      price: { type: Number, required: true },
      qty: { type: Number, required: true },
    },
  ])
  items: {
    toObject(): any;
    prd_id: Types.ObjectId;
    price: number;
    qty: number;
  }[];
}

export const OrdersSchema = SchemaFactory.createForClass(Orders);
