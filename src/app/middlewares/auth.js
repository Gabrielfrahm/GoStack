import jwt from 'jsonwebtoken'; // importação do jsonwebtoken
import { promisify } from 'util'; // uma lib para poder usar async and await dentro to jwt.verify
import authConfig from '../../config/auth'; // importando as configuraçoes do token

// exportando o middleware
export default async (req, res, next) => {
  const authHeader = req.headers.authorization; // constante que envia o token pelo metodo bearer

  if (!authHeader) {
    return res.status(401).json({ error: 'token not provided' }); // caso o header não encontre o token
  }

  const [, token] = authHeader.split(' '); // divide o token em duas partes (bearer + 'token');

  try {
    // uma função que chama outra função para realizar a verificação do secret
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.Id = decoded.id; // retorna o id do user recebido no token de login

    return next(); // de chegar aqui é pq o token foi validado com sucesso e pode proseguir com a rota
  } catch (err) {
    return res.status(401).json({ error: 'token invalid' }); // se o token estiver errado
  }
};
