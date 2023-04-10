// const express = require("express");//importando o framework
// const app = express();//Uma copia para a variavel express
// app.set('view engine','ejs');//então aqui eu estou dizendo para o meu express que view engine o motor de html é a ejs ou seja estou dizendo para o express usar o EJS como view engine.
// app.use(express.static("public"));// Aqui estou colocando o css / img etc... e criar uma pasta public para colocar os arquivos

// //apos isso criamos uma rota

// app.get("/", (req, res) => {
//   var nome = "Alex Felix Andre Junior";
//   var idade = 20;
//   var lang = "JavaScript";
//   var exibirMsg = false;
//   var produtos = [
//     {nome:"doritos", preco:6.30},
//     {nome:"Coca-cola", preco:5.00},
//     {nome:"Leite", preco:1.45}
//   ]
//   res.render("index", {
//     nome:nome,
//     lang:lang,
//     idade:idade,
//     empresa:"SAMURAY",
//     msg:exibirMsg,
//     produtos:produtos
//   })//aqui eu estou mandondo o express renderizar um arquivo chamando index que esta dentro da pasta views, render ja vai para a pasta views direto
// });

// //agora vamos rodar a nossa aplicação

// app.listen(3000,() => {
//   console.log("app esta rodando");
// });

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/pergunta"); //para poder mandar os dados para o banco de dados, precisamos importa no na pasta do BD que é pergunta e quanto aqui
//database
const Resposta = require("./database/Resposta");
connection
  .authenticate()
  .then(() => {
    console.log("conexão feita com o Banco de Dados!!");
  })
  .catch((msgErro) => {
    console.log(msgErro);
  });
// estou dizendo para o express usar o EJS como view engine
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //só vai ser utilizado quandos estivermos trabalhando com API

//rotas
app.get("/", (req, res) => {
  Pergunta.findAll({
    raw: true,
    order: [
      ["id", "DESC"], //ASC = CRESCENTE DESC = DECRESCENTE, isso é para mostrar as perguntas do menor para o maior
    ],
  }).then((Pergunta) => {
    // com o raw faz aparecer só o titulo e descrição como se fosse no mysql
    console.log(Pergunta); //mostra no console meu titulo e descrição
    res.render("index", {
      Pergunta: Pergunta,
    }); // select ALL from Perguntas equivalente ao SQL
  });
});

app.get("/perguntar", (req, res) => {
  res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
  var titulo = req.body.titulo;
  //pegando informaçoes do formulario
  var descricao = req.body.descricao;
  Pergunta.create({
    titulo: titulo,
    descricao: descricao,
  }).then(() => {
    res.redirect("/");
  });
});

app.get("/pergunta/:id", (req, res) => {
  var id = req.params.id;
  Pergunta.findOne({
    where: { id: id },
  }).then((pergunta) => {
    if (pergunta != undefined) {
      // se a pergunta for encontrada (id)
      Resposta.findAll({
        where: { perguntaId: pergunta.id },
        order: [["id", "DESC"]],
      }).then((respostas) => {
        res.render("pergunta", {
          pergunta: pergunta,
          respostas: respostas,
        });
      });
    } else {
      res.redirect("/"); //se a pergunta não for encontrada
    }
  });
});

app.post("/responder", (req, res) => {
  var corpo = req.body.corpo;
  var perguntaId = req.body.pergunta;
  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId,
  }).then(() => {
    res.redirect("/pergunta/" + perguntaId);
  });
});

app.listen(3000, () => {
  console.log("app funcionando");
});
