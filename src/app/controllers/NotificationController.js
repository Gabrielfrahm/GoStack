import User from '../models/User'; // importando o modal do User
import Notifications from '../schemas/Notifications'; // importando o mongo com as notificações

// criando a classe de index listagem
class NotificationController {
  async index(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.Id, provider: true }, // vendo se o usuario é um provider
    });

    // caso nao seja
    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'Only  provider can load notifications' });
    }
    // exibindo sa notificações
    const notifications = await Notifications.find({
      user: req.Id,
    })
      .sort({ createdAt: 'desc' }) // ordena pela data decrecente
      .limit(20); // limite de 20

    // retorna as notificações
    return res.json(notifications);
  }

  // metoro para ler as notificações
  async update(req, res) {
    // findByIdAndUpdate encontra pelo id e faz um update
    const notification = await Notifications.findByIdAndUpdate(
      req.params.id, // encontra a notificação
      {
        read: true, // retorna como lida
      },
      { new: true } // retorna como nova no banco
    );
    return res.json(notification);
  }
}
export default new NotificationController();
