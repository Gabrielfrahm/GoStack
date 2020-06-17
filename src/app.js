import express from 'express'; // import usando essa syntax apenas permitido pelo sucrase
import path from 'path';
import routes from './routes';
import './database';

/* construtor da aplicação criando uma classe
sempre quando a classe App for chamada executa  os metodos abaixo
*/
class App {
  // instanciando
  constructor() {
    this.server = express(); // express
    this.middlewares(); // todos os middlewares
    this.routes(); // todas as rotas
  }

  /* middlewares  no caso desse contendo apenas o json() para fazer chamadas no formato de json  */
  middlewares() {
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')) // metodo que foi criado para exibir a imagem de avatar utilizando um metodo static
    );
  }

  // routes usando todas as rotas da aplicação recebida pela variavel
  routes() {
    this.server.use(routes);
  }
}

/* exportação da classe App como vamos utilizar apenas o
server  podemos exporta apenas ele explicidamente */
export default new App().server;
