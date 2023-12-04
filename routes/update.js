var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");

const sali = require('../models').sali;

async function getSalaByID(id){
    return await sali.findById(id);
}
async function updateSale(id){
    return await sali.updateOne({_id:id},{corp:"X"});
}
router.get('/',function(req,res,next){
    res.render('update');
});

/*

tip:
    1 - sali
    2 - materii

*/

router.get('/id=:id&tip=:tip',function(req,res,next){
    const id = req.params.id;
    const type = req.params.tip;

    res.render('update',{ID:id,tip:type});


    if(type == 1){
        let c = updateSale(id);
        c.then((data)=>{
            console.log(data);
        });
    }
});

module.exports = router;