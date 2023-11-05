var express = require("express");
const mongoose = require("mongoose");

var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
	res.render("index", { title: "Orar-app" });
});

mongoose
	.connect(
		process.env.MONGODB_URL,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => console.log("MongoDB connected"))
	.catch(err => console.log(err));

//declare table model
const UserSchema = new mongoose.Schema({
	email: String,
	username: String,
	pass: String
});
const SaliSchema = new mongoose.Schema({
	corp: String,
	etaj: Number,
	numar: Number,
	capacitate: Number
}, {
	versionKey: false
});

const UniSchema = new mongoose.Schema({
	nume: String,
});

const FacSchema = new mongoose.Schema({
	id: Number,
	nume: String,
});

const DepSchema = new mongoose.Schema({
	id: Number,
	nume: String,
	idFac: Number
});

const SpecSchema = new mongoose.Schema({
	id: Number,
	nume: String,
	idDep: Number
});

const GrupeSchema = new mongoose.Schema({
	cod: Number,
	nSemigrupe: Number,
	nStudenti: Number,
	an: Number,
	idSpec: Number
});

const MaterieSchema = new mongoose.Schema({
	id: Number,
	nume: String,
	curs: Boolean,
	laborator: Boolean,
	seminar: Boolean,
	proiect: Boolean,
	idProfesor:Number,
	idGrupa: [String]
});
const ProfSchema = new mongoose.Schema({
	id: Number,
	nume: String,
	idMaterii: [Number],
});
const OraSchema = new mongoose.Schema({
	tip: Number,
	Materie: [MaterieSchema],
	idSala: Number,
	oraInceput: Number,
	oraSf: Number,

});
const ZiSchema = new mongoose.Schema({
	ora1: OraSchema, // 9 - 11
	ora2: OraSchema, // 11 - 13
	ora3: OraSchema, // 13 -15
	ora4: OraSchema, // 15 - 17
	ora5: OraSchema, // 17 - 19
});
const OrarSchema = new mongoose.Schema({
	grupa: Number,
	luni: ZiSchema,
	marti: ZiSchema,
	miercuri: ZiSchema,
	joi: ZiSchema,
	vineri: ZiSchema,
});

//set the schemas
const users = mongoose.model('users', UserSchema);
const sali = mongoose.model('sali', SaliSchema, "sali");
const facultati = mongoose.model('facultate',FacSchema,'facultati');
const departamente = mongoose.model('departament',DepSchema,'departamente');
const specializari = mongoose.model('specializare',SpecSchema,'specializari');
const grupe = mongoose.model('grupa',GrupeSchema,'grupe');
const materii = mongoose.model('materie',MaterieSchema,'materii');
const profi = mongoose.model('prof',ProfSchema,'profi');
const ore = mongoose.model('ora',OraSchema,'ore');
const zile = mongoose.model('zi',ZiSchema,'zile');
const orare = mongoose.model('orar',OrarSchema,'orare');

async function getUser(username, password) {
	return await users.findOne({ username: username, pass: password });
}
async function getSali() {
	return await sali.find({});
}
async function insertSala(corp, etaj, numar, capacitate) {

	const Sala = mongoose.model('sali', SaliSchema);
	const S = new Sala({
		corp: corp,
		etaj: etaj,
		numar: numar,
		capacitate: capacitate
	});
	console.dir(S);
	await S.save();
}

function codSala(sala) {
	if (sala.etaj == 0) {
		return sala.corp + 'P' + sala.numar + '-' + sala.capacitate;
	} else {
		return sala.corp + sala.etaj + sala.numar + '-' + sala.capacitate;
	}
}

router.post("/auth", function (request, response) {
	let username = request.body.username;
	let password = request.body.password;

	console.log("Name: " + username + "\nPassword: " + password + "\n");

	if (username && password) {

		let CurrentUser = getUser(username, password);

		CurrentUser.then((user) => {
			console.log(user);
			if (user != null) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect("/home");
			} else {
				response.send("Incorrect user or pass!");
			}
		});
	} else {
		response.send("Please enter user and pass");
		response.end();
	}
});

router.get("/home", function (request, response) {
	if (request.session.loggedin) {
		let cursor = getSali();

		cursor.then((rooms) => {
			rooms.forEach(e => {
				e.cod = codSala(e);
			});
			console.log("Sali: " + rooms);
			response.render("home", { sali: rooms, name: request.session.username });
		});
	} else {
		response.render('index',{redirected: true,title:'Orar-app'});
	}
});

router.get("/insertData", function (req, res) {
	if (req.session.loggedin) {
		res.render("insert");
	} else {
		res.render('index',{redirected: true,title:'Orar-app'});
	}
});



//! all post methods must be here!
router.post('/insertSala', function (req, res) {
	if (req.session.loggedin) {
		//TODO check for login
		//TODO add mongoose create doc and save doc

		insertSala(req.body.corp, req.body.etaj, req.body.numar, req.body.capacitate).then((p) => {
			console.log("A doc was inserted!");
			res.redirect('/home');
		});
	} else {
		res.render('index',{redirected: true,title:'Orar-app'});
	}
});

module.exports = router;