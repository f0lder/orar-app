
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


const users = require("../models.js").users;
const sali = require("../models.js").sali;

const SaliSchema = require("../schemas.js").SaliSchema;

async function getUser(username, password) {
	return await users.findOne({ username: username, pass: password });
}
async function getSali() {
	return await sali.find({});
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

router.get("/home", function (request, response) {
	if (request.session.loggedin) {
		let cursor = getSali();

		cursor.then((rooms) => {
			rooms.forEach(e => {
				e.cod = codSala(e);
			});
			response.render("home", { sali: rooms, name: request.session.username });
		});
	} else {
		response.render('index', { redirected: true, title: 'Orar-app' });
	}
});


const profi = require('../models.js').profi;

async function getProfi() {
	return await profi.find({});
}

router.get("/insertData", function (req, res) {
	if (req.session.loggedin) {
		let cursor = getProfi();
		cursor.then((data) => {
			console.log(data);

			res.render("insert", { 'profi': data });
		});
	} else {
		res.render('index', { redirected: true, title: 'Orar-app' });
	}
});


// cauta grupa
const grupe = require('../models.js').grupe;

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