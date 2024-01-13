
var express = require("express");
const mongoose = require("mongoose");
const { jsPDF } = require('jspdf');
const autoTable = require('jspdf-autotable');

var router = express.Router();

const grupe = require('../models.js').grupe;
const profi = require('../models.js').profi;
const users_2 = require("../models.js").users_2;
const sali = require("../models.js").sali;
const materii = require("../models.js").materii;
const orare = require("../models.js").orare;


function getOra(ora, i, j) {
	if (ora.zile[i].ora[j].Materie == "Liber") {
		return '';
	}
	return ora.zile[i].ora[j].Materie + '\n' + ora.zile[i].ora[j].tip + ' ' + ora.zile[i].ora[j].idSala
}


/* GET home page. */
router.get("/", async function (req, res, next) {

	let data = await orare.find({});

	data.forEach(e => {
		const doc = new jsPDF();

		doc.text("Grupa: " + e.grupa, 10, 10);

		doc.autoTable({
			head: [['Ora', 'Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri']],
			body: [[
				'9:00-11:00',
				getOra(e, 0, 0),
				getOra(e, 1, 0),
				getOra(e, 2, 0),
				getOra(e, 3, 0),
				getOra(e, 4, 0)
			], [
				'11:00-13:00',
				getOra(e, 0, 1),
				getOra(e, 1, 1),
				getOra(e, 2, 1),
				getOra(e, 3, 1),
				getOra(e, 4, 1)
			], [
				'13:00-15:00',
				getOra(e, 0, 2),
				getOra(e, 1, 2),
				getOra(e, 2, 2),
				getOra(e, 3, 2),
				getOra(e, 4, 2)
			], [
				'15:00-17:00',
				getOra(e, 0, 3),
				getOra(e, 1, 3),
				getOra(e, 2, 3),
				getOra(e, 3, 3),
				getOra(e, 4, 3)
			], [

				'17:00-19:00',
				getOra(e, 0, 4),
				getOra(e, 1, 4),
				getOra(e, 2, 4),
				getOra(e, 3, 4),
				getOra(e, 4, 4)
			]]
		});

		const data = doc.output('datauristring');

		e.pdf = data;
	});

	res.render("index", { title: "Orar-app", orare: data, loggedin: req.session.loggedin });
});

mongoose
	.connect(
		process.env.MONGODB_URL,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => console.log("MongoDB connected"))
	.catch(err => console.log(err));

async function getUser(username, password) {
	return await users.findOne({ username: username, pass: password });
}
async function getSali() {
	return await sali.find({});
}

async function getMaxIdMaterii() {
	return await materii.find({}).sort({ id: -1 }).limit(1);
}

function codSala(sala) {
	if (sala.etaj == 0) {
		return sala.corp + 'P' + sala.numar + '-' + sala.capacitate;
	} else {
		return sala.corp + sala.etaj + sala.numar + '-' + sala.capacitate;
	}
}

crypto = require("crypto");

router.post("/auth", async (request, response) => {

	const user = await users_2.findOne({ username: request.body.username });

	if (user == null) {
		response.send("Username sau parola gresita!");
	} else {
		if (user.validPassword(request.body.password)) {
			request.session.loggedin = true;
			request.session.username = user.username;
			response.redirect("/home");
		} else {
			response.send("Username sau parola gresita!");
		}
	}
});


router.get("/logout", function (request, response) {
	request.session.loggedin = false;
	response.redirect("/");
});


router.get("/login", function (request, response) {
	if (request.session.loggedin) {
		response.redirect("/home");
	} else {
		response.render('login', { title: 'Orar-app' });
	}
});

router.get("/home", function (request, response) {
	if (request.session.loggedin || true) {
		let cursor = getSali();

		cursor.then((rooms) => {
			rooms.forEach(e => {
				e.cod = codSala(e);
			});
			response.render("home", { sali: rooms, name: request.session.username, loggedin: request.session.loggedin });
		});
	} else {
		response.render('index', { redirected: true, title: 'Orar-app' });
	}
});

router.post("/signup", async function (req, res, next) {

	try{
		let newUser = new users_2();
		newUser.username = req.body.username;
		newUser.setPassword(req.body.password);
		await newUser.save();
		res.redirect("/login");

	}catch(err){
		console.log(err);
	}
	
});


async function getProfi() {
	return await profi.find({});
}
async function getGrupe() {
	return await grupe.find({});
}

router.get("/insertData", function (req, res) {
	if (req.session.loggedin) {

		let promisies = [
			Promise.resolve(getProfi()),
			Promise.resolve(getGrupe()),
			Promise.resolve(getMaxIdMaterii())
		];

		Promise.allSettled(promisies).then((results) => {
			res.render('insert', { loggedin: req.session.loggedin, 'profi': results[0].value, 'grupe': results[1].value, 'maxID': results[2].value[0].id });
		});

	} else {
		res.render('index', { redirected: true, title: 'Orar-app' });
	}
});


async function cautaGrupa(q) {
	if (q == '') {
		return await grupe.find({});
	} else {
		return await grupe.find({ cod: { $regex: '.*' + q + '.*' } });
	}
}


router.get('/search/q=:q', function (req, res, next) {

	const q = req.params.q;

	let cursor = cautaGrupa(q);
	cursor.then((results) => {
		res.json(results);
	});

});

router.get('/search/q=', function (req, res, next) {
	res.send(null);
});

module.exports = router;