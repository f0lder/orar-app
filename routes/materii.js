var express = require("express");
const mongoose = require("mongoose");

var router = express.Router();

const materii = require("../models").materii;
const profi = require("../models.js").profi;
const grupe = require("../models.js").grupe;


async function getProfByID(profID) {
    return profi.findOne({ "id": profID });
}

router.get('/', async function (req, res) {
    if (req.session.loggedin) {
        try {
            let data = await materii.find({});
            for (let e of data) {
                let d = await getProfByID(e.idProfesor);
                e._doc.prof = d._doc.nume;
            }
            let maxID = await materii.find({}).sort({ id: -1 }).limit(1);
            let allProfi = await profi.find({});
            let allGrupe = await grupe.find({});
            res.render('materii', { materii: data , maxID: maxID[0].id + 1, profi: allProfi, grupe: allGrupe});
        }
        catch (err) {
            console.log(err);
        }
    } else {
        res.render('index', { redirected: true, title: "Orar-app" });
    }
});

router.post("/insertMaterie", async function (req, res) {
    if (req.session.loggedin) {

        const Materie = new materii({
            id: req.body.id,
            nume: req.body.nume,
            curs: req.body.Curs == 'on',
            laborator: req.body.Laborator == 'on',
            seminar: req.body.Seminar == 'on',
            proiect: req.body.Proiect == 'on',
            idProfesor: req.body.prof,
            idGrupa: req.body.grupe
        });
        await Materie.save().then(() => {
            res.redirect("/materii");
        }).catch((err) => {
            console.log(err)
        });
    }
});
module.exports = router;