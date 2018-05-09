const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.engine('.ejs',require('ejs').__express);
app.set('view engine','ejs');

const port =3000;

app.listen(port,function(){
	console.log('listening on port '+ port);
});

app.get('/',function(req,res){
	res.sendFile(__dirname+'/start.html');
});

app.post('/calculate', function(req,res){
	const bitrate = req.body['bitrate'];
	const duration = req.body['duration'];
	
	if(isNaN(bitrate) || isNaN(duration)){
		console.log('bitte nur zahlen eingeben');
		res.render('error',{
			'bitrate': bitrate,
			'duration': duration,
			'message':'Bitte Eingabe überprüfen'
			
		});
	}
	else if(bitrate< 0 || duration < 0){
		console.log('bitte positive zahlen eingeben');
		res.render('error',{
			'bitrate': bitrate,
			'duration': duration,
			'message':'Bitte Eingabe überprüfen'
			
		});
	}
	else{
		console.log('bitrate: ' +bitrate+' duration: '+duration);
		res.render('result',{
			'bitrate': bitrate,
			'duration': duration,
			'result': bitrate+duration
			
		});
	}
	
});

