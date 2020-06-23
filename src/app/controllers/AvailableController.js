import {
  startOfDay, // inicio do dia
  endOfDay, // fim do dia
  setHours, // setar horas
  setMinutes, // setar minutos
  setSeconds, // setar segundos
  format, // formatar hora
  isAfter, // depois de certa hora
} from 'date-fns';
import { Op } from 'sequelize'; // operador do sequelize
import Appointment from '../models/Appointment'; // model de appointments

class AvailableController {
  // metodo para listar
  async index(req, res) {
    // recebe a data por query da rota
    const { date } = req.query;
    // verifica se a data  foi recebida
    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    // variavel contendo a data atual
    const searchDate = Number(date);
    // procura no banco todos os appointments do dia
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: { [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)] }, // entre 00:00  ate 23:59
      },
    });
    // todos os horarios disponiveis
    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
    ];
    // verifica se o horario esta disponivel e se ja nao passou sua hora
    const available = schedule.map((time) => {
      const [hour, minute] = time.split(':'); // tranforma o array em variaveis onde antes dos pontos é hora e depois minutos
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute), // valor de cada hora, zerando os segundos
        0
      );
      return {
        time, // retorna a hora
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"), // retorna o formato da data ex("2020-06-23T14:00:00-03:00")
        available:
          isAfter(value, new Date()) && // avalia se o horario vem depois da hora atual, caso contrario fica false
          !appointments.find((a) => format(a.date, 'HH:mm') === time), // caso ache um appoint nesse valor de data tbm retorna false
      };
    });
    // retorna os horarios
    return res.json(available);
  }
}
export default new AvailableController();
