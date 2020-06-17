module.exports = {
  // metodo de criação da migration up
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.INTEGER, // typo do campo
        allowNull: false, // nao permite falso
        autoIncrement: true, // é autoincrementavel
        primaryKey: true, // e chave primaria da tabela
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' }, // referenciando a coluna com os id da tabela files
        onUpdate: 'CASCADE', // quando for atualizado
        onDelete: 'SET NULL', // quando for deletado
        allowNull: true, // e permite falso
      },
      provider_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' }, // referenciando a coluna com os id da tabela files
        onUpdate: 'CASCADE', // quando for atualizado
        onDelete: 'SET NULL', // quando for deletado
        allowNull: true, // e permite falso
      },
      canceled_at: {
        type: Sequelize.DATE,
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
    return queryInterface.dropTable('appointments');
  },
};
