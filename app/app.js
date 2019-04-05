//Exemplo de Web Service REST utilizando NodeJS e MongoDB em Containers Docker

var express = require('express');
var mongo = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Conexão com o MongoDB
var mongoaddr = 'mongodb://' + process.env.MONGO_PORT_27017_TCP_ADDR + ':27017/jogosbacanas';
console.log(mongoaddr);
mongo.connect(mongoaddr);

//Esquema da collection do Mongo
var taskListSchema = mongo.Schema({
	nome: { type: String }, 
	plataforma: { type: Array },
    descricao: { type: String },
    imagemUrl: { type: String },
    anoLancamento: {type: String}, 
	updated_at: { type: Date, default: Date.now },
});

//Model da aplicação
var Model = mongo.model('Jogo', taskListSchema);

//GET - Retorna todos os registros existentes no banco
app.get("/api/jogos", function (req, res) {
	Model.find(function(err, todos) {
		if (err) {
			res.json(err);
		} else {
			res.json(todos);
		}
	})
});

//GET param - Retorna o registro correspondente da ID informada
app.get("/api/jogos/titulo/:nome?", function (req, res) {
	var nome = req.params.nome;
	Model.find({'nome': nome}, function(err, regs) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.json(regs);
		}
	});
});

//GET param - Retorna o registro correspondente da ID informada
app.get("/api/jogos/plataforma/:plataforma?", function (req, res) {
	var plataforma = req.params.plataforma;
	Model.find({'plataforma': plataforma}, function(err, regs) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.json(regs);
		}
	});
});

//POST - Adiciona um jogo
app.post("/api/jogos", function (req, res) {
	var register = new Model({
		'nome' : req.body.nome,
        'plataforma' : req.body.plataforma,
        'anoLancamento' : req.body.anoLancamento,
        'descricao' : req.body.descricao,
        'imagemUrl' : req.body.imagemUrl
	});
	register.save(function (err) {
		if (err) {
			console.log(err);
			res.send(err);
			res.end();
		}
	});
	res.send(register);
	res.end();
});

//PUT - Atualiza um registro
app.put("/api/jogos/:id", function (req, res) {
	Model.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err)  {
    	return next(err);
    } else {
    	res.json(post);	
    }
  });
});

//DELETE - Deleta um registro
app.delete("/api/jogos/:id", function (req, res) {
 Model.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});	

//Porta de escuta do servidor
app.listen(8080, function() {
	console.log('Funcionando modo Viking');
});


