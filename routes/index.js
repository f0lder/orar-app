//! all post methods must be here!

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

router.get("/insertData", function (req, res) {
	if (req.session.loggedin) {
		res.render("insert");
	} else {
		res.render('index', { redirected: true, title: 'Orar-app' });
	}
});


router.post('/insertSala', function (req, res) {
	if (req.session.loggedin) {
		//TODO check for login
		//TODO add mongoose create doc and save doc

		insertSala(req.body.corp, req.body.etaj, req.body.numar, req.body.capacitate).then((p) => {
			console.log("A doc was inserted!");
			res.redirect('/home');
		});
	} else {
		res.render('index', { redirected: true, title: 'Orar-app' });
	}
});

module.exports = router;