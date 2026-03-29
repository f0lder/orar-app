var express = require("express");

var router = express.Router();

const grupe = require('../models').grupe;

router.get('/', async function (req, res,) {
    if (req.session.loggedin) {
        await grupe.find({}).then((data) => {
            res.render("grupe", { grupe: data,loggedin: req.session.loggedin });
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

const orare = require('../models').orare;

router.get('/cod=:cod', async function (req, res) {

    const grupa = await grupe.findOne({ "cod": req.params.cod });

    const or = await orare.find({"grupa":req.params.cod});

    res.render('grupa', { grupa: grupa,orare:or, loggedin: req.session.loggedin });
});

module.exports = router;