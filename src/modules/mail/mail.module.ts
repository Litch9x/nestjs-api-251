import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ConfigService } from '@nestjs/config'; // Import ConfigService

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: '"Shop Online" <tranducchinh20021997@gmail.com>',
        },
        template: {
          // dir: join(__dirname, '..', 'mail', 'transporter'),
          dir: join(__dirname, '..', 'views'),
          adapter: new EjsAdapter(),
          // Using HandlebarsAdapter instead of EjsAdapter
          // adapter: new HandlebarsAdapter(),
          options: {
            strict: false,
            extension: 'ejs', // Chỉ định phần mở rộng là ejs
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
