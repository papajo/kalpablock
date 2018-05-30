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
//	res.send('Nothing here yet.. try others...')
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

//
app.post('/transaction/broadcast', function(req, res) {
	const newTransaction = kalpacoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
	kalpacoin.addTransactonToPendingTransactions(newTransaction);

	const requestPromises = [];
	kalpacoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/transaction',
			method: 'POST',
			body: newTransaction,
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
	.then(data => {
		res.json({ note: 'transaction created and brodcast successfully!' });
	});
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
app.post('/register-and-broadcast-node', function(req, res){ 
	const newNodeUrl = req.body.newNodeUrl;
	if(kalpacoin.networkNodes.indexOf(newNodeUrl) == -1) kalpacoin.networkNodes.push(newNodeUrl);

	const regNodesPromises = [];
	kalpacoin.networkNodes.forEach(networkNodeUrl => {
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
	 		body: { allNetworkNodes: [ ...kalpacoin.networkNodes, kalpacoin.currentNodeUrl ] },
	 		json: true
	 	};
	 	return rp(bulkRegisterOptions);	
	 })
	 .then(data => {
	 	res.json({ note: 'new node registered with network successfully! '});
	 });
});

// receiving nodes should register a broascasting node Url with the network
app.post('/register-node', function(req, res){ 
	const newNodeUrl = req.body.newNodeUrl;
	const nodeNotAlreadyPresent = kalpacoin.networkNodes.indexOf(newNodeUrl) == -1
	const notCurrentNode = kalpacoin.currentNodeUrl !== newNodeUrl;
	if (nodeNotAlreadyPresent && notCurrentNode) kalpacoin.networkNodes.push(newNodeUrl);
	res.json({ note: 'new node registered successfully!' });
});

// register multiple nodes at once - after this runs all the nodes will be registerd with the current network
app.post('/register-nodes-bulk', function(req, res){
	const allNetworkNodes = req.body.allNetworkNodes;
	allNetworkNodes.forEach(networkNodeUrl => {
		const nodeNotAlreadyPresent = kalpacoin.networkNodes.indexOf(networkNodeUrl) == -1;
		const notCurrentNode = kalpacoin.currentNodeUrl !== networkNodeUrl;
		if (nodeNotAlreadyPresent && notCurrentNode) kalpacoin.networkNodes.push(networkNodeUrl);
	});

	res.json({ note: 'bulk registration successful!' });
});


app.listen(port, () => {
	console.log(`Listening on port ${ port }...`);
});