var express = require("express");
const mongoose = require("mongoose");
const { all } = require(".");

var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('createOrar');
});

module.exports = router;