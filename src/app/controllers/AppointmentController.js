import * as Yup from 'yup'; // importação do Yup para validações
import Appointment from '../models/Appointment'; // import do modal dos Appointment
import User from '../models/User'; // importaçõa do modal dos User

class AppointController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(), // trazendo o id da provider
      date: Yup.date().required(), // a data do agentamento
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations Fails' });
    }

    const { provider_id, date } = req.body;
    // checa se o provider_id e um provider
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true }, //  procura o provider se e true
    });

    // se nao for verdade ele resuca dando mensagem de erro
    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You cant only create appointments with  providers' });
    }
    // caso passe na verificação, efetua o cadastro no banco
    const appointment = await Appointment.create({
      user_id: req.Id, // Id vem do auth middleware (token)
      provider_id,
      date,
    });
    // retorna os campos
    return res.json(appointment);
  }
}

export default new AppointController();
