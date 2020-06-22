import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { appointment } = data;
    console.log('A fila execultou');
    await Mail.sendMail({
      to: `${appointment.provider.name}<${appointment.provider.email}>`, // quem  para quem vamos mandar o email, no caso o provider
      subject: 'Agendamento cancelado', // titulo
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(parseISO(appointment.date), "dd 'de' MMMM', às' H:mm'h'", {
          locale: pt, // linguagem em pt
        }),
      },
    });
  }
}

export default new CancellationMail();
