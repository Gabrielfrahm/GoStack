import nodemailer from 'nodemailer'; // importa o nodemailer
import { resolve } from 'path';
import exphbs from 'express-handlebars';
import nodemailerExpressHandlebars from 'nodemailer-express-handlebars';
import mailConfig from '../config/mail'; // importa a config do smtp

// cria classe de mail
class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig; // desestruturação das config de email
    // metodo usado no nodemailer
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null, // caso nao seja informado o user do email colocar como null
    });
    this.configureTemplates(); // metodo de configuração do template de email
  }

  // metodo do template do email
  configureTemplates() {
    // variavel achando o caminho onde deve ser lido as config
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');
    // express usando o compile
    this.transporter.use(
      'compile',
      nodemailerExpressHandlebars({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'), // onde esta o layout para os emails
          partialsDir: resolve(viewPath, 'partials'), // arquivos adicionails como footer no email
          defaultLayout: 'default', // layout padrao
          extname: '.hbs', // extenção de arquivo que deve ser lido para os emails
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  // metodo que envia o email
  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
