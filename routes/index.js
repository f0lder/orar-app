var express = require("express");
const mongoose = require("mongoose");

var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
	res.render("index", { title: "Express" });
});

mongoose
    .connect(
        process.env.MONGODB_URL,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

const UserSchema = new mongoose.Schema({
	email: String,
	username: String,
	pass: String
})

const users = mongoose.model('users',UserSchema);

async function getUser(username,password){
	const Users = await users.findOne({username:username,pass:password});
	return Users;
}

router.post("/auth", function (request, response) {
	let username = request.body.username;
	let password = request.body.password;

	console.log("Name: " + username + "\nPassword: " + password + "\n");

	if (username && password) {

		let CurrentUser = getUser(username,password);
		CurrentUser.then((user)=>{
			console.log(user);
			if(user != null){
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect("/home");
			}else{
				response.send("Incorrect user or pass!");
			}
		});
	} else {
		response.send("Please enter user and pass");
		response.end();
	}
});

router.get("/home", function (request, response) {
	if (request.session.loggedin) {
		response.send("Wellcome back," + request.session.username + "!");
	} else {
		response.send("Please login to acces this page");
	}
});

module.exports = router;
