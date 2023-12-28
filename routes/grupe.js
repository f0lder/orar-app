var express = require("express");
const mongoose = require("mongoose");
const { all } = require(".");

var router = express.Router();

const grupe = require('../models').grupe;

router.get('/', async function (req, res,) {
    await grupe.find({}).then((data) => {
        res.render("grupe", { grupe: data });
    });
});

router.post('/insertGrupa', function (req, res) {

    if(req.session.loggedin){
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

module.exports = router;