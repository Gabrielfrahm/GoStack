import { Router } from 'express';
// importando a Router do express para que possamos utilizar em outro arquivo
import User from './app/models/User';

const routes = new Router(); // instanciando o Router em uma variavel

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'gabriel marques',
    email: 'gabriel_frahm@teste.com',
    password_hash: '1234',
  });
  res.json(user);
});

export default routes; // exportando a variavel para que possa ser lido no App.js
