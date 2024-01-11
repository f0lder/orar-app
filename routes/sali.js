var express = require("express");
const mongoose = require("mongoose");

var router = express.Router();

// const SaliSchema = new mongoose.Schema({
//     corp: String,
//     etaj: Number,
//     numar: Number,
//     capacitate: Number
// }, {
//     versionKey: false
// });
// const sali = mongoose.models.sali || mongoose.model('sali', SaliSchema, "sali");

const sali = require("../models").sali;

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
            response.render("sali", { sali: rooms,loggedin: request.session.loggedin });
        });
    } else {
        response.render('index', { redirected: true, title: 'Orar-app' });
    }
});

async function deleteDoc(id) {
    return await sali.findByIdAndDelete(id);
}

router.get('/delete/id=:id', function (req, res, next) {
    const id = req.params.id;

    let cursor = deleteDoc(id);
    cursor.then((response) => {
        res.redirect('/sali');
    });
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

const SaliSchema = require('../schemas').SaliSchema;

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

module.exports = router;