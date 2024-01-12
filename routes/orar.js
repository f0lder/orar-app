var express = require("express");

const models = require("../models");

var router = express.Router();

router.get('/',async function (req, res, next) {
    if (req.session.loggedin) {

        let data = await models.materii.find({});

        let s = await models.sali.find({});

        let g = await models.grupe.find({});

        res.render('createOrar', { title: 'Orar', materii: data, grupe: g, sali: s,loggedin: req.session.loggedin });

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
            ora:[{
                tip: data.tipluni9,
                Materie: data.luni[0],
                idSala: data.salaluni[0]
            },{
                tip: data.tipluni11,
                Materie: data.luni[1],
                idSala: data.salaluni[1]
            },{
                tip: data.tipluni13,
                Materie: data.luni[2],
                idSala: data.salaluni[2]
            },{
                tip: data.tipluni15,
                Materie: data.luni[3],
                idSala: data.salaluni[3]
            },{
                tip: data.tipluni17,
                Materie: data.luni[4],
                idSala: data.salaluni[4]
            }]
        });

        const Marti = new models.zile({
            ora:[{
                tip: data.tipmarti9,
                Materie: data.marti[0],
                idSala: data.salamarti[0]
            },{
                tip: data.tipmarti11,
                Materie: data.marti[1],
                idSala: data.salamarti[1]
            },{
                tip: data.tipmarti13,
                Materie: data.marti[2],
                idSala: data.salamarti[2]
            },{
                tip: data.tipmarti15,
                Materie: data.marti[3],
                idSala: data.salamarti[3]
            },{
                tip: data.tipmarti17,
                Materie: data.marti[4],
                idSala: data.salamarti[4]
            }]
        });

        const Miercuri = new models.zile({
            ora:[{
                tip: data.tipmiercuri9,
                Materie: data.miercuri[0],
                idSala: data.salamiercuri[0]
            },{
                tip: data.tipmiercuri11,
                Materie: data.miercuri[1],
                idSala: data.salamiercuri[1]
            },{
                tip: data.tipmiercuri13,
                Materie: data.miercuri[2],
                idSala: data.salamiercuri[2]
            },{
                tip: data.tipmiercuri15,
                Materie: data.miercuri[3],
                idSala: data.salamiercuri[3]
            },{
                tip: data.tipmiercuri17,
                Materie: data.miercuri[4],
                idSala: data.salamiercuri[4]
            }]
        });


        const Joi = new models.zile({
            ora:[{
                tip: data.tipjoi9,
                Materie: data.joi[0],
                idSala: data.salajoi[0]
            },{
                tip: data.tipjoi11,
                Materie: data.joi[1],
                idSala: data.salajoi[1]
            },{
                tip: data.tipjoi13,
                Materie: data.joi[2],
                idSala: data.salajoi[2]
            },{
                tip: data.tipjoi15,
                Materie: data.joi[3],
                idSala: data.salajoi[3]
            },{
                tip: data.tipjoi17,
                Materie: data.joi[4],
                idSala: data.salajoi[4]
            }]
        });


        const Vineri = new models.zile({
            ora:[{
                tip: data.tipvineri9,
                Materie: data.vineri[0],
                idSala: data.salavineri[0]
            },{
                tip: data.tipvineri11,
                Materie: data.vineri[1],
                idSala: data.salavineri[1]
            },{
                tip: data.tipvineri13,
                Materie: data.vineri[2],
                idSala: data.salavineri[2]
            },{
                tip: data.tipvineri15,
                Materie: data.vineri[3],
                idSala: data.salavineri[3]
            },{
                tip: data.tipvineri17,
                Materie: data.vineri[4],
                idSala: data.salavineri[4]
            }]
        });

        const orar = new models.orare({
            grupa: data.grupa,
            zile: [Luni, Marti, Miercuri, Joi, Vineri]
        });

        await orar.save();

        res.redirect('/orar');

    }

});

const {jsPDF} = require('jspdf');
const autoTable = require('jspdf-autotable');

router.get('/all',async function (req, res) {
    if (req.session.loggedin) {

        let data = await models.orare.find({});

        data.forEach(e => {
            const doc = new jsPDF();

            doc.text("Grupa: "+e.grupa, 10, 10);

            doc.autoTable({
                head: [['Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri']],
                body:[[
                    e.zile[0].ora[0].Materie, 
                    e.zile[1].ora[0].Materie,
                    e.zile[2].ora[0].Materie,
                    e.zile[3].ora[0].Materie,
                    e.zile[4].ora[0].Materie
                ]]  
            });

            const data = doc.output('datauristring');

            e.pdf=data;
        });

        res.render('orare', { title: 'Orare', orare: data,loggedin: req.session.loggedin });

    } else {
        res.render('index', { redirected: true, title: "Orar-app" });
    }
});


router.get('/delete/:id',async function (req, res) {
    if (req.session.loggedin) {

        await models.orare.findByIdAndDelete(req.params.id);

        res.redirect('/orar/all');

    } else {
        res.render('index', { redirected: true, title: "Orar-app" });
    }
});

module.exports = router;