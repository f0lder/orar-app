
var express = require("express");
const mongoose = require("mongoose");
const {jsPDF} = require('jspdf');
const autoTable = require('jspdf-autotable');

var router = express.Router();

const grupe = require('../models.js').grupe;
const profi = require('../models.js').profi;
const users = require("../models.js").users;
const sali = require("../models.js").sali;
const materii = require("../models.js").materii;
const orare = require("../models.js").orare;


/* GET home page. */
router.get("/", async function (req, res, next) {

	let data = await orare.find({});

        data.forEach(e => {
            const doc = new jsPDF();

            doc.text("Grupa: "+e.grupa, 10, 10);

            doc.autoTable({
                head: [['Ora','Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri']],
                body:[[
					'9:00-11:00',
                    e.zile[0].ora[0].Materie + ' ' + e.zile[0].ora[0].tip + ' ' + e.zile[0].ora[0].idSala, 
                    e.zile[1].ora[0].Materie,
                    e.zile[2].ora[0].Materie,
                    e.zile[3].ora[0].Materie,
                    e.zile[4].ora[0].Materie
                ],[
					'11:00-13:00',
					e.zile[0].ora[1].Materie, 
                    e.zile[1].ora[1].Materie,
                    e.zile[2].ora[1].Materie,
                    e.zile[3].ora[1].Materie,
                    e.zile[4].ora[1].Materie
				],[
					'13:00-15:00',
					e.zile[0].ora[2].Materie,
					e.zile[1].ora[2].Materie,
					e.zile[2].ora[2].Materie,
					e.zile[3].ora[2].Materie,
					e.zile[4].ora[2].Materie
				],[
					'15:00-17:00',
					e.zile[0].ora[3].Materie,
					e.zile[1].ora[3].Materie,
					e.zile[2].ora[3].Materie,
					e.zile[3].ora[3].Materie,
					e.zile[4].ora[3].Materie
				],[
					'17:00-19:00',
					e.zile[0].ora[4].Materie,
					e.zile[1].ora[4].Materie,
					e.zile[2].ora[4].Materie,
					e.zile[3].ora[4].Materie,
					e.zile[4].ora[4].Materie
				]]  
            });

            const data = doc.output('datauristring');

            e.pdf=data;
        });

	res.render("index", { title: "Orar-app" , orare: data, loggedin: req.session.loggedin});
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
	return await materii.find({}).sort({id: -1}).limit(1);
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
	if (request.session.loggedin) {
		let cursor = getSali();

		cursor.then((rooms) => {
			rooms.forEach(e => {
				e.cod = codSala(e);
			});
			response.render("home", { sali: rooms, name: request.session.username,loggedin: request.session.loggedin });
		});
	} else {
		response.render('index', { redirected: true, title: 'Orar-app' });
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
			res.render('insert', { loggedin: req.session.loggedin,'profi': results[0].value, 'grupe': results[1].value, 'maxID': results[2].value[0].id });
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