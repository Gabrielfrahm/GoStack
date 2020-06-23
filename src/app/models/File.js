import Sequelize, { Model } from 'sequelize'; // importando o Sequelize e o Modal

// criando a classe
class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL, // tipo nao constado na bd
          get() {
            return `${process.env.APP_URL}/files/${this.path}`; // url exibida para o front end exibir a imagem de avata
          },
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default File;
