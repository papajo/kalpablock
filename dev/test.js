// testing testing
const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();
const previousBlockHash = 'LKJASLJDLA87878';
const currentBlockData = [
	{
		amount: 100,
		sender: 'KJSLKJAD098ABC',
		recipient: 'OIUYLKJASD98XYZ'
	},
	{
		amount: 200,
		sender: 'DFDKJSLKJAD098ABC',
		recipient: '124SDFGLKJASD98QWR'
	},
	{
		amount: 300,
		sender: 'SSWEKJSLKJAD098ABC',
		recipient: 'QWDS23LKJASD98QWR'
	},
];
//test proofOfWork

//console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData));
//cross validate the nonce
console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, 31769));

//test hashBlock Step using SHA-256 encryption method

//console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce));

//The following work fine
//bitcoin.createNewBlock(1234, 'OIIHASDO23234243', 'UIHKH657532');
//bitcoin.createNewBlock(1235, '323HASDO23234243', '121UIHKH657532');
//bitcoin.createNewBlock(1236, '2324HASDO23234243', '212UIHKH657532');
//
//console.log(bitcoin);