const sha256 = require('sha256');
//use strict mode;
function Blockchain() {
	this.chain = [];
	this.pendingTransactions = [];
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
		recipient: recipient
	};

	this.pendingTransactions.push(newTransaction);

	return this.getLastBlock()['index'] + 1;
}

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
	const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
	const hash = sha256(dataAsString);
	return hash;
}

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData, nonce) {
	//repeat the process of hasBlock until it finds the correct hash starting with '0000'
	//using currentBlockData and previousBlockHash continuously updating the nonce value
	//returns the nonce value that produces a hash value with starting '0000'.
	nonce = 0;
	hash = '';
	while (hash.substr(0, 4) !== '0000') {
		hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
		nonce++;
	}
	return nonce;
}

module.exports = Blockchain;