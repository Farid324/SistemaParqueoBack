export interface SendEmailOptions {
  to: string;
  subject: string;
  template?: string;
  context?: Record<string, any>;
  html?: string;
  text?: string;
}

export interface IEmailService {
  sendEmail(options: SendEmailOptions): Promise<boolean>;
}

export const IEmailService = Symbol('IEmailService');
