import jwt from 'jsonwebtoken'; // importação do jsonwebtoken
import * as Yup from 'yup';
import User from '../models/User'; // importação do models o User
import authConfig from '../../config/auth'; // importação das configurações de autenticação

// criação da class
class SessionController {
  // criando o metodo store
  async store(req, res) {
    // constante schema que recebe um Yup objeto para verificar seu corpo para login
    const schema = Yup.object().shape({
      email: Yup.string().email().required(), // email obrigatorio
      password: Yup.string().required(), // senha obrigatoria
    });

    // caso algun dado esteja errado cai aqui
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { email, password } = req.body; // desestruturação da body
    const user = await User.findOne({ where: { email } }); // achando o email passado pelo usuario

    if (!user) {
      return res.status(401).json({ error: 'User not found' }); // caso ele nao ache o email ele cai aqui
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' }); // se a senha nao for a mesma cadastrada no banco
    }

    const { id, name } = user; // desestruturação do id e name do user

    // caso seja tudo verdadeiro returna para o usuario
    return res.json({
      user: {
        id,
        name,
        email,
      },
      // gerando o JWT
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
