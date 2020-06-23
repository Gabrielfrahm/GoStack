import Sequelize from 'sequelize'; // importando o Sequelize
import mongoose from 'mongoose'; // orm do mongoDB
import databaseConfig from '../config/database'; // importando as configurações do banco
import User from '../app/models/User'; // importando o model de User
import File from '../app/models/File'; // importando o model de File
import Appointment from '../app/models/Appointment'; // importando o model de Appointment

const models = [User, File, Appointment]; // contante que vai ser utizlida  para armazenar todos os models importados em um array

// criação da classe Databas
class Database {
  // metodo construtur sera criado toda a vez que a classe for  chamada
  constructor() {
    this.init(); // metodo init
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig); // fazendo a coneção com o banco

    models
      .map((model) => model.init(this.connection)) // percorrendo os models
      .map(
        (model) => model.associate && model.associate(this.connection.models) // novo map para  percorrer o model
      );
  }

  mongo() {
    // conexão com o mongo
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true, // configuração necessaria
      useFindAndModify: true, // configuração necessaria
      useUnifiedTopology: true, // configuração necessaria
    });
  }
}

export default new Database();
