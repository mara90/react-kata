var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3001;

var con = mysql.createConnection({
  user: "admin",
  password: "admin",
  database: "react_db",
  host: "localhost",
  port: 3306,
  max: 10
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' }));

var router = express.Router();

router.use(function(request, response, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});
/*
router.get('/', function(request, response) {
    response.json({ message: 'hooray! welcome to our api!' });   
});
*/
app.use('/api', router);



app.use(function(request,response, next){ //request from react client site, all the way back to epress api
	response.header("Access-control-Allow-Origin", "*");
	response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	response.header("Access-control-Allow-Headers", "Origin, X-Requested-With, Accept");
	next();
});


app.post('/api/add',function(request,response){

	var ar = request.body;
	var first;
	for (obj in ar)
		first = JSON.parse(obj);
	var description = (first['description']);
	
	var sql = "INSERT INTO alarm_device (description) VALUES ('" + description + "')";
		con.query(sql, function (err, result) {
	    if (err) 
    	{
    		return response.status(400).send(err);

    	}
    	else{
    		return response.status(200).send(({msg:description}));
    		
    	}

	});

	
	
});
			


app.get('/api/list',function(request,response){
  	var sql = "SELECT * FROM alarm_device";
		con.query(sql, function (err, result) {
	    if (err) 
    	{
    		return response.status(400).send(err);
    	}
    	else{
    		return response.status(200).send(result);
    	}
	});
});


app.post('/api/alert',function(request,response){

	var ar2 = request.body;
	var first;
	for (obj2 in ar2)
		first = JSON.parse(obj2);
	var id = (first['id']);

	var time = Math.floor(Date.now() / 1000);

	var sql = "INSERT INTO alarm_log (created_date, alarm_device_id) VALUES ('" + time + "' ,'" + id + "')";
		con.query(sql, function (err, result) {
	    if (err) 
    	{
    		return response.status(400).send(err);
    	}
    	else{
    		return response.status(200).send(({msg:id}));
    	}
	});
	
});
	

app.get('/api/report',function(request,response){
	
  	var sql = "SELECT * FROM alarm_log ORDER BY created_date DESC";
		con.query(sql, function (err, result) {
	    if (err) 
    	{
    		return response.status(400).send(err);
    	}
    	else{
    		return response.status(200).send(result);
    	}
	});
})





app.listen(port, () => console.log("listening to port "+port));