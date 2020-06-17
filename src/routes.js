import { Router } from 'express';
// importando a Router do express para que possamos utilizar em outro arquivo

import multer from 'multer';
import multerConfig from './config/multer';
import authMiddlaware from './app/middlewares/auth'; // importando o middleware de verificação de login

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';

const routes = new Router(); // instanciando o Router em uma variavel
const upload = multer(multerConfig);

routes.get('/users', (req, res) => {
  res.json('reste');
});

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddlaware); // tudo que estiver apos essa linha deve estar logado para ser acessado

routes.put('/users', UserController.update); // atulizar user

routes.get('/providers', ProviderController.index); // rota para listar os prestadores de serviços
routes.post('/appointments', AppointmentController.store); // rota para agenar appointments

routes.post('/files', upload.single('file'), FileController.store); // rota para enviar os arquivos para o banco

export default routes; // exportando a variavel para que possa ser lido no App.js
