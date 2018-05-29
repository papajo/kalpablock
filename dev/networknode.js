//API 
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const nodeAddress = uuid().split('-').join('');
const port = process.argv[2];
const rp = require('request-promise');

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

//mine a new block and process a pending transaction
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

// register a node with the local server and broadcast that node to the entire network
app.post('/register-and-broadcast', function(req, res){ 
	const newNodeUrl = req.body.newNodeUrl;
	if(bitcoin.networkNodes.indexOf(newNodeUrl) == -1) bitcoin.networkNodes.push(newNodeUrl);

	const regNodesPromies = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		// '/register-node'
		const requestOptions = {
			uri: networkNodeUrl + '/register-node',
			method: 'POST',
			body: { newNodeUrl: newNodeUrl },
			json: true
		}; 

		regNodesPromises.push(rp(requestOptions));
	});

	Promise.all(regNodesPromises)
	 .then(data => {
	 	const bulkRegisterOptions = {
	 		uri: newNodeUrl + '/register-nodes-bulk',
	 		method: 'POST',
	 		body: { allNetworkNodes: [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl ] },
	 		json: true
	 	};
	 	return rp(bulkRegisterOptions);	
	 })
	 .then(data => {
	 	res.json({ note: 'new node registered with network successfully! '});
	 });
});

// receiving nodes to register a broascasting node Url with the network
app.post('/register-node', function(req, res){ 


});

// register multiple nodes at once - after this run's all the nodes will be registerd with the current network
app.post('/register-nodes-bulk', function(req, res){


});


app.listen(port, () => {
	console.log(`Listening on port ${ port }...`);
});