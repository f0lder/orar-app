var express = require("express");
const mongoose = require("mongoose");
const { all } = require(".");

var router = express.Router();

const materii = require("../models").materii;
const profi = require("../models.js").profi;
const grupe = require("../models.js").grupe;

async function getData() {
    return await materii.find({});
}

function getProfByID(profID) {
    return profi.findOne({ "id": profID });
}

router.get('/', function (req, res, next) {
    if (req.session.loggedin) {
        var i = 0;
        let c = getData();
        c.then((data) => {
            data.forEach(element => {
                let p = getProfByID(element.idProfesor);
                p.then((d) => {
                    //console.log(d);
                    element._doc.prof = d._doc.nume;
                    i++;
                    if (i == data.length) {
                        res.render('materii', { materii: data });
                    }
                });
            });
        });
    } else {
        res.render('index', { redirected: true, title: "Orar-app" });
    }

});


//TODO move this to grupe.js
async function getGrupaByCode(code) {
    return await grupe.findOne({ "cod": code });
}

router.get('/grupa/cod=:cod', function (req, res, next) {
    const cod = req.params.cod;

    let c = getGrupaByCode(cod);
    c.then((data) => {
        res.render('grupa', { grupa: data });
    });
});



//exemple data
d = {
    "_id": "654646055f4292c0d3510ca3",
    "id": 1,
    "nume": "Proiectare software",
    "curs": true,
    "laborator": false,
    "seminar": false,
    "proiect": true,
    "idProfesor": 1,
    "idGrupa": ["1241", "1231"]
}
module.exports = router;