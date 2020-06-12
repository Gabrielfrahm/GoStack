import Sequelize, { Model } from 'sequelize'; // importando o Sequelize e o Modal

// criando a classe
class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        provider: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
  }
}

export default User;
