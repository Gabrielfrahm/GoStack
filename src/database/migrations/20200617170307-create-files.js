module.exports = {
  // metodo de criação da migration up
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('files', {
      id: {
        type: Sequelize.INTEGER, // typo do campo
        allowNull: false, // nao permite falso
        autoIncrement: true, // é autoincrementavel
        primaryKey: true, // e chave primaria da tabela
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      path: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      // preenchidos automaticamente pelo sequelize
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface) => {
    // metodo de deleção da migration
    return queryInterface.dropTable('files');
  },
};
