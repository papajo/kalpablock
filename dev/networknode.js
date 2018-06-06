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
	const newTransaction = req.body;
	const blockIndex = kalpacoin.addTransactionToPendingTransactions(newTransaction);
	res.json({ note: `transaction will be added in block ${blockIndex}.` });
});

//
app.post('/transaction/broadcast', function(req, res) {
	const newTransaction = kalpacoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
	kalpacoin.addTransactionToPendingTransactions(newTransaction);

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
	//kalpacoin.createNewTransaction(12.5, "00", nodeAddress);
	const newBlock = kalpacoin.createNewBlock(nonce, previousBlockHash, blockHash);

	const requestPromises = [];
	kalpacoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/receive-new-block',
			method: 'POST',
			body: { newBlock: newBlock },
			json: true
		};
		requestPromises.push(rp(requestOptions));
	});
	Promise.all(requestPromises)
	.then(data => {
		const requestOptions = {
			uri: kalpacoin.currentNodeUrl + '/transaction/broadcast',
			method: 'POST',
			body: {
				amount: 12.5,
				sender: "00",
				recipient: nodeAddress
			},
			json: true
		};
		return rp(requestOptions);
	})
	.then(data => {
		res.json({ note: "New block mined & broadcast successfully",
			   block: newBlock	
		});
	});
	
});

// receive-new-block
app.post('/receive-new-block', function(req, res){
	const newBlock = req.body.newBlock;
	const lastBlock = kalpacoin.getLastBlock();
	const correctHash = lastBlock.hash === newBlock.previousBlockHash;
	const correctIndex = lastBlock['index'] + 1 === newBlock['index'];
	if (correctHash && correctIndex) {
		kalpacoin.chain.push(newBlock);
		kalpacoin.pendingTransactions = [];
		res.json({ 
			note: 'New Block received and accepted',
			newBlock: newBlock
		});
	} else {
		res.json({ 
			note: 'New Block rejected',
			newBlock: newBlock
		});
	}
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
	const nodeNotAlreadyPresent = kalpacoin.networkNodes.indexOf(newNodeUrl) == -1;
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

app.get('/consensus', function(req, res) {
	const requestPromises = [];
	kalpacoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/blockchain',
			method: 'GET',
			json: true
		};
		requestPromises.push(rp(requestOptions));
	});
	Promise.all(requestPromises)
	.then(blockchainData => {
		const currentChainLength = kalpacoin.chain.length;
		let maxChainLength = currentChainLength;
		let newLongestChain = null;
		let newPendingTransactions = null;
		blockchainData.forEach(blockchain => {
			//if one of the blockchains is longer than the one in currentnode
			if (blockchain.chain.length > maxChainLength) {
				maxChainLength = blockchain.chain.length;
				newLongestChain = blockchain.chain;
				newPendingTransactions = blockchain.pendingTransactions;	
			};
		});
		if (!newLongestChain || (newLongestChain && !kalpacoin.chainIsValid(newLongestChain))) {
			res.json({
				note: 'The current chain has not been replaced',
				chain: kalpacoin.chain
			});
		}
		//else if (newLongestChain && kalpacoin.chainIsValid(newLongestChain)) {
		else {
			kalpacoin.chain = newLongestChain;
			kalpacoin.pendingTransactions = newPendingTransactions;
			res.json({
				note: 'This chain has been replaced',
				chain: kalpacoin.chain
			});
		}
	});
});

//Block Explorer endpoints

app.get('/block/:blockHash', function(req, res) {
	const blockHash = req.params.blockHash;
	const correctBlock = kalpacoin.getBlock(blockHash);
	res.json({ 
		block: correctBlock
	});
});

app.get('/transaction/:transactionId', function(req, res) {
	const transactionId = req.params.transactionId;
	const correctTransactionId = kalpacoin.getTransaction(transactionId);
	res.json({
		transId: correctTransactionId
	});
});

app.get('/address/:address', function(req, res) {

});



app.listen(port, () => {
	console.log(`Listening on port ${ port }...`);
});