const sha256 = require('sha256');

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

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
	//repeat until a valid hash starting with '0000' is found
	//using previousHasBlock and currentBlockData and constantly changing the nonce value
	//until a valid hash is found. 
	//return the nonce value that creates a correct hash value.
	let nonce = 0;
	let hash = 0;
	//let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	while (hash.substr(0, 4) !== '0000') {
		nonce++;
		let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	}	 
	return nonce;
}

module.exports = Blockchain;