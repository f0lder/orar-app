var express = require("express");
const mongoose = require("mongoose");

var router = express.Router();

const SaliSchema = new mongoose.Schema({
	corp: String,
	etaj: Number,
	numar: Number,
	capacitate: Number
}, {
	versionKey: false
});
const sali = mongoose.models.sali || mongoose.model('sali', SaliSchema, "sali");

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

//render the form with data
router.get("/", function (request, response) {
	if (request.session.loggedin) {
		let cursor = getSali();
		cursor.then((rooms) => {
			rooms.forEach(e => {
				e.cod = codSala(e);
			});
			//console.log("Sali: " + rooms);
			response.render("sali", { sali: rooms });
		});
	} else {
		response.render('index',{redirected: true,title:'Orar-app'});
	}
});

//! The post method is in index.js

module.exports = router;