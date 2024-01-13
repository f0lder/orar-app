const mongoose = require("mongoose");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
	email: String,
	username:{
		type:String,
		required:true
		},
	hash: String,
	salt: String
});

UserSchema.methods.setPassword = function (password) {
 
    // Creating a unique salt for a particular user
    this.salt = crypto.randomBytes(16).toString('hex');
 
    // Hashing user's salt and password with 1000 iterations,
    //64 length and sha512 digest
    this.hash = crypto.pbkdf2Sync(password, this.salt,
        1000, 64, `sha512`).toString(`hex`);
};

UserSchema.methods.validPassword = function (password) {
	let hash = crypto.pbkdf2Sync(password,
		this.salt, 1000, 64, `sha512`).toString(`hex`);

	console.log("Hash: " + this.hash + "\n");
 
	return this.hash === hash;
};


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
	tip:String,
	Materie: String,
	idSala: String,
});
const ZiSchema = new mongoose.Schema({
	ora: [OraSchema], // 9 - 11
});
const OrarSchema = new mongoose.Schema({
	grupa: String,
	zile: [ZiSchema],
});

module.exports ={UserSchema,SaliSchema,UniSchema,FacSchema,DepSchema,SpecSchema,GrupeSchema,MaterieSchema,ProfSchema,OrarSchema,OraSchema,ZiSchema}