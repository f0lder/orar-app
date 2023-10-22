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
})
const SaliSchema = new mongoose.Schema({
	corp: String,
	etaj: Number,
	numar: Number,
	capacitate: Number
})

//set the schema
const users = mongoose.model('users', UserSchema);
const sali = mongoose.model('sali', SaliSchema, "sali");

async function getUser(username, password) {
	return await users.findOne({ username: username, pass: password });
}
async function getSali() {
	return await sali.find({});
}
async function insertSala(sala){
	const result = await sali.insertMany(sala);
	
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
		response.render("home", {});
	}
});

router.get("/insertData", function (req, res) {
	res.render("insert");
});

module.exports = router;
router.post('/insertSala',function(req,res){
	//TODO check for login
	//TODO add mongoose create doc and save doc
	let sala ={
		corp:req.body.corp,
		etaj:req.body.etaj,
		numar:req.body.numar,
		capacitate:req.body.capacitate,
	}

	if(sala.etaj =='P'){
		sala.etah = 0;
	}

	insertSala(sala);
});