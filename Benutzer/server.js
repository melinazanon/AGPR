const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('users.db',(error)=>{
	if (error){
		console.error (error.message);
	}
	console.log('Connected to database users')
});

//db.run(`CREATE TABLE users(id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT NOT NULL, password TEXT NOT NULL)`);


const express = require('express');
const app = express()
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

// initialize ejs template engine
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

// Webserver starten http://localhost:3000
app.listen(3000, function(){
	console.log("listening on 3000");
});

//Initialisierugn von sessions

const session = require('express-session');
app.use(session({
	
	secret: 'example',
	resave: false,
	saveUnitialized:true
}));

app.get('/sessionSetzen', function(req,res){
	
	req.session['sessionValue']= Math.floor(Math.random(100)*100);
	res.redirect('/onProfile');
});

app.get('/sessionLoeschen', function(req,res){
	
	delete req.session['sessionValue'];
	res.redirect('/');
});


app.get('/', function (req,res){
	
	res.render('anmelden');

});

app.get('/login', function (req,res){
	
	res.render('login');

});

app.get('/error', (req, res) => {
  res.render('error');
});

app.post('/onNewUser', function(req, res){
	const user = req.body["userName"];
	const password = req.body["password"];
	
	const sql = `INSERT INTO users (user,password) VALUES ('${user}', '${password}')`;
	console.log(sql);
	db.run(sql, function(err){
		res.redirect('/sessionSetzen');
	});
});

app.post('/onLogin', function(req, res){
	const user = req.body["user"];
	const password = req.body["password"];
	
	const sql = `SELECT password FROM users WHERE user ='${user}'`;
	console.log(sql);
	db.get(sql,(error,row)=>{
		if(error){
			console.log(error.massage);
		}
		else{
			console.log(row.password);
			if(password==row.password){
				res.redirect('/sessionSetzen');
			}
			else{
				res.redirect('/error');
			}
		}
	});
	
});

app.get('/onProfile', (req, res) => {
	if(req.session['sessionValue']){
		res.render('profil');
	}
	else{
		res.render('error');
	}
 
});