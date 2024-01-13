const schemas = require("./schemas.js");

const mongoose = require("mongoose");

const users_2 = mongoose.model("users_2",schemas.UserSchema,"users_2");

const sali = mongoose.model('sali', schemas.SaliSchema, "sali");
const facultati = mongoose.model('facultate', schemas.FacSchema, 'facultati');
const departamente = mongoose.model('departament', schemas.DepSchema, 'departamente');
const specializari = mongoose.model('specializare', schemas.SpecSchema, 'specializari');
const grupe = mongoose.model('grupa', schemas.GrupeSchema, 'grupe');
const materii = mongoose.model('materie', schemas.MaterieSchema, 'materii');
const profi = mongoose.model('prof', schemas.ProfSchema, 'profi');
const ore = mongoose.model('ora', schemas.OraSchema, 'ore');
const zile = mongoose.model('zi', schemas.ZiSchema, 'zile');
const orare = mongoose.model('orar', schemas.OrarSchema, 'orare');


module.exports = {users_2,sali,facultati,departamente,specializari,grupe,materii,profi,ore,zile,orare}