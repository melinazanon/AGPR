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


app.get('/sessionLoeschen', function(req,res){
	
	delete req.session['sessionValue'];
	res.redirect('/');
});
let message ="";

app.get('/', function (req,res){
	message = req.query.valid;
	console.log(message);
	
	res.render('anmelden', {'message' : message});
	
	db.all(`SELECT * FROM users`,function(error,rows){
		console.log(rows);
	});

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
	const sql1 =`SELECT user FROM users WHERE user='${user}'`;
	let newUser= true;
	db.get(sql1,(error,row)=>{
		if(error){
			console.log(error.massage);
			
		}
		else{
			if(row != null){
				console.log(row.user);
				newUser= false;
				res.redirect('/?valid='+'Benutzername existiert bereits');
			}
			if(newUser==true){
				const sql = `INSERT INTO users (user,password) VALUES ('${user}', '${password}')`;
				console.log(sql);
				db.run(sql, function(err){
					req.session['sessionValue']= Math.floor(Math.random(100)*100);
					res.redirect('/onProfile?valid='+user);
				});
			}
		}
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
				req.session['sessionValue']= Math.floor(Math.random(100)*100);
				res.redirect('/onProfile?valid='+user);
			}
			else{
				res.redirect('/error');
			}
		}
	});
	
});

app.get('/onProfile', (req, res, user) => {
	var user = req.query.valid;
	if(req.session['sessionValue']){
		res.render('profil',{ 'user': user});
	}
	else{
		res.render('error');
	}
 
});