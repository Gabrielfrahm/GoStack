import Sequelize, { Model } from 'sequelize'; // importando o Sequelize e o Modal
import bcrypt from 'bcryptjs';

// criando a classe
class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // o tipo vitual é um campo que e preenchido mas nao esta no banco de dados
        password_hash: Sequelize.STRING,
        provider: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8); // usando o bcrypt
      }
    });
    return this;
  }

  // novo metodo para relacionar a tabela com a chave estrangeira
  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' }); // apelido do avatar
  }

  // verifica as senhas
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
