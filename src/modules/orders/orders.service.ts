import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, ObjectId, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Orders, OrdersDocument } from 'src/entities/order.schema';
import { Products, ProductsDocument } from 'src/entities/product.schema';
import { MailService } from '../mail/mail.service';
import { PaginationResult } from 'src/utils/pagination-result.interface';
import { paginate } from 'src/utils/paginate.util';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Orders.name) private orderModel: Model<Orders>,
    @InjectModel(Products.name) private productModel: Model<ProductsDocument>,
    private readonly mailService: MailService,
  ) {}
  async orderList(
    limit: string,
    page: string,
    customer_id: string,
  ): Promise<PaginationResult<Orders>> {
    return await paginate(this.orderModel, {
      page: Number(page) || 1,
      limit: Number(limit) || 8,
      filter: { customer_id: new Types.ObjectId(customer_id) }, // có thể thêm filter nếu cần
      sort: { createdAt: -1 },
    });
  }

  async order(
    customer_id: string,
    totalPrice: number,
    items: { qty: number; prd_id: ObjectId; price: number }[],
    fullName: string,
    email: string,
    phone: string,
    address: string,
  ): Promise<{
    data: Orders;
  }> {
    // Lưu đơn hàng vào DB
    const order = new this.orderModel({
      customer_id: new Types.ObjectId(customer_id),
      totalPrice,
      items,
    });
    const newOrder = await order.save();
    // Cập nhật thêm tên sản phẩm vào items
    const productIds = items.map((item: { prd_id: ObjectId }) => item.prd_id); // Lấy danh sách prd_id từ đơn hàng
    // console.log(productIds);
    const products = await this.productModel.find({
      _id: { $in: productIds },
    });
    // Thêm tên sản phẩm vào đối tượng items
    const updatedItems = items.map((item) => {
      const product = products.find((p) => p.id == item.prd_id);
      return {
        ...item,
        name: product ? product.name : 'Không có tên sản phẩm', // Nếu không tìm thấy sản phẩm, hiển thị tên mặc định
        price: product ? product.price : 0,
      };
    });
    // Gửi email xác nhận
    await this.mailService.sendOrderConfirmation(
      totalPrice,
      updatedItems,
      fullName,
      email,
      phone,
      address,
    );
    return { data: newOrder };
  }

  async orderCancelled(id: string): Promise<{ data: Orders }> {
    const order_id = new Types.ObjectId(id);

    const cancelOrder = await this.orderModel.findByIdAndUpdate(
      order_id,
      { status: 'cancelled' },
      { new: true }, // Trả về document đã cập nhật
    );

    if (!cancelOrder) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với ID: ${id}`);
    }

    return { data: cancelOrder };
  }

  async orderDetail(id: string): Promise<{ data: Orders }> {
    const order_id = new Types.ObjectId(id);

    const order = await this.orderModel.findById(order_id).exec();
    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với ID: ${id}`);
    }
    // Cập nhật thêm tên sản phẩm vào items
    const { items } = order;
    const productIds = items.map((item) => item.prd_id); // Lấy danh sách prd_id từ đơn hàng
    // console.log(productIds);
    const products = await this.productModel.find({
      _id: { $in: productIds },
    });
    // Thêm tên sản phẩm vào đối tượng items
    const updatedItems = items.map((item) => {
      const product = products.find((p) => p.id == item.prd_id);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return {
        ...item.toObject(),
        name: product ? product.name : 'Không có tên sản phẩm',
        image: product ? product.image : 'Không có ảnh sản phẩm',
        price: product ? product.price : 0,
      };
    });

    const updatedOrder = order.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    updatedOrder.items = updatedItems;

    return { data: updatedOrder };
  }
}
