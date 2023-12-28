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
        res.render('profi', { title: "Profesori", profi: data, materii: allMaterii });
    } else {
        res.render('index', { redirected: true, title: "Orar-app" });
    }
});

module.exports = router;