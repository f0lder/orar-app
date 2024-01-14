var express = require("express");
const mongoose = require("mongoose");

var router = express.Router();

const profi = require('../models').profi;
const materii = require('../models').materii;

router.get('/', async function (req, res) {
    if (req.session.loggedin) {
        let data = await profi.find({});
        for (let e of data) {
            let d = await materii.find({ idProfesor: e.id });
            e.materii = d;
        }
        let allMaterii = await materii.find({});
        let maxID = await profi.find({}).sort({ id: -1 }).limit(1);
        res.render('profi', { title: "Profesori", loggedin: req.session.loggedin, profi: data, materii: allMaterii, maxID: maxID[0].id + 1 });
    } else {
        res.render('index', { redirected: true, title: "Orar-app" });
    }
});
router.post("/insertProf", async function (req, res) {
    if (req.session.loggedin) {
        const Prof = new profi({
            id: req.body.id,
            nume: req.body.nume,
            idMaterii: req.body.materii
        });
        await materii.updateMany({ idProfesor: req.body.materii }, { idProfesor: req.body.id });
        await Prof.save().then(() => {
            res.redirect("/profi");
        }).catch((err) => {
            console.log(err)
        });
    }
});


router.get("/id=:id", async function (req, res) {

    let p = await profi.findById(req.params.id);

    let m = await materii.find({ idProfesor: p.id });

    console.log(m);

    res.render("prof",{loggedin: req.session.loggedin, prof: p, materii: m});
});
module.exports = router;