import * as Yup from 'yup'; // biblioteca que permite a validação de infromações no shape da requisição
import User from '../models/User'; // importando o modal do user

// criando a classe
class UserController {
  async store(req, res) {
    // constante schema que recebe um Yup objeto para verificar seu corpo
    const schema = Yup.object().shape({
      name: Yup.string().required(), // nome tipo String e obrigatorio
      email: Yup.string().email().required(), // email tipo String usando Email para verificar e obrigatorio
      password: Yup.string().required().min(6), // senha tipo String  e obrigatorio com o minimo de 6 caracteres
    });

    // caso algum campo da validação de erro retorna para o usuario  uma mensagem de erro
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExist = await User.findOne({ where: { email: req.body.email } }); // verificando se existe apenas um email

    if (userExist) {
      return res.status(400).json({ error: 'User already exists' }); // caso exista um email igual ao informado cai nesse erro
    }

    const { id, name, email, provider } = await User.create(req.body);
    // usando a desestruturação para pegar  todos os dados informados e usar um create da na tabela do banco

    return res.json({
      id,
      name,
      email,
      provider,
    }); // todos os dados apresentados no back end
  }

  // metodo put so pode ser acessado se o usuario estiver logado diacordo com a regra do middleware
  async update(req, res) {
    // constante schema que recebe um Yup objeto para verificar seu corpo
    // onde os campos a serem trocados nao sao obrigatorios, pois vc pode mudar apenas o nome ou email.
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().required().min(6), // quando for solicitado a troca de senha, informa a senha atual
      password: Yup.string() // nova senha seguindo os mesmo padroes de criação, no caso sera exibida a criação se for informado o oldPassword
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ), // o when usa para conferir se o oldPassword vou requerido
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ), // campo obrigatorio para a troca da senha
    });

    // caso algum dado esteja errado.
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword } = req.body; // recebendo email e a senha antiga pelo body

    const user = await User.findByPk(req.Id); // encontrando o user pelo id

    // verifica se o email usado é valido
    if (email !== user.email) {
      const userExist = await User.findOne({ where: { email } }); // verificando se existe o email

      if (userExist) {
        return res.status(400).json({ error: 'User already exists' }); // caso não  exista um email igual ao informado cai nesse erro
      }
    }
    // verifica se as senhas batem
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not mutch' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    }); // todos os dados apresentados no back end
  }
}

export default new UserController();
