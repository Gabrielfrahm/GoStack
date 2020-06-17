module.exports = {
  // adicionando coluna em uma tabela ja existente
  up: (queryInterface, Sequelize) => {
    // primeiro informa onde quer inserir a coluna depois o nome da coluna com o seus tipos
    return queryInterface.addColumn('users', 'avatar_id', {
      type: Sequelize.INTEGER,
      references: { model: 'files', key: 'id' }, // referenciando a coluna com os id da tabela files
      onUpdate: 'CASCADE', // quando for atualizado
      onDelete: 'SET NULL', // quando for deletado
      allowNull: true, // e permite falso
    });
  },

  // remove a coluna
  down: (queryInterface) => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
