const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlcoded({extended: true}));

app.engine('.ejs',require('ejs').__express);
app.set('view engine','ejs');

const port =3000;

app.listen(port,function(){
	console.log('listening on port '+ port);
});

