import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { IEmailService } from '../../domain/services/email.service.interface';
import { NodemailerEmailService } from './nodemailer-email.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.MAIL_HOST || 'smtp.gmail.com',
          port: Number(process.env.MAIL_PORT) || 587,
          secure: false, // TLS
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
          },
        },
        defaults: {
          from: process.env.MAIL_FROM || '"Sistema Parqueo SaaS" <noreply@parqueo.com>',
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [
    {
      provide: IEmailService,
      useClass: NodemailerEmailService,
    },
  ],
  exports: [IEmailService],
})
export class EmailModule {}
