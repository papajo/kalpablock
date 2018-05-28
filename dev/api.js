//API 
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const nodeAddress = uuid().split('-').join('');

const kalpacoin = new Blockchain();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

//app.get('/', function(req, res) {
//	res.send('App started...')
//})

//fetch entire blockchain
app.get('/blockchain', function(req, res) {
	res.send(kalpacoin);
}); 

//create a new transaction
app.post('/transaction', function(req, res) {
	const blockIndex = kalpacoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
	res.json({ note: `transaction will be added in block ${blockIndex}.` });

});

//mine a new block
app.get('/mine', function(req, res) {
	const lastBlock = kalpacoin.getLastBlock();
	const previousBlockHash = lastBlock['hash'];
	const currentBlockData = {
		transactions: kalpacoin.pendingTransactions,
		index: lastBlock['index'] + 1
	}
	const nonce = kalpacoin.proofOfWork(previousBlockHash, currentBlockData);
	const blockHash = kalpacoin.hashBlock(previousBlockHash, currentBlockData, nonce);
	//mining reward 12.5 as of 2018
	kalpacoin.createNewTransaction(12.5, "00", nodeAddress);
	const newBlock = kalpacoin.createNewBlock(nonce, previousBlockHash, blockHash);

	res.json({ note: "New block mined successfully",
			   block: newBlock	
	})
});

app.listen(3000, () => {
	console.log('Listening on port 3000...');
});