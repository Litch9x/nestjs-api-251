import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Products {
  @Prop({ type: Types.ObjectId, ref: 'Categories', required: true })
  category_id: Types.ObjectId;

  @Prop({ type: String, required: true, text: true })
  name: string;

  @Prop({ type: String, required: true })
  image: string;

  @Prop({ type: Number, default: 0 })
  price: number;

  @Prop({ type: String, required: true })
  status: string;

  @Prop({ type: String, required: true })
  accessories: string;

  @Prop({ type: String, required: true })
  promotion: string;

  @Prop({ type: String, required: true })
  details: string;

  @Prop({ type: Boolean, default: true })
  is_stock: boolean;

  @Prop({ type: Boolean, default: false })
  is_featured: boolean;
}

export const ProductsSchema = SchemaFactory.createForClass(Products);
export type ProductsDocument = HydratedDocument<Products>;
