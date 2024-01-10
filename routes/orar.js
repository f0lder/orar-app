var express = require("express");

const models = require("../models");

var router = express.Router();

router.get('/',async function (req, res, next) {
    if (req.session.loggedin) {

        let data = await models.materii.find({});

        let s = await models.sali.find({});

        let g = await models.grupe.find({});

        res.render('createOrar', { title: 'Orar', materii: data, grupe: g, sali: s });

    } else {
        res.render('index', { redirected: true, title: "Orar-app" });
    }
});

router.post('/insertOrar',async function (req, res) {

    if (!req.session.loggedin) {
        res.render('index', { redirected: true, title: "Orar-app" });
    } else {
        const data = req.body;

        

        const Luni = new models.zile({
            ora1:
            {
                tip: data.tipluni9,
                Materie: data.luni[0],
                idSala: data.saliluni[0]
            },
            ora2:
            {
                tip: data.tipluni11,
                Materie: data.luni[1],
                idSala: data.saliluni[1]
            },
            ora3:
            {
                tip: data.tipluni13,
                Materie: data.luni[2],
                idSala: data.saliluni[2]
            },
            ora4:
            {
                tip: data.tipluni15,
                Materie: data.luni[3],
                idSala: data.saliluni[3]
            },
            ora5:
            {
                tip: data.tipluni17,
                Materie: data.luni[4],
                idSala: data.saliluni[4]
            }
        });


        // const orar = new models.orare({
        //     idGrupa: data.grupa,
        //     zile: [Luni,Marti,Miercuri,Joi,Vineri]
        // });

        // await orar.save();

        console.log(data);

        //res.redirect('/orar');

    }

});

module.exports = router;