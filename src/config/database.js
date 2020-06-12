module.exports = {
  dialect: 'postgres', // o tipo de banco a ser usado no caso postgres
  host: 'localhost', // onde esta o banco no caso localhost
  username: 'postgres', // usuario que vai utilizar o banco no caso padrão é o 'postgres'
  password: 'docker', // senha do banco
  database: 'gobarber', // nome do banco
  define: {
    // construção de definicoes
    timestamps: true, // log de data de criação ou modificação de informações
    underscored: true, // uso de criação de _
    underscoredAll: true,
  },
};
