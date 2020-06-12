module.exports = {
  env: {
    es2020: true,
    node: true,
  },
  extends: [
    'airbnb-base', 'prettier'

  ],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
    "prettier/prettier": "error", // apontar os erros do  prettier 
    "class-methods-use-this": "off",// nao quero que toda classe use o This como padrao;
    "no-param-reassign": "off", // permitir receber informações do parametro e modificar ela
    "camelcase": "off",// retirando a obrigariedade do camelCase das variaveis para poder usar camel_case
    "no-unused-vars": ["error", { "argsIgnorePatter": "next" }], //poder declarar a variavel next sem usar ela
  },
};
