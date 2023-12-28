var express = require("express");
const mongoose = require("mongoose");
const { all } = require(".");

var router = express.Router();

const grupe = require('../models').grupe;

router.get('/', async function (req, res,) {
    if (req.session.loggedin) {
        await grupe.find({}).then((data) => {
            res.render("grupe", { grupe: data });
        });
    }
    else {
        res.render('index', { redirected: true, title: "Orar-app" });
    }
});

router.post('/insertGrupa', function (req, res) {

    if (!req.session.loggedin) {
        res.render('index', { redirected: true, title: "Orar-app" });
    } else {
        const { cod, nSemigrupe, nStudenti, an, idSpec } = req.body;
        const newGrupa = new grupe({
            cod: cod,
            nSemigrupe: nSemigrupe,
            nStudenti: nStudenti,
            an: an,
            idSpec: idSpec
        });
        newGrupa.save().then((data) => {
            res.redirect('/grupe');
        });
    }
});

router.get('/cod=:cod', async function (req, res) {

    grupe.findOne({ "cod": req.params.cod }).then((data) => {
        res.render('grupa', { grupa: data });
    });
});

module.exports = router;