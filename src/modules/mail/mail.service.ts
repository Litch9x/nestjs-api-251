import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';
import { ObjectId } from 'mongoose';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendOrderConfirmation(
    totalPrice: number,
    updatedItems: { qty: number; prd_id: ObjectId; price: number }[],
    fullName: string,
    email: string,
    phone: string,
    address: string,
  ) {
    const formattedPrice = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(totalPrice);
    await this.mailerService.sendMail({
      to: email,
      subject: 'Xác nhận đơn hàng',
      template: join(__dirname, '../..', 'views', 'order-confirmation.ejs'),
      context: {
        fullName: fullName,
        phone: phone,
        address: address,
        totalPrice: formattedPrice,
        items: updatedItems,
      },
    });
  }
}
