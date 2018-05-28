//API 
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

//app.get('/', function(req, res) {
//	res.send('App started...')
//})

//fetch entire blockchain
app.get('/blockchain', function(req, res) {
	res.send("blockchain working!!")
}); 

//create a new transaction
app.post('/transaction', function(req, res) {
	console.log(req.body);
	res.send(`transaction recieved in the amount of ${req.body.amount} bitcoins`);
});

//mine a new block
app.get('/mine', function(req, res) {
	res.send("mining working!!")
});

app.listen(3000, () => {
	console.log('Listening on port 3000...');
});