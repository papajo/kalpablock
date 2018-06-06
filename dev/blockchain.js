const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');

//use strict mode;
function Blockchain() {
	this.chain = [];
	this.pendingTransactions = [];

	this.currentNodeUrl = currentNodeUrl;
	this.networkNodes = [];

	//Starter block with arbitrary input
	this.createNewBlock(100, '0', '0');
}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
	const newBlock = {
		index: this.chain.length + 1, 
		timestamp: Date.now(),
		transactions: this.pendingTransactions,
		nonce: nonce,
		hash: hash,
		previousBlockHash: previousBlockHash
	}

	this.pendingTransactions = [];
	this.chain.push(newBlock);

	return newBlock;
}

Blockchain.prototype.getLastBlock = function() {
	return this.chain[this.chain.length - 1];
}

Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
	const newTransaction = {
		amount: amount,
		sender: sender,
		recipient: recipient,
		transactionId: uuid().split('-').join('')
	};

	return newTransaction;
};

//
Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj) {
	this.pendingTransactions.push(transactionObj);
	return this.getLastBlock()['index'] + 1;
};

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
	const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
	const hash = sha256(dataAsString);
	return hash;
};

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
	//repeat the process of hasBlock until it finds the correct hash starting with '0000'
	//using currentBlockData and previousBlockHash continuously updating the nonce value
	//returns the nonce value that produces a hash value with starting '0000'.
	let nonce = 0;
	let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	while (hash.substring(0, 4) !== '0000') {
		nonce++;
		hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
		//console.log(hash)
	}	
	return nonce;
};

Blockchain.prototype.chainIsValid = function(blockchain) {
	let validChain = true;
	// loop through entire blockchain to ensure the validity
	for(var i = 1; i < blockchain.length; i++) {
		const currBlock = blockchain[i];
		const prevBlock = blockchain[i - 1];
		// save each block and rehash it
		const blockHash = this.hashBlock(prevBlock['hash'], {transactions: currBlock['transactions'], index: currBlock['index']}, currBlock['nonce']);
		// validate the absolute hash data
		if (blockHash.substring(0, 4) !== '0000') validChain = false;
		// cross validate the hash data between adjacent blocks
		if (currBlock['previousBlockHash'] !== prevBlock['hash']) validChain = false;

		// console log
		console.log('previousBlockHash => ', prevBlock['hash']);
		console.log('currentBlockHash => ', currBlock['hash']);
	};
	// check the genesis block to make sure its a valid block.
	const genesisBlock = blockchain[0];
	const correctNonce = genesisBlock['nonce'] === 100;
	const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
	const correctHash = genesisBlock['hash'] === '0';
	const correctTransactions = genesisBlock['transactions'].length === 0;

	if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) validChain = false;
	
	return validChain;
};

// block explorer steps
Blockchain.prototype.getBlock = function(blockHash) {
	let correctBlock = null;
	this.chain.forEach(block => {
		if (block.hash === blockHash) correctBlock = block;
	});
	return correctBlock;
}


module.exports = Blockchain;