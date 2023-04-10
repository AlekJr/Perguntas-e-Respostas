const Sequelize = require("sequelize");

const connection = require("./database");

const Pergunta = connection.define("perguntas", {
  titulo: {
    type: Sequelize.STRING, //aqui foi usado porque sting é para tipos curtos ja o text para tipos grandes
    allowNull: false,
  },
  descricao: {
    type: Sequelize.TEXT,
    allowNull: false, //não pode valor nulo nesse campo o que significa que o usuario tem que digitra alguma coisa
  },
});

Pergunta.sync({ force: false }).then(() => {}); // vai sincronizar com a Pergunta, (ja no FORCE:FALSE ele não vai recriar a tabela) se não existir uma tabela chamada pergunta ele vai criar caso ja exista uma ele não cria nada

module.exports = Pergunta; //para poder mandar os dados para o banco de dados, precisamos importa no index quanto aqui
