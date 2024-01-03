var express = require("express");
const mongoose = require("mongoose");
const { all } = require(".");

const materii = require("../models").materii;
const grupe = require("../models").grupe;

var router = express.Router();

router.get('/',async function (req, res, next) {
    if (req.session.loggedin) {

        let data =await materii.find({});

        let g = await grupe.find({});

        res.render('createOrar', { title: 'Orar', materii: data, grupe: g });

    } else {
        res.render('index', { redirected: true, title: "Orar-app" });
    }
});

module.exports = router;