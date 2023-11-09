const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	email: String,
	username: String,
	pass: String
});
const SaliSchema = new mongoose.Schema({
	corp: String,
	etaj: Number,
	numar: Number,
	capacitate: Number
}, {
	versionKey: false
});

const UniSchema = new mongoose.Schema({
	nume: String,
});

const FacSchema = new mongoose.Schema({
	id: Number,
	nume: String,
});

const DepSchema = new mongoose.Schema({
	id: Number,
	nume: String,
	idFac: Number
});

const SpecSchema = new mongoose.Schema({
	id: Number,
	nume: String,
	idDep: Number
});

const GrupeSchema = new mongoose.Schema({
	cod: String,
	nSemigrupe: Number,
	nStudenti: Number,
	an: Number,
	idSpec: Number
});

const MaterieSchema = new mongoose.Schema({
	id: Number,
	nume: String,
	curs: Boolean,
	laborator: Boolean,
	seminar: Boolean,
	proiect: Boolean,
	idProfesor: Number,
	idGrupa: [String]
});
const ProfSchema = new mongoose.Schema({
	id: Number,
	nume: String,
	idMaterii: [Number],
});
const OraSchema = new mongoose.Schema({
	tip: Number,
	Materie: [MaterieSchema],
	idSala: Number,
	oraInceput: Number,
	oraSf: Number,

});
const ZiSchema = new mongoose.Schema({
	ora1: OraSchema, // 9 - 11
	ora2: OraSchema, // 11 - 13
	ora3: OraSchema, // 13 -15
	ora4: OraSchema, // 15 - 17
	ora5: OraSchema, // 17 - 19
});
const OrarSchema = new mongoose.Schema({
	grupa: String,
	luni: ZiSchema,
	marti: ZiSchema,
	miercuri: ZiSchema,
	joi: ZiSchema,
	vineri: ZiSchema,
});

module.exports ={UserSchema,SaliSchema,UniSchema,FacSchema,DepSchema,SpecSchema,GrupeSchema,MaterieSchema,ProfSchema,OrarSchema,OraSchema,ZiSchema}