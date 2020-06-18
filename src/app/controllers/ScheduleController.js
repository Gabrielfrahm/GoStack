import { startOfDay, endOfDay, parseISO } from 'date-fns'; // importando os metodos pra verificar o inicio e o fim do dia
import { Op } from 'sequelize'; // operador do sequelize BETWEEM
import Appointment from '../models/Appointment'; // model de Appointment
import User from '../models/User'; // model de User

class Schedule {
  // metodo de listagem da agenda do provider
  async index(req, res) {
    // checando se o usuario logado é um provider
    const checkUserProvider = await User.findOne({
      where: { id: req.Id, provider: true },
    });
    // caso nao seja cai aqui
    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }

    // pega a data passada
    const { date } = req.query;
    // variavel que retorna a data
    const parsedDate = parseISO(date);
    // checa todos os Appointments do dia atraves do usuario logado
    const Appointments = await Appointment.findAll({
      where: {
        provider_id: req.Id,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)], // operador between, com o inicio do dia e o fim do dia
        },
      },
      order: ['date'], // ordenado pela data
    });

    return res.json(Appointments);
  }
}

export default new Schedule();
