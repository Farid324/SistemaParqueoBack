import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IEmailService, SendEmailOptions } from '../../domain/services/email.service.interface';

@Injectable()
export class NodemailerEmailService implements IEmailService {
  private readonly logger = new Logger(NodemailerEmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(options: SendEmailOptions): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: options.to,
        subject: options.subject,
        template: options.template,
        context: options.context,
        html: options.html,
        text: options.text,
      });
      this.logger.log(`Correo enviado exitosamente a: ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Error al enviar correo a ${options.to}:`, error);
      return false;
    }
  }
}
