require('dotenv/config');

module.exports = {
  dialect: 'postgres', // o tipo de banco a ser usado no caso postgres
  host: process.env.DB_HOST, // onde esta o banco no caso localhost
  username: process.env.DB_USER, // usuario que vai utilizar o banco no caso padrão é o 'postgres'
  password: process.env.DB_PASS, // senha do banco
  database: process.env.DB_NAME, // nome do banco
  define: {
    // construção de definicoes
    timestamps: true, // log de data de criação ou modificação de informações
    underscored: true, // uso de criação de _
    underscoredAll: true,
  },
};
