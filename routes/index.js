
var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");
const { jsPDF } = require('jspdf');
const autoTable = require('jspdf-autotable');
crypto = require("crypto");

const grupe = require('../models.js').grupe;
const profi = require('../models.js').profi;
const users_2 = require("../models.js").users_2;
const sali = require("../models.js").sali;
const materii = require("../models.js").materii;
const orare = require("../models.js").orare;

mongoose
	.connect(
		process.env.MONGODB_URL,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => console.log("MongoDB connected"))
	.catch(err => console.log(err));

function codSala(sala) {
	if (sala.etaj == 0) {
		return sala.corp + 'P' + sala.numar + '-' + sala.capacitate;
	} else {
		return sala.corp + sala.etaj + sala.numar + '-' + sala.capacitate;
	}
}


function getOra(ora, i, j) {
	if (ora.zile[i].ora[j].Materie == "Liber") {
		return '';
	}
	return ora.zile[i].ora[j].Materie + '\n' + ora.zile[i].ora[j].tip + ' ' + ora.zile[i].ora[j].idSala
}

/* GET home page. */
router.get("/", async function (req, res, next) {

	let data = await orare.find({});

	const promises = data.map(async (orar) => {
		return Promise.all(orar.zile.map(async (zi) => {
			return Promise.all(zi.ora.map(async (ora) => {
				if (ora.Materie != "Liber") {
					const matID = await materii.findOne({ "nume": ora.Materie });

					//get object id of matID

					ora._doc.matID = matID._id;
				}
			}));
		}));
	});

	await Promise.all(promises);

	console.log(data[0].zile[0].ora[0]);

	data.forEach(e => {
		const doc = new jsPDF("landscape");

		doc.text("Orar grupa " + e.grupa, 10, 10);

		doc.autoTable({
			head: [['Ora', 'Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri']],
			body: [
				['9:00-11:00', getOra(e, 0, 0), getOra(e, 1, 0), getOra(e, 2, 0), getOra(e, 3, 0), getOra(e, 4, 0)],
				['11:00-13:00', getOra(e, 0, 1), getOra(e, 1, 1), getOra(e, 2, 1), getOra(e, 3, 1), getOra(e, 4, 1)],
				['13:00-15:00', getOra(e, 0, 2), getOra(e, 1, 2), getOra(e, 2, 2), getOra(e, 3, 2), getOra(e, 4, 2)],
				['15:00-17:00', getOra(e, 0, 3), getOra(e, 1, 3), getOra(e, 2, 3), getOra(e, 3, 3), getOra(e, 4, 3)],
				['17:00-19:00', getOra(e, 0, 4), getOra(e, 1, 4), getOra(e, 2, 4), getOra(e, 3, 4), getOra(e, 4, 4)],
				],
			theme: 'grid',
			styles:{
				fontSize: 12,
				halign: 'center',
				valign: 'middle',
				margin: { top: 20, bottom: 20 },
				minCellHeight: 30,
			},
			headStyles:{
				minCellHeight: 10,
			}
		});
			
		const data = doc.output('datauristring');

		e.pdf = data;
	});

	res.render("index", { title: "Orar-app", orare: data, loggedin: req.session.loggedin });
});


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

router.get("/home",async function (request, response) {
	if (request.session.loggedin) {

		let data = await sali.find({});

		data.forEach(e => {
			e.cod=codSala(e);
		});

		response.render("home", { sali: data, name: request.session.username, loggedin: request.session.loggedin });
	} else {
		response.render('index', { redirected: true, title: 'Orar-app' });
	}
});

router.post("/signup", async function (req, res, next) {

	try {
		let newUser = new users_2();
		newUser.username = req.body.username;
		newUser.setPassword(req.body.password);
		await newUser.save();
		res.redirect("/login");

	} catch (err) {
		console.log(err);
	}

});


router.get("/insertData",async function (req, res) {
	if (req.session.loggedin) {

		let p = await profi.find({});
		let g = await grupe.find({});
		let maxid = await materii.find({}).sort({ id: -1 }).limit(1);

		res.render('insert', { loggedin: req.session.loggedin, 'profi': p, 'grupe': g, 'maxID': maxid[0].id });
		

	} else {
		res.render('index', { redirected: true, title: 'Orar-app' });
	}
});

router.get("/new",async function (req, res) {
	res.render('newUser', { loggedin: req.session.loggedin });
});

module.exports = router;