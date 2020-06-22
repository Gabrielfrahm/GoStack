import * as Yup from 'yup'; // importação do Yup para validações
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns'; // metodos para pegar a hora atual, comparar se a hora atual do envento ja nao passou
import pt from 'date-fns/locale/pt'; // para poder formatar os  linguagem em portugues
import Appointment from '../models/Appointment'; // import do modal dos Appointment
import User from '../models/User'; // importaçõa do modal dos User
import File from '../models/File'; // importaçõa do modal dos file
import Notification from '../schemas/Notifications';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue'; // importa os emails

class AppointController {
  // metodo para listar o Appointments
  async index(req, res) {
    const { page } = req.query; // pega a pagina para exibito os Appointment
    // constante que procura todos os Appointments no banco com o mesmo id do solicitado, ordena pela data
    const appointments = await Appointment.findAll({
      where: { user_id: req.Id, canceled_at: null }, // no caso a data de cancelamento nao pode existir
      order: ['date'], // ordena pela data
      attributes: ['id', 'date'], // apresenta apenas o id e data
      limit: 20, // limite de 20
      offset: (page - 1) * 20, // paginação
      include: [
        {
          model: User, // model de usuario
          as: 'provider', // apelido
          attributes: ['id', 'name'], // retorna apenas o id e o nome do provider
          include: [
            {
              model: File, // model de arquivos, nesse caso apenas o avatar
              as: 'avatar', // apelido
              attributes: ['id', 'path', 'url'], // retorna apenas id, o caminho do arquivo para montar a url
            },
          ],
        },
      ],
    });
    return res.json(appointments); // resposta da chamada
  }

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
    if (provider_id === req.Id) {
      return res.status(401).json({ error: 'Provider is  igual User' });
    }

    // checando se a data do evento ja nao passou
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past date are not permitted' });
    }
    // vendo de o provider ja nao tem um evento marcado esea hora
    const isAvailability = await Appointment.findOne({
      where: { provider_id, canceled_at: null, date: hourStart },
    });

    if (isAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    // caso passe na verificação, efetua o cadastro no banco
    const appointment = await Appointment.create({
      user_id: req.Id, // Id vem do auth middleware (token)
      provider_id,
      date,
    });

    // notificar novo serviço
    const user = await User.findByPk(req.Id); //  encontra o usuario pelo id
    // formata a data atual da requisição onde dd é dia MMMM mes por extenso  e H:mm hora e minutos
    const formattedDate = format(hourStart, "dd 'de' MMMM', às' H:mm'h'", {
      locale: pt, // linguagem em pt
    });
    // cria no mongoDB
    await Notification.create({
      content: `Novo agendamento de ${user.name} para dia ${formattedDate}`,
      user: provider_id,
    });
    // retorna os campos
    return res.json(appointment);
  }

  // metodo para cancelar um agendamento
  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      // incluindo as informações do usuario
      include: [
        {
          model: User, // model do user
          as: 'provider', // apelido dos providers
          attributes: ['name', 'email'], // informações que quero dos providers
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    }); // recebe o id do appointment
    // compara para ver se o appoint id é igual ao o do usuario que cadastrou, caso o contrario ele nao permite
    if (appointment.user_id !== req.Id) {
      return res.status(401).json({
        error: "You Can't have permission to cancel this appointment.",
      });
    }
    const dataWithSub = subHours(appointment.date, 2); // contante que retorna 2 horas antes da data cadastrada para poder fazer a verificação
    // caso o solicitante da ação tente cancelar um appointment depois de duas horas antes do evento não sera permitido
    if (isBefore(dataWithSub, new Date())) {
      return res.status(401).json({
        error: 'you cant Only  cancel appointments 2 hours in advance.',
      });
    }
    // marca a data do cancelamento para a data atual
    appointment.canceled_at = new Date();
    // salva no banco de dados
    await appointment.save();
    // metodo de envio de email, recebendo informações do solicitante
    await Queue.add(CancellationMail.key, {
      appointment,
    });
    // retorna as informações de cancelado
    return res.json(appointment);
  }
}

export default new AppointController();
