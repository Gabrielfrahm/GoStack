import User from '../models/User'; // model de user
import File from '../models/File'; // model de file

// criando a classe
class ProviderController {
  async index(req, res) {
    // constante que recebe a requisição
    const providers = await User.findAll({
      where: { provider: true }, // procura no banco todos os users que tem provider igual true
      attributes: ['id', 'email', 'avatar_id'], // o que eu quero que devolva para o front end
      include: [
        {
          model: File, // incuindo o modal dos file
          as: 'avatar', // renomenado para avatar
          attributes: ['name', 'path', 'url'], // o que eu quero que retorne do avatar
        },
      ],
    });

    return res.json(providers);
  }
}

export default new ProviderController();
